"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type DirectorDetail = {
  id: string;
  name: string;
  age: number;
  about: string;
  imageURL: string;
  movies?: Array<{ id: string; name: string; posterURl: string }>;
};

export default function DirectorViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [director, setDirector] = useState<DirectorDetail | null>(null);

  useEffect(() => {
    if (!id) return;

    async function loadDirector() {
      const response = await fetch(`http://localhost:8000/director/get-by-id/${id}`, { cache: "no-store" });
      const data = await response.json();
      setDirector(data);
    }

    loadDirector().catch(() => {});
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this director?")) return;

    const response = await fetch(`http://localhost:8000/director/delete/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.push("/directors");
    }
  };

  if (!director) {
    return <div className="text-center mt-10">Loading director details...</div>;
  }

  return (
    <div className="p-4 mt-5">
      <h1 className="text-3xl font-bold mt-5 text-center">{director.name}</h1>

      <div className="max-w-3xl mx-auto mt-6 rounded-lg border p-4">
        {director.imageURL && (
          <div className="mb-4 overflow-hidden rounded-md">
            <img src={director.imageURL} alt={director.name} className="w-full h-96 object-contain" />
          </div>
        )}
        <div className="space-y-2">
          <div>Age: {director.age}</div>
          <div>About: {director.about}</div>
        </div>
        <div className="mt-4 flex gap-3">
          <Link
            href={`/directors/${id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="rounded border border-red-500 px-4 py-2 text-red-500 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      {director.movies && director.movies.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Movies</h2>
          <div className="grid grid-cols-6 gap-4">
            {director.movies.map((movie) => (
              <Link key={movie.id} href={`/movies/${movie.id}`} className="rounded-lg border p-2 hover:shadow">
                {movie.posterURl && (
                  <div className="mb-2 overflow-hidden rounded-md">
                    <img src={movie.posterURl} alt={movie.name} className="h-48 w-full object-cover" />
                  </div>
                )}
                <div className="font-semibold text-sm">{movie.name}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
