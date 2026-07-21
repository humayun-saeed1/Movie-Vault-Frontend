import MovieCard from "@/components/movie-card";
import Link from "next/link";
import { cookies } from "next/headers";
import MovieFilters from "@/components/movie-filters";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function MoviePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const userCookie = cookieStore.get('user')?.value;
  const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;
  const canAdd = user?.role === "ADMIN" || user?.role === "EDITOR";

  let favIds = new Set<string>();
  let watchlistIds = new Set<string>();

  if (token) {
    try {
      const [favRes, wlRes] = await Promise.all([
        fetch(`${API_URL}/favourite/my`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/watchlist/my`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      if (favRes.ok) {
         const favs = await favRes.json();
         favs.forEach((m: any) => favIds.add(m.id));
      }
      if (wlRes.ok) {
         const wls = await wlRes.json();
         wls.forEach((m: any) => watchlistIds.add(m.id));
      }
    } catch {}
  }

  const resolvedParams = await searchParams;
  const query = new URLSearchParams();
  Object.entries(resolvedParams).forEach(([key, value]) => {
    if (value) query.set(key, value as string);
  });
  if (!query.has('page')) query.set('page', '1');
  if (!query.has('limit')) query.set('limit', '12'); // 12 movies per page looks good for grid

  let movies = [];
  let page = 1;
  let totalPages = 1;

  try {
    const response = await fetch(`${API_URL}/movie/get-all?${query.toString()}`, {
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (response.ok) {
      const data = await response.json();
      movies = data.movies || (Array.isArray(data) ? data : []);
      page = data.page || 1;
      totalPages = data.totalPages || 1;
    }
  } catch (error) {
    console.error("Failed to fetch movies:", error);
  }

  const buildPaginationLink = (targetPage: number) => {
    const newQuery = new URLSearchParams(query.toString());
    newQuery.set('page', targetPage.toString());
    return `/movies?${newQuery.toString()}`;
  };

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

      <MovieFilters />

      {movies.length === 0 ? (
        <div className="text-center mt-10">No movies found.</div>
      ) : (
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
              isFav={favIds.has(movie.id)}
              isWatchlisted={watchlistIds.has(movie.id)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          {page > 1 ? (
            <Link href={buildPaginationLink(page - 1)} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md font-semibold text-white">
              Previous
            </Link>
          ) : (
            <button disabled className="bg-gray-800 text-gray-500 px-4 py-2 rounded-md font-semibold cursor-not-allowed">
              Previous
            </button>
          )}
          <span className="text-gray-300">Page {page} of {totalPages}</span>
          {page < totalPages ? (
            <Link href={buildPaginationLink(page + 1)} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md font-semibold text-white">
              Next
            </Link>
          ) : (
            <button disabled className="bg-gray-800 text-gray-500 px-4 py-2 rounded-md font-semibold cursor-not-allowed">
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
}



