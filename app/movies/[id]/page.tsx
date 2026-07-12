"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type MovieDetail = {
  id: string;
  name: string;
  posterURl: string;
  releaseyear: number;
  duration: string;
  genre: string;
  trailerURL: string;
  actors?: Array<{ id: string; name: string; imageURL: string }>;
  directors?: Array<{ id: string; name: string; imageURL: string }>;
};

export default function MovieViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [movie, setMovie] = useState<MovieDetail | null>(null);

  useEffect(() => {
    if (!id) return;

    async function loadMovie() {
      const response = await fetch(`http://localhost:8000/movie/get/${id}`, { cache: "no-store" });
      const data = await response.json();
      setMovie(data);
    }

    loadMovie().catch(() => {});
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this movie?")) return;

    const response = await fetch(`http://localhost:8000/movie/delete/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.push("/movies");
    }
  };

  if (!movie) {
    return <div className="text-center mt-10">Loading movie details...</div>;
  }

  return (
    <div className="p-4 mt-5">
      <h1 className="text-3xl font-bold mt-5 text-center">{movie.name}</h1>

      <div className="max-w-3xl mx-auto mt-6 rounded-lg border p-4">
        {movie.posterURl && (
          <div className="mb-4 overflow-hidden rounded-md">
            <Image
              src={movie.posterURl}
              alt={`${movie.name} poster`}
              width={600}
              height={900}
              className="w-full h-96 object-contain"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>
        )}
        <div className="space-y-2">
          <div>Release Year: {movie.releaseyear}</div>
          <div>Duration: {movie.duration}</div>
          <div>Genre: {movie.genre}</div>
          <div>
            Trailer:{" "}
            {movie.trailerURL ? (
              <a href={movie.trailerURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Watch Trailer
              </a>
            ) : (
              "N/A"
            )}
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <Link
            href={`/movies/${id}/edit`}
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

      {movie.actors && movie.actors.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Actors</h2>
          <div className="grid grid-cols-6 gap-4">
            {movie.actors.map((actor) => (
              <Link key={actor.id} href={`/actors/${actor.id}`} className="rounded-lg border p-2 hover:shadow">
                {actor.imageURL && (
                  <div className="mb-2 overflow-hidden rounded-md">
                    <img src={actor.imageURL} alt={actor.name} className="h-48 w-full object-cover" />
                  </div>
                )}
                <div className="font-semibold text-sm">{actor.name}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {movie.directors && movie.directors.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Directors</h2>
          <div className="grid grid-cols-6 gap-4">
            {movie.directors.map((director) => (
              <Link key={director.id} href={`/directors/${director.id}`} className="rounded-lg border p-2 hover:shadow">
                {director.imageURL && (
                  <div className="mb-2 overflow-hidden rounded-md">
                    <img src={director.imageURL} alt={director.name} className="h-48 w-full object-cover" />
                  </div>
                )}
                <div className="font-semibold text-sm">{director.name}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
