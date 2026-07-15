"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DirectorCard({
  id,
  Name,
  Photo,
  Movies,
}: {
  id: string;
  Name: string;
  Photo: string;
  Movies: string[];
}) {
  const router = useRouter();
  const { token, user } = useAuth();
  const canEdit = user?.role === "ADMIN" || user?.role === "EDITOR";

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this director?")) return;

    const response = await fetch(`${API_URL}/director/delete/${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    if (response.ok) {
      router.refresh();
    } else {
      alert("Failed to delete director");
    }
  };

  return (
    <div className="rounded-lg border p-2 shadow-sm flex flex-col justify-between h-130">
      <div>
        <div className="mb-2 overflow-hidden rounded-md">
          <img
            src={Photo}
            alt={`${Name} photo`}
            className="h-72 w-full object-cover"
          />
        </div>
        <div className="font-semibold">{Name}</div>
        <div className="line-clamp-2">Movies: {Movies.join(", ")}</div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Link
          href={`/directors/${id}`}
          className="text-center bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 w-full"
        >
          View Details
        </Link>
        {canEdit && (
          <>
            <Link
              href={`/directors/${id}/edit`}
              className="text-center border border-blue-600 text-blue-600 py-1.5 rounded hover:bg-blue-50 w-full"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="text-center border border-red-500 text-red-500 py-1.5 rounded hover:bg-red-50 w-full"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}