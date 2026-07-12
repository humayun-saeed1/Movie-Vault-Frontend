"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import MultiSelectDropdown from "@/components/multi-select-dropdown";

type Movie = { id: string; name: string };

type DirectorDetail = {
  id: string;
  name: string;
  age: number;
  about: string;
  imageURL: string;
  movies?: Array<{ id: string; name: string }>;
};

type DirectorFormState = {
  name: string;
  age: string;
  about: string;
  imageURL: string;
  movieIDs: string[];
};

export default function EditDirectorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [director, setDirector] = useState<DirectorDetail | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [form, setForm] = useState<DirectorFormState>({
    name: "",
    age: "",
    about: "",
    imageURL: "",
    movieIDs: [],
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadDirector() {
      const response = await fetch(`http://localhost:8000/director/get-by-id/${id}`, { cache: "no-store" });
      const data = await response.json();
      setDirector(data);
    }

    loadDirector().catch(() => {
      setStatus("Failed to load director.");
    });
  }, [id]);

  useEffect(() => {
    async function loadMovies() {
      const response = await fetch("http://localhost:8000/movie/get-all", { cache: "no-store" });
      const data = await response.json();
      setMovies(data);
    }

    loadMovies().catch(() => {
      setMovies([]);
    });
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = event.target;
    setForm((current) => ({ ...current, [id]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;

    const body: Record<string, unknown> = {};
    if (form.name) body.name = form.name;
    if (form.age) body.age = Number(form.age);
    if (form.about) body.about = form.about;
    if (form.imageURL) body.imageURL = form.imageURL;
    if (form.movieIDs.length) body.movieID = form.movieIDs;

    const response = await fetch(`http://localhost:8000/director/edit/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      setStatus("Director updated.");
      router.push(`/directors/${id}`);
    } else {
      setStatus("Update failed.");
    }
  };

  if (!director) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="p-4 mt-5">
      <h1 className="text-3xl font-bold mt-5 text-center">Edit Director</h1>
      <div className="text-sm text-slate-600 text-center mt-2">Leave blank to keep the current value.</div>
      <form className="mt-4 space-y-4 max-w-xl mx-auto" onSubmit={handleSubmit}>
        <div className="flex items-center gap-3">
          <label htmlFor="name" className="w-24 font-semibold">Name</label>
          <input
            id="name"
            value={form.name}
            onChange={handleChange}
            type="text"
            placeholder={director.name}
            className="flex-1 border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="age" className="w-24 font-semibold">Age</label>
          <input
            id="age"
            value={form.age}
            onChange={handleChange}
            type="number"
            min="1"
            max="100"
            placeholder={String(director.age)}
            className="flex-1 border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-start gap-3">
          <label htmlFor="about" className="w-24 font-semibold pt-2">About</label>
          <textarea
            id="about"
            value={form.about}
            onChange={handleChange}
            placeholder={director.about}
            className="flex-1 border rounded px-3 py-2 min-h-[120px]"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="imageURL" className="w-24 font-semibold">Image URL</label>
          <input
            id="imageURL"
            value={form.imageURL}
            onChange={handleChange}
            type="text"
            placeholder={director.imageURL}
            className="flex-1 border rounded px-3 py-2"
          />
        </div>

        <MultiSelectDropdown
          label="Movies"
          options={movies}
          selected={form.movieIDs}
          onChange={(ids) => setForm((current) => ({ ...current, movieIDs: ids }))}
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Update Director
        </button>
        {status && <div className="text-sm text-slate-700">{status}</div>}
      </form>
    </div>
  );
}
