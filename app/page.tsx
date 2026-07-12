
import MovieCard from "@/components/movie-card";
import ActorCard from "@/components/actor-card";
import DirectorCard from "@/components/director-card";

async function fetchMovies() {
  const response = await fetch('http://localhost:8000/movie/get-all', { cache: 'no-store' });
  const movies = await response.json();
  return movies;
}

async function fetchActors() {
  const response = await fetch('http://localhost:8000/actor/get-all', { cache: 'no-store' });
  const actors = await response.json();
  return actors;
}
async function fetchDirectors() {
  const response = await fetch('http://localhost:8000/director/get-all', { cache: 'no-store' });
  const directors = await response.json();
  return directors;
}

export default async function Home() {
  const movies = await fetchMovies();
  const actors = await fetchActors();
  const directors = await fetchDirectors();

  return (
    <div>
      <h1 className="text-3xl font-bold mt-5 text-center ">Welcome to Movie Vault !</h1>
      <div className="flex flex-col p-4 mt-5">
        <h2 className="text-2xl font-semibold mt-4 ">Discover Your Next Favorite Movie</h2>
        <div className="grid grid-cols-6 gap-6 mt-4">
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
 