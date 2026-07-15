import Link from "next/link";
import ActorCard from "@/components/actor-card";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function ActorPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const userCookie = cookieStore.get('user')?.value;
    const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;
    const canAdd = user?.role === "ADMIN" || user?.role === "EDITOR";

    const response = await fetch(`${API_URL}/actor/get-all`, {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    const data = await response.json();
    const actors = Array.isArray(data) ? data : [];
    console.log(actors); 
    return (
        <div className="flex flex-col p-4 mt-5">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-3xl font-bold mt-5">All Actors</h1>
              {canAdd && (
                <Link
                  href="/actors/add"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  <span>+</span>
                  <span>Add Actor</span>
                </Link>
              )}
            </div>
        <div className="grid grid-cols-6 gap-4 mt-4 items-stretch">
             {/* Render ActorCard components */}
            
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
    )
}


