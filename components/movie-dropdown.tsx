"use client";

import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";

type MovieDropdownProps = {
  movies: Array<{ id: string; name: string }>;
};

export default function MovieDropdown({ movies }: MovieDropdownProps) {
  const router = useRouter();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value) {
      router.push(`/movies/${value}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6">
      <label htmlFor="movie-select" className="block text-sm font-semibold mb-2">
        Choose a movie
      </label>
      <select
        id="movie-select"
        onChange={handleChange}
        defaultValue=""
        className="w-full border rounded px-3 py-2 text-black"
      >
        <option value="" disabled>
          Select a movie...
        </option>
        {movies.map((movie) => (
          <option key={movie.id} value={movie.id}>
            {movie.name}
          </option>
        ))}
      </select>
    </div>
  );
}
