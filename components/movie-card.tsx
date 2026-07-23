"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

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
  averageRating = 0,
  createrId,
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
  averageRating?: number;
  createrId?: string;
}) {
  const router = useRouter();
  const { token, user } = useAuth();
  const canEdit = user?.role === "ADMIN" || user?.role === "EDITOR";
  const canDelete = user?.role === "ADMIN" || (user?.role === "EDITOR" && createrId === user?.id);
  const isLoggedIn = !!token;

  const [fav, setFav] = useState(isFav);
  const [watchlist, setWatchlist] = useState(isWatchlisted);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    setFav(isFav);
  }, [isFav]);

  useEffect(() => {
    setWatchlist(isWatchlisted);
  }, [isWatchlisted]);

  const handleToggleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return alert("Please sign in to favorite movies.");
    setLoadingAction(true);
    try {
      const res = await fetch(`${API_URL}/favourite/toggle/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setFav(!fav);
        toast.success(fav ? "Removed from favorites" : "Added to favorites");
        router.refresh();
      } else {
        toast.error("Failed to update favorites");
      }
    } catch (err) {
      toast.error("An error occurred");
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
      if (res.ok) {
        setWatchlist(!watchlist);
        toast.success(watchlist ? "Removed from watchlist" : "Added to watchlist");
        router.refresh();
      } else {
        toast.error("Failed to update watchlist");
      }
    } catch (err) {
      toast.error("An error occurred");
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
      toast.success("Movie deleted successfully");
      router.refresh();
    } else {
      toast.error("Failed to delete movie");
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
          <div className="flex justify-between items-start gap-2">
            <div className="font-semibold text-lg leading-tight">{Title}</div>
            {averageRating > 0 && (
              <div className="text-yellow-500 font-bold whitespace-nowrap text-sm bg-gray-900/80 px-2 py-0.5 rounded flex items-center gap-1">
                ★ {averageRating.toFixed(1)}
              </div>
            )}
          </div>
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
          <div className="flex gap-2 w-full">
            <Link
              href={`/movies/${id}/edit`}
              className="text-center border border-blue-600 text-blue-600 py-1.5 rounded hover:bg-blue-50 flex-1"
            >
              Edit
            </Link>
            {canDelete && (
              <button
                onClick={handleDelete}
                className="text-center border border-red-500 text-red-500 py-1.5 rounded hover:bg-red-50 flex-1"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}