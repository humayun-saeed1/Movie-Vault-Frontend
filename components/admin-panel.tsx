"use client";

import { useState } from "react";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminPanel({ token }: { token: string }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EDITOR");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/create-editor`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ username, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to create user.");
        return;
      }

      toast.success(`${role.charAt(0) + role.slice(1).toLowerCase()} account created successfully!`);
      setUsername("");
      setEmail("");
      setPassword("");
      setRole("EDITOR");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900 p-6 rounded-lg shadow mt-8">
      <h2 className="text-xl font-semibold text-white mb-6">Onboard New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="text-sm font-medium text-gray-300">Username</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
            className="border border-gray-700 bg-gray-800 text-white rounded px-3 py-2 outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="border border-gray-700 bg-gray-800 text-white rounded px-3 py-2 outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
          <input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Min 6 characters"
            className="border border-gray-700 bg-gray-800 text-white rounded px-3 py-2 outline-none focus:border-blue-500"
            minLength={6}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="role" className="text-sm font-medium text-gray-300">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-gray-700 bg-gray-800 text-white rounded px-3 py-2 outline-none focus:border-blue-500"
          >
            <option value="EDITOR">Editor</option>
            <option value="ADMIN">Admin</option>
            <option value="VIEWER">Viewer</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors mt-4"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
}
