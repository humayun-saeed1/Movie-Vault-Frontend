"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import MultiSelectDropdown from "@/components/multi-select-dropdown";
import { useAuth } from "@/context/auth-context";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Movie = { id: string; name: string };

type DirectorFormState = {
  name: string;
  age: string;
  about: string;
  imageURL: string;
  movieIDs: string[];
};

export default function AddDirector() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [form, setForm] = useState<DirectorFormState>({
    name: "",
    age: "",
    about: "",
    imageURL: "",
    movieIDs: [],
  });
  const [status, setStatus] = useState("");
  const router = useRouter();
  const { token, user } = useAuth();
  
  const canEdit = user?.role === "ADMIN" || user?.role === "EDITOR";

  useEffect(() => {
    if (!canEdit) {
      router.push("/directors");
    }
  }, [canEdit, router]);

  useEffect(() => {
    async function loadMovies() {
      const response = await fetch(`${API_URL}/movie/get-all`, {
        cache: "no-store",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await response.json();
      setMovies(data.movies || (Array.isArray(data) ? data : []));
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
    setStatus("Submitting...");

    const requestBody: Record<string, unknown> = {
      name: form.name,
      age: Number(form.age),
      about: form.about,
      imageURL: form.imageURL || undefined,
    };

    if (form.movieIDs && form.movieIDs.length > 0) {
      requestBody.movieID = form.movieIDs;
    }

    const response = await fetch(`${API_URL}/director/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      toast.success("Director added successfully!");
      setForm({ name: "", age: "", about: "", imageURL: "", movieIDs: [] });
      router.push("/directors");
    } else {
      toast.error("Failed to add director.");
    }
  };

  return (
    <div className="p-4 mt-5">
      <h1 className="text-3xl font-bold mt-5 text-center">Add Director</h1>
      <form className="mt-4 space-y-4 max-w-xl mx-auto" onSubmit={handleSubmit}>
        <div className="flex items-center gap-3">
          <label htmlFor="name" className="w-24 font-semibold">Name</label>
          <input
            id="name"
            value={form.name}
            onChange={handleChange}
            type="text"
            placeholder="Director Name"
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
            placeholder="Age"
            className="flex-1 border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-start gap-3">
          <label htmlFor="about" className="w-24 font-semibold pt-2">About</label>
          <textarea
            id="about"
            value={form.about}
            onChange={handleChange}
            placeholder="Director biography"
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
            placeholder="Optional image URL"
            className="flex-1 border rounded px-3 py-2"
          />
        </div>

        <MultiSelectDropdown
          label="Movies"
          options={movies}
          selected={form.movieIDs}
          onChange={(ids) => setForm((current) => ({ ...current, movieIDs: ids }))}
        />

        <div className="flex gap-3 items-center">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Director
          </button>
          <Link href="/directors" className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100">
            Back
          </Link>
        </div>
        {status && <div className="text-sm text-slate-700">{status}</div>}
      </form>
    </div>
  );
}
