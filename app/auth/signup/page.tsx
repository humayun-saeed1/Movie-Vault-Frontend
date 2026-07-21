"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role: "VIEWER" }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      setSuccess("Account created! Redirecting to sign in...");
      setTimeout(() => router.push("/auth/signin"), 2000);

      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 mt-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center">Sign Up</h1>
      <form className="mt-8 space-y-5 w-full max-w-md border rounded-lg p-6 shadow-sm" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="font-semibold">Username</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Choose a username"
            className="border rounded px-3 py-2 outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-semibold">Email</label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter email"
            className="border rounded px-3 py-2 outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="font-semibold">Password</label>
          <input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Min 6 characters"
            className="border rounded px-3 py-2 outline-none focus:border-blue-500"
            minLength={6}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="confirmPassword" className="font-semibold">Confirm Password</label>
          <input
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="Confirm your password"
            className="border rounded px-3 py-2 outline-none focus:border-blue-500"
            minLength={6}
            required
          />
        </div>



        {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
        {success && <div className="text-green-600 text-sm font-medium">{success}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 mt-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <div className="text-sm text-center text-slate-600 mt-4">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-blue-600 font-medium hover:underline">Sign In</Link>
        </div>
      </form>
    </div>
  );
}
