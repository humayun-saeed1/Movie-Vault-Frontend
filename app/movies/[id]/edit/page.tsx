"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import MultiSelectDropdown from "@/components/multi-select-dropdown";
import { useAuth } from "@/context/auth-context";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Actor = { id: string; name: string };
type Director = { id: string; name: string };

type MovieDetail = {
  id: string;
  name: string;
  posterURl: string;
  releaseyear: number;
  duration: string;
  genre: string;
  trailerURL: string;
  actors?: Array<{ id: string; name: string }>;
  directors?: Array<{ id: string; name: string }>;
};

type MovieFormState = {
  movieName: string;
  posterURL: string;
  releaseYear: string;
  duration: string;
  genre: string;
  trailerURL: string;
  actorIDs: string[];
  directorIDs: string[];
  file: File | null;
};

export default function EditMoviePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [actors, setActors] = useState<Actor[]>([]);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [form, setForm] = useState<MovieFormState>({
    movieName: "",
    posterURL: "",
    releaseYear: "",
    duration: "",
    genre: "",
    trailerURL: "",
    actorIDs: [],
    directorIDs: [],
    file: null,
  });
  const [status, setStatus] = useState("");

  const { token, user } = useAuth();
  const canEdit = user?.role === "ADMIN" || user?.role === "EDITOR";

  useEffect(() => {
    if (!canEdit) {
      router.push("/movies");
    }
  }, [canEdit, router]);

  useEffect(() => {
    if (!id) return;

    async function loadMovie() {
      const response = await fetch(`${API_URL}/movie/get/${id}`, {
        cache: "no-store",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await response.json();
      setMovie(data);
      setForm({
        movieName: data.name || "",
        posterURL: data.posterURl || "",
        releaseYear: data.releaseyear ? String(data.releaseyear) : "",
        duration: data.duration ? String(data.duration) : "",
        genre: data.genre || "",
        trailerURL: data.trailerURL || "",
        actorIDs: data.actors?.map((a: any) => a.id) || [],
        directorIDs: data.directors?.map((d: any) => d.id) || [],
        file: null,
      });
    }

    loadMovie().catch(() => {
      setStatus("Failed to load movie.");
    });
  }, [id]);

  useEffect(() => {
    async function loadOptions() {
      const [actorRes, directorRes] = await Promise.all([
        fetch(`${API_URL}/actor/get-all`, {
          cache: "no-store",
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }),
        fetch(`${API_URL}/director/get-all`, {
          cache: "no-store",
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }),
      ]);
      const actorsData = await actorRes.json();
      const directorsData = await directorRes.json();
      setActors(actorsData.actors || (Array.isArray(actorsData) ? actorsData : []));
      setDirectors(directorsData.directors || (Array.isArray(directorsData) ? directorsData : []));
    }

    loadOptions().catch(() => {
      setActors([]);
      setDirectors([]);
    });
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setForm((current) => ({ ...current, [id]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setForm((current) => ({ ...current, file: event.target.files![0] }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;

    const formData = new FormData();
    if (form.movieName) formData.append("name", form.movieName);
    if (form.releaseYear) formData.append("releaseyear", form.releaseYear);
    if (form.duration) formData.append("duration", form.duration);
    if (form.genre) formData.append("genre", form.genre);
    if (form.trailerURL) formData.append("trailerURL", form.trailerURL);
    if (form.file) formData.append("file", form.file);
    if (form.actorIDs.length > 0) formData.append("actorID", JSON.stringify(form.actorIDs));
    if (form.directorIDs.length > 0) formData.append("directorID", JSON.stringify(form.directorIDs));

    const response = await fetch(`${API_URL}/movie/edit/${id}`, {
      method: "PATCH",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData,
    });

    if (response.ok) {
      toast.success("Movie updated successfully!");
      router.push(`/movies/${id}`);
    } else {
      toast.error("Failed to update movie.");
    }
  };

  if (!movie) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="p-4 mt-5">
      <h1 className="text-3xl font-bold mt-5 text-center">Edit Movie</h1>
      <form className="mt-4 space-y-4 max-w-xl mx-auto" onSubmit={handleSubmit}>
        <div className="flex items-center gap-3">
          <label htmlFor="movieName" className="w-24 font-semibold">Name</label>
          <input
            id="movieName"
            value={form.movieName}
            onChange={handleChange}
            type="text"
            className="flex-1 border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="file" className="w-24 font-semibold">Poster</label>
          <div className="flex-1 flex flex-col gap-2">
            {form.posterURL && (
              <img src={form.posterURL} alt="Current Poster" className="h-20 w-auto object-contain rounded" />
            )}
            <input
              id="file"
              onChange={handleFileChange}
              type="file"
              accept="image/*"
              className="border rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="releaseYear" className="w-24 font-semibold">Year</label>
          <input
            id="releaseYear"
            value={form.releaseYear}
            onChange={handleChange}
            type="number"
            className="flex-1 border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="duration" className="w-24 font-semibold">Duration</label>
          <input
            id="duration"
            value={form.duration}
            onChange={handleChange}
            type="text"
            className="flex-1 border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="genre" className="w-24 font-semibold">Genre</label>
          <input
            id="genre"
            value={form.genre}
            onChange={handleChange}
            type="text"
            className="flex-1 border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="trailerURL" className="w-24 font-semibold">Trailer</label>
          <input
            id="trailerURL"
            value={form.trailerURL}
            onChange={handleChange}
            type="text"
            className="flex-1 border rounded px-3 py-2"
          />
        </div>

        <MultiSelectDropdown
          label="Actors"
          options={actors}
          selected={form.actorIDs}
          onChange={(ids) => setForm((current) => ({ ...current, actorIDs: ids }))}
        />

        <MultiSelectDropdown
          label="Directors"
          options={directors}
          selected={form.directorIDs}
          onChange={(ids) => setForm((current) => ({ ...current, directorIDs: ids }))}
        />

        <div className="flex gap-3 items-center">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Update Movie
          </button>
          <Link href={`/movies/${id}`} className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100">
            Back
          </Link>
        </div>
        {status && <div className="text-sm text-slate-700">{status}</div>}
      </form>
    </div>
  );
}
