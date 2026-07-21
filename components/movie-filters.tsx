"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function MovieFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [year, setYear] = useState(searchParams.get("year") || "");
  const [genre, setGenre] = useState(searchParams.get("genre") || "");
  const [director, setDirector] = useState(searchParams.get("director") || "");
  const [actor, setActor] = useState(searchParams.get("actor") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "asc");

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (year) params.set("year", year);
    if (genre) params.set("genre", genre);
    if (director) params.set("director", director);
    if (actor) params.set("actor", actor);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);
    
    // reset to page 1 on filter
    params.set("page", "1");

    router.push(`/movies?${params.toString()}`);
  };

  const handleClear = () => {
    router.push(`/movies`);
  };

  return (
    <form onSubmit={handleApply} className="bg-gray-800 p-4 rounded-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Search Title</label>
        <input 
          type="text" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="w-full px-3 py-2 bg-gray-700 rounded-md"
          placeholder="Title..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Year</label>
        <input 
          type="number" 
          value={year} 
          onChange={(e) => setYear(e.target.value)} 
          className="w-full px-3 py-2 bg-gray-700 rounded-md"
          placeholder="e.g. 2024"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Genre</label>
        <input 
          type="text" 
          value={genre} 
          onChange={(e) => setGenre(e.target.value)} 
          className="w-full px-3 py-2 bg-gray-700 rounded-md"
          placeholder="Action, Drama..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Director</label>
        <input 
          type="text" 
          value={director} 
          onChange={(e) => setDirector(e.target.value)} 
          className="w-full px-3 py-2 bg-gray-700 rounded-md"
          placeholder="Director name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Actor</label>
        <input 
          type="text" 
          value={actor} 
          onChange={(e) => setActor(e.target.value)} 
          className="w-full px-3 py-2 bg-gray-700 rounded-md"
          placeholder="Actor name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Sort By</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-3 py-2 bg-gray-700 rounded-md text-white">
          <option value="">None</option>
          <option value="title">Title</option>
          <option value="year">Year</option>
          <option value="rating">Rating</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Order</label>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full px-3 py-2 bg-gray-700 rounded-md text-white">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div className="flex items-end gap-2">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold text-white">Apply</button>
        <button type="button" onClick={handleClear} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md font-semibold text-white">Clear</button>
      </div>
    </form>
  );
}
