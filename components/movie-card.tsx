"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  priority = false,
  isFav = false,
  isWatchlisted = false,
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
  priority?: boolean;
  isFav?: boolean;
  isWatchlisted?: boolean;
}) {
  const router = useRouter();
  const { token, user } = useAuth();
  const canEdit = user?.role === "ADMIN" || user?.role === "EDITOR";
  const isLoggedIn = !!token;

  const [fav, setFav] = useState(isFav);
  const [watchlist, setWatchlist] = useState(isWatchlisted);
  const [loadingAction, setLoadingAction] = useState(false);

  const handleToggleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return alert("Please sign in to favorite movies.");
    setLoadingAction(true);
    try {
      const res = await fetch(`${API_URL}/favourite/toggle/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setFav(!fav);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleToggleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return alert("Please sign in to add to watchlist.");
    setLoadingAction(true);
    try {
      const res = await fetch(`${API_URL}/watchlist/toggle/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setWatchlist(!watchlist);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this movie?")) return;

    const response = await fetch(`${API_URL}/movie/delete/${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {}
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
            priority={priority}
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
        <div className="flex gap-2 w-full">
          <Link
            href={`/movies/${id}`}
            className="text-center bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 flex-1"
          >
            View Details
          </Link>
          {isLoggedIn && (
            <>
              <button 
                onClick={handleToggleFav} 
                disabled={loadingAction}
                className={`py-1.5 px-3 rounded border font-medium ${fav ? 'bg-pink-100 text-pink-600 border-pink-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {fav ? '♥ Fav' : '♡ Fav'}
              </button>
              <button 
                onClick={handleToggleWatchlist} 
                disabled={loadingAction}
                className={`py-1.5 px-3 rounded border font-medium ${watchlist ? 'bg-indigo-100 text-indigo-600 border-indigo-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {watchlist ? '✓ List' : '+ List'}
              </button>
            </>
          )}
        </div>
        {canEdit && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}