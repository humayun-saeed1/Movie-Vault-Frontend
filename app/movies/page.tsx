import MovieDropdown from "@/components/movie-dropdown";

export default async function MoviePage() {
  const response = await fetch("http://localhost:8000/movie/get-all", { cache: "no-store" });
  const movies = await response.json();

  return (
    <div className="flex flex-col p-4 mt-5">
      <h1 className="text-3xl font-bold mt-5 text-center">Select a Movie</h1>
      <MovieDropdown movies={movies.map((movie: any) => ({ id: movie.id, name: movie.name }))} />
    </div>
  );
}


