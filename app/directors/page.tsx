import Link from "next/link";
import DirectorCard from "@/components/director-card";
import { cookies } from "next/headers";
import DirectorFilters from "@/components/director-filters";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function DirectorPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const userCookie = cookieStore.get('user')?.value;
    const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;
    const canAdd = user?.role === "ADMIN" || user?.role === "EDITOR";

    const resolvedParams = await searchParams;
    const query = new URLSearchParams();
    Object.entries(resolvedParams).forEach(([key, value]) => {
      if (value) query.set(key, value as string);
    });
    if (!query.has('page')) query.set('page', '1');
    if (!query.has('limit')) query.set('limit', '12');

    const response = await fetch(`${API_URL}/director/get-all?${query.toString()}`, {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    const data = await response.json();
    const directors = data.directors || (Array.isArray(data) ? data : []);
    const page = data.page || 1;
    const totalPages = data.totalPages || 1;

    const buildPaginationLink = (targetPage: number) => {
      const newQuery = new URLSearchParams(query.toString());
      newQuery.set('page', targetPage.toString());
      return `/directors?${newQuery.toString()}`;
    };

    return (
        <div className="flex flex-col p-4 mt-5">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h1 className="text-3xl font-bold mt-5">All Directors</h1>
              {canAdd && (
                <Link
                  href="/directors/add"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  <span>+</span>
                  <span>Add Director</span>
                </Link>
              )}
            </div>

            <DirectorFilters />

            {directors.length === 0 ? (
              <div className="text-center mt-10">No directors found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4 items-stretch">
                   {/* Render DirectorCard components */}
                  {directors.map((director: any) => (
                      <DirectorCard 
                      key={director.id} 
                      id={director.id}
                      Name={director.name}
                      Photo={director.imageURL}
                      Movies={director.movies?.map((movie: any) => movie.name) || []}
                      createrId={director.createrId}
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
    )
}

