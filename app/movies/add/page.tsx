"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import MultiSelectDropdown from "@/components/multi-select-dropdown";
import { useAuth } from "@/context/auth-context";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Actor = { id: string; name: string };
type Director = { id: string; name: string };

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

export default function AddMovie() {
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
  const router = useRouter();
  const { token, user } = useAuth();
  
  // Basic client-side protection
  const canEdit = user?.role === "ADMIN" || user?.role === "EDITOR";

  useEffect(() => {
    if (!canEdit) {
      router.push("/movies");
    }
  }, [canEdit, router]);

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

    if (form.actorIDs.length === 0 && form.directorIDs.length === 0) {
      window.alert("You must select at least one actor and one director. If none are available, please create them first.");
      return;
    } else if (form.actorIDs.length === 0) {
      window.alert("You must select at least one actor for this movie. If none are available, please create an actor first.");
      return;
    } else if (form.directorIDs.length === 0) {
      window.alert("You must select at least one director for this movie. If none are available, please create a director first.");
      return;
    }

    const response = await fetch(`${API_URL}/movie/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        name: form.movieName,
        posterURl: form.posterURL,
        releaseyear: Number(form.releaseYear),
        duration: Number(form.duration),
        genre: form.genre,
        trailerURL: form.trailerURL,
        actorID: form.actorIDs.length > 0 ? form.actorIDs : undefined,
        directorID: form.directorIDs.length > 0 ? form.directorIDs : undefined,
      }),
    });

    if (response.ok) {
      toast.success("Movie added successfully!");
      setForm({
        movieName: "",
        posterURL: "",
        releaseYear: "",
        duration: "",
        genre: "",
        trailerURL: "",
        actorIDs: [],
        directorIDs: [],
      });
      router.push("/movies");
    } else {
      toast.error("Failed to add movie.");
    }
  };

  return (
    <div className="p-4 mt-5">
      <h1 className="text-3xl font-bold mt-5 text-center">Add Movie</h1>
      <form className="mt-4 space-y-4 max-w-xl mx-auto" onSubmit={handleSubmit}>
        <div className="flex items-center gap-3">
          <label htmlFor="movieName" className="w-24 font-semibold">Name</label>
          <input
            id="movieName"
            value={form.movieName}
            onChange={handleChange}
            type="text"
            placeholder="Movie Name"
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
            placeholder="Poster URL"
            className="flex-1 border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="releaseYear" className="w-24 font-semibold">Year</label>
          <input
            id="releaseYear"
            value={form.releaseYear}
            onChange={handleChange}
            type="text"
            placeholder="Release Year"
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
            placeholder="Duration"
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
            placeholder="Genre"
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
            placeholder="Trailer URL"
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
            Add Movie
          </button>
          <Link href="/movies" className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100">
            Back
          </Link>
        </div>
        {status && <div className="text-sm text-slate-700">{status}</div>}
      </form>
    </div>
  );
}
