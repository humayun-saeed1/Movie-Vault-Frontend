import MovieCard from "@/components/movie-card";
import Link from "next/link";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function MoviePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const userCookie = cookieStore.get('user')?.value;
  const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;
  const canAdd = user?.role === "ADMIN" || user?.role === "EDITOR";

  const response = await fetch(`${API_URL}/movie/get-all`, {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  const data = await response.json();
  const movies = Array.isArray(data) ? data : [];

  return (
    <div className="flex flex-col p-4 mt-5">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Movies</h1>
        {canAdd && (
          <Link
            href="/movies/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold transition-colors"
          >
            Add Movie
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {movies.map((movie: any, index: number) => (
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
            priority={index < 6}
          />
        ))}
      </div>
    </div>
  );
}




