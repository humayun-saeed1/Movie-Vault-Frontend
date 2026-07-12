import Link from "next/link";

export default function Header(){
    return (
        <div className="flex flex-row items-center justify-between w-full p-4 border-b border-gray-200">
            {/* Movie Vault ka logo */}
            <div className="font-bold text-2xl whitespace-nowrap">
                <h2>Movie Vault</h2>
            </div>
            
            {/* Nav Buttons */}
            <div className="flex flex-row items-center gap-4 ml-auto">
               <Link href="/">Home</Link>
               <Link href="/movies">Movies</Link>
               <Link href="/actors">Actors</Link>
               <Link href="/directors">Directors</Link>
            </div>
        </div>
    )
}