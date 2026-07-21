import MovieCard from "@/components/movie-card";
import ActorCard from "@/components/actor-card";
import DirectorCard from "@/components/director-card";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchMovies() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  try {
    const response = await fetch(`${API_URL}/movie/get-all`, {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!response.ok) return [];
    const data = await response.json();
    const movies = data.movies || data;
    return Array.isArray(movies) ? movies : [];
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    return [];
  }
}

async function fetchActors() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  try {
    const response = await fetch(`${API_URL}/actor/get-all`, {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!response.ok) return [];
    const data = await response.json();
    const actors = data.actors || data;
    return Array.isArray(actors) ? actors : [];
  } catch (error) {
    console.error("Failed to fetch actors:", error);
    return [];
  }
}

async function fetchDirectors() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  try {
    const response = await fetch(`${API_URL}/director/get-all`, {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!response.ok) return [];
    const data = await response.json();
    const directors = data.directors || data;
    return Array.isArray(directors) ? directors : [];
  } catch (error) {
    console.error("Failed to fetch directors:", error);
    return [];
  }
}

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/auth/signin');
  }

  const movies = await fetchMovies();
  const actors = await fetchActors();
  const directors = await fetchDirectors();

  return (
    <div>
      <h1 className="text-3xl font-bold mt-5 text-center ">Welcome to Movie Vault !</h1>
      <div className="flex flex-col p-4 mt-5">
        <h2 className="text-2xl font-semibold mt-4 ">Discover Your Next Favorite Movie</h2>
        <div className="grid grid-cols-6 gap-6 mt-4">
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
      <div className="flex flex-col p-4 mt-5">
        <h2 className="text-2xl font-semibold mt-4 ">Popular Actors</h2>
        <div className="grid grid-cols-6 gap-4 mt-4">
        {actors.map((actor: any) => (
          <ActorCard
            key={actor.id}
            id={actor.id}
            Name={actor.name}
            Photo={actor.imageURL}
            Movies={actor.movies?.map((movie: any) => movie.name) || []}
          />
        ))}
        </div>
      </div>
      <div className="flex flex-col p-4 mt-5">
        <h2 className="text-2xl font-semibold mt-4 ">Popular Directors</h2>
        <div className="grid grid-cols-6 gap-4 mt-4">
          {directors.map((director: any) => (
            <DirectorCard
              key={director.id}
              id={director.id}
              Name={director.name}
              Photo={director.imageURL}
              Movies={director.movies?.map((movie: any) => movie.name) || []}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
 