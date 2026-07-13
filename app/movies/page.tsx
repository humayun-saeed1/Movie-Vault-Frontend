import MovieCard from "@/components/movie-card";
import Link from "next/link";

export default async function MoviePage() {
  const response = await fetch("http://localhost:8000/movie/get-all", { cache: "no-store" });
  const movies = await response.json();

  return (
    <div className="flex flex-col p-4 mt-5">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Movies</h1>
        <Link
          href="/movies/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold transition-colors"
        >
          Add Movie
        </Link>
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




