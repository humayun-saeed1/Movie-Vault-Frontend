"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ActorFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", "1");
    router.push(`/actors?${params.toString()}`);
  };

  const handleClear = () => {
    router.push(`/actors`);
  };

  return (
    <form onSubmit={handleApply} className="bg-gray-800 p-4 rounded-md mb-8 flex gap-4 items-end">
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1">Search Actor Name</label>
        <input 
          type="text" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
          placeholder="Name..."
        />
      </div>
      <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold text-white">Search</button>
      <button type="button" onClick={handleClear} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md font-semibold text-white">Clear</button>
    </form>
  );
}
