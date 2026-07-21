import MovieCard from "@/components/movie-card";
import { cookies } from "next/headers";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function WatchlistPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return (
      <div className="flex flex-col p-4 mt-5 items-center">
        <h1 className="text-3xl font-bold mb-4">My Watchlist</h1>
        <p>Please sign in to view your watchlist.</p>
        <Link href="/auth/signin" className="text-blue-500 hover:underline mt-2">Sign In</Link>
      </div>
    );
  }

  let movies = [];
  try {
    const response = await fetch(`${API_URL}/watchlist/my`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.ok) {
      movies = await response.json() || [];
    }
  } catch (error) {
    console.error("Failed to fetch watchlist:", error);
  }

  return (
    <div className="flex flex-col p-4 mt-5">
      <h1 className="text-3xl font-bold mb-8">My Watchlist</h1>
      {movies.length === 0 ? (
        <div className="text-center mt-10 text-gray-400">Your watchlist is empty. Go add some movies!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {movies.map((movie: any) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              Poster={movie.posterURl}
              Title={movie.name}
              ReleaseDate={movie.releaseyear}
              Duration={movie.duration}
              Genre={movie.genre}
              Trailer={movie.trailerURL}
              Actors={movie.actors?.map((actor: any) => actor.name) || []}
              Directors={movie.directors?.map((director: any) => director.name) || []}
              isWatchlisted={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
