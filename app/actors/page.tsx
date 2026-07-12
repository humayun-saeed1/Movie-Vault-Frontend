import Link from "next/link";
import ActorCard from "@/components/actor-card";

export default async function ActorPage(){
    const response = await fetch('http://localhost:8000/actor/get-all', { cache: 'no-store' });
    const actors = await response.json();
    console.log(actors); 
    return (
        <div className="flex flex-col p-4 mt-5">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-3xl font-bold mt-5">All Actors</h1>
              <Link
                href="/actors/add"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <span>+</span>
                <span>Add Actor</span>
              </Link>
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


