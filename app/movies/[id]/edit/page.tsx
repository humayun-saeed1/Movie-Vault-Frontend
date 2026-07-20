"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;

    const body: Record<string, unknown> = {};
    if (form.movieName) body.name = form.movieName;
    if (form.posterURL) body.posterURl = form.posterURL;
    if (form.releaseYear) body.releaseyear = Number(form.releaseYear);
    if (form.duration) body.duration = Number(form.duration);
    if (form.genre) body.genre = form.genre;
    if (form.trailerURL) body.trailerURL = form.trailerURL;
    if (form.actorIDs.length > 0) body.actorID = form.actorIDs;
    if (form.directorIDs.length > 0) body.directorID = form.directorIDs;

    const response = await fetch(`${API_URL}/movie/edit/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      setStatus("Movie updated.");
      router.push(`/movies/${id}`);
    } else {
      setStatus("Update failed.");
    }
  };

  if (!movie) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="p-4 mt-5">
      <h1 className="text-3xl font-bold mt-5 text-center">Edit Movie</h1>
      <div className="text-sm text-slate-600 text-center mt-2">Leave blank to keep the current value.</div>
      <form className="mt-4 space-y-4 max-w-xl mx-auto" onSubmit={handleSubmit}>
        <div className="flex items-center gap-3">
          <label htmlFor="movieName" className="w-24 font-semibold">Name</label>
          <input
            id="movieName"
            value={form.movieName}
            onChange={handleChange}
            type="text"
            placeholder={movie.name}
            className="flex-1 border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="posterURL" className="w-24 font-semibold">Poster</label>
          <input
            id="posterURL"
            value={form.posterURL}
            onChange={handleChange}
            type="text"
            placeholder={movie.posterURl}
            className="flex-1 border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="releaseYear" className="w-24 font-semibold">Year</label>
          <input
            id="releaseYear"
            value={form.releaseYear}
            onChange={handleChange}
            type="number"
            placeholder={String(movie.releaseyear)}
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
            placeholder={movie.duration}
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
            placeholder={movie.genre}
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
            placeholder={movie.trailerURL}
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
