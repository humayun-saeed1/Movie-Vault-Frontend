"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  reviews?: Array<{ id: string; rating: number; comment: string; user: { id: string; username: string } }>;
};

export default function MovieViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  
  const { token, user } = useAuth();
  const canEdit = user?.role === "ADMIN" || user?.role === "EDITOR";
  const isLoggedIn = !!token;

  const [rating, setRating] = useState<number | string>(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadMovie() {
      try {
        const response = await fetch(`${API_URL}/movie/get/${id}`, {
          cache: "no-store",
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (response.ok) {
          const data = await response.json();
          setMovie(data);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadMovie();
  }, [id, token]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this movie?")) return;

    const response = await fetch(`${API_URL}/movie/delete/${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    if (response.ok) {
      router.push("/movies");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please sign in to leave a review.");
      return;
    }
    if (Number(rating) < 1) {
      toast.error("Please select at least 1 star for your rating.");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ movieId: id, rating: Number(rating), comment })
      });
      if (res.ok) {
        toast.success("Review submitted successfully!");
        setRating(0);
        setComment("");
        // Reload movie
        const movieRes = await fetch(`${API_URL}/movie/get/${id}`, {
          cache: "no-store",
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setMovie(await movieRes.json());
      } else {
        toast.error("Failed to submit review.");
      }
    } catch {
      toast.error("Error submitting review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        toast.success("Review deleted successfully!");
        setMovie((prev: any) => ({
          ...prev,
          reviews: prev.reviews.filter((r: any) => r.id !== reviewId)
        }));
      } else {
        toast.error("Failed to delete review.");
      }
    } catch {
      toast.error("Error deleting review.");
    }
  };

  if (!movie) {
    return <div className="text-center mt-10">Loading movie details...</div>;
  }

  return (
    <div className="p-4 mt-5">
      <button onClick={() => router.back()} className="mb-4 text-blue-600 hover:underline font-semibold flex items-center gap-1">
        &larr; Go Back
      </button>
      <h1 className="text-3xl font-bold text-center">{movie.name}</h1>

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
          <div className="flex gap-4 mt-4">
            {canEdit && (
              <>
                <Link
                  href={`/movies/${id}/edit`}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-md font-semibold transition-colors"
                >
                  Edit Movie
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-6 py-2 rounded-md font-semibold transition-colors"
                >
                  Delete Movie
                </button>
              </>
            )}
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

      <div className="mt-12 max-w-3xl mx-auto border-t pt-8">
        <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
        
        {isLoggedIn ? (
          <form onSubmit={handleSubmitReview} className="mb-8 bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Leave a Review</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Rating (1-10)</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className={`text-2xl transition-colors outline-none ${(hoverRating !== null ? star <= hoverRating : star <= (Number(rating) || 0)) ? "text-yellow-500" : "text-gray-500"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Comment</label>
              <textarea 
                value={comment} 
                onChange={(e) => setComment(e.target.value)} 
                className="w-full px-3 py-2 bg-gray-700 rounded-md outline-none min-h-[80px]"
                placeholder="What did you think?"
              />
            </div>
            <button 
              type="submit" 
              disabled={submittingReview}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold transition-colors disabled:opacity-50"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-gray-800 rounded-lg text-gray-400">
            Please sign in to leave a review.
          </div>
        )}

        <div className="space-y-4">
          {movie.reviews && movie.reviews.length > 0 ? (
            movie.reviews.map((review) => {
              const canDeleteReview = user?.role === "ADMIN" || user?.id === review.user?.id;
              return (
              <div key={review.id} className="p-4 border rounded-lg bg-gray-900">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">{review.user?.username || "Unknown"}</div>
                  <div className="flex items-center gap-4">
                    <div className="text-yellow-500 font-bold">★ {review.rating}/10</div>
                    {canDeleteReview && (
                      <button 
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                {review.comment && <div className="text-gray-300">{review.comment}</div>}
              </div>
            )})
          ) : (
            <div className="text-gray-500">No reviews yet. Be the first to review!</div>
          )}
        </div>
      </div>
    </div>
  );
}
