"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import toast from "react-hot-toast";

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
  createrId?: string;
}) {
  const router = useRouter();
  const { token, user } = useAuth();
  const canEdit = user?.role === "ADMIN" || user?.role === "EDITOR";
  const canDelete = user?.role === "ADMIN" || (user?.role === "EDITOR" && createrId === user?.id);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this director?")) return;

    const response = await fetch(`${API_URL}/director/delete/${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    if (response.ok) {
      toast.success("Director deleted successfully");
      router.refresh();
    } else {
      toast.error("Failed to delete director");
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
          <div className="flex gap-2 w-full">
            <Link
              href={`/directors/${id}/edit`}
              className="text-center border border-blue-600 text-blue-600 py-1.5 rounded hover:bg-blue-50 flex-1"
            >
              Edit
            </Link>
            {canDelete && (
              <button
                onClick={handleDelete}
                className="text-center border border-red-500 text-red-500 py-1.5 rounded hover:bg-red-50 flex-1"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}