import Link from "next/link";
import DirectorCard from "@/components/director-card";

export default async function DirectorPage(){
    const response = await fetch('http://localhost:8000/director/get-all', { cache: 'no-store' });
    const directors = await response.json();
    console.log(directors); 
    return (
        <div className="flex flex-col p-4 mt-5">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-3xl font-bold mt-5">All Directors</h1>
              <Link
                href="/directors/add"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <span>+</span>
                <span>Add Director</span>
              </Link>
            </div>
        <div className="grid grid-cols-6 gap-4 mt-4 items-stretch">
             {/* Render DirectorCard components */}
            
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
    )
}


