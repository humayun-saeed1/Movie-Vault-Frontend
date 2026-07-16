"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function Header() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const pathname = usePathname();

  if (pathname.startsWith("/auth")) {
    return null;
  }

  return (
    <div className="flex flex-row items-center justify-between w-full p-4 border-b border-gray-200">
      {/* Movie Vault ka logo */}
      <div className="w-1/3 flex justify-start">
        <div className="font-bold text-2xl whitespace-nowrap">
          <h2>Movie Vault</h2>
        </div>
      </div>

      {/* Nav Buttons (Centered) */}
      <div className="w-1/3 flex justify-center items-center gap-6">
        <Link href="/">Home</Link>
        <Link href="/movies">Movies</Link>
        <Link href="/actors">Actors</Link>
        <Link href="/directors">Directors</Link>
        {isAdmin && <Link href="/admin" className="text-red-500 font-bold">Admin</Link>}
      </div>

      {/* User Info & Logout (Right) */}
      <div className="w-1/3 flex justify-end items-center gap-4">
        {isLoggedIn && (
          <>
            <span className="text-sm text-slate-600">Hi, {user?.username}</span>
            <button
              onClick={logout}
              className="text-sm border border-gray-300 px-3 py-1 rounded hover:bg-gray-100"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}