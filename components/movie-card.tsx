"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MovieCard({
  id,
  Poster,
  Title,
  ReleaseDate,
  Duration,
  Genre,
  Trailer,
  Actors,
  Directors,
}: {
  id: string;
  Poster: string;
  Title: string;
  ReleaseDate: string;
  Duration: string;
  Genre: string;
  Trailer: string;
  Actors: string[];
  Directors: string[];
}) {
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this movie?")) return;

    const response = await fetch(`http://localhost:8000/movie/delete/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.refresh();
    } else {
      alert("Failed to delete movie");
    }
  };

  return (
    <div className="flex h-full flex-col justify-between rounded-lg border p-2">
      <div>
        <div className="mb-2 overflow-hidden rounded-md h-72">
          <Image
            src={Poster}
            alt={`${Title} poster`}
            width={500}
            height={750}
            className="h-full w-full object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="space-y-2">
          <div className="font-semibold text-lg">{Title}</div>
          <div className="text-sm ">Release: {ReleaseDate}</div>
          <div className="text-sm ">Duration: {Duration}</div>
          <div className="text-sm ">Genre: {Genre}</div>
        </div>
        <div className="space-y-1 text-sm mt-2">
          <div>
            Trailer:{" "}
            {Trailer ? (
              <a href={Trailer} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Watch Trailer
              </a>
            ) : (
              <span className="text-gray-500">N/A</span>
            )}
          </div>
          <div className="truncate">Actors: {Actors.join(", ")}</div>
          <div className="truncate">Directors: {Directors.join(", ")}</div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Link
          href={`/movies/${id}`}
          className="text-center bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 w-full"
        >
          View Details
        </Link>
        <Link
          href={`/movies/${id}/edit`}
          className="text-center border border-blue-600 text-blue-600 py-1.5 rounded hover:bg-blue-50 w-full"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          className="text-center border border-red-500 text-red-500 py-1.5 rounded hover:bg-red-50 w-full"
        >
          Delete
        </button>
      </div>
    </div>
  );
}