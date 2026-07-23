"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import MultiSelectDropdown from "@/components/multi-select-dropdown";
import { useAuth } from "@/context/auth-context";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  file: File | null;
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
    file: null,
  });

  const { token, user } = useAuth();
  const canEdit = user?.role === "ADMIN" || user?.role === "EDITOR";

  useEffect(() => {
    if (!canEdit) {
      router.push("/directors");
    }
  }, [canEdit, router]);

  useEffect(() => {
    if (!id) return;

    async function loadDirector() {
      const response = await fetch(`${API_URL}/director/get-by-id/${id}`, {
        cache: "no-store",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await response.json();
      setDirector(data);
      setForm({
        name: data.name || "",
        age: data.age ? String(data.age) : "",
        about: data.about || "",
        imageURL: data.imageURL || "",
        movieIDs: data.movies?.map((m: any) => m.id) || [],
        file: null,
      });
    }

    loadDirector().catch(() => {
      toast.error("Failed to load director.");
    });
  }, [id, token]);

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
  }, [token]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = event.target;
    setForm((current) => ({ ...current, [id]: value }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setForm((current) => ({ ...current, file: event.target.files![0] }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;

    const formData = new FormData();
    if (form.name) formData.append("name", form.name);
    if (form.age) formData.append("age", form.age);
    if (form.about) formData.append("about", form.about);
    if (form.file) formData.append("file", form.file);
    if (form.movieIDs.length) formData.append("movieID", JSON.stringify(form.movieIDs));

    const response = await fetch(`${API_URL}/director/edit/${id}`, {
      method: "PATCH",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData,
    });

    if (response.ok) {
      toast.success("Director updated successfully!");
      router.push(`/directors/${id}`);
    } else {
      toast.error("Failed to update director.");
    }
  };

  if (!director) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="p-4 mt-5">
      <h1 className="text-3xl font-bold mt-5 text-center">Edit Director</h1>
      <form className="mt-4 space-y-4 max-w-xl mx-auto" onSubmit={handleSubmit}>
        <div className="flex items-center gap-3">
          <label htmlFor="name" className="w-24 font-semibold">Name</label>
          <input
            id="name"
            value={form.name}
            onChange={handleChange}
            type="text"
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
            className="flex-1 border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-start gap-3">
          <label htmlFor="about" className="w-24 font-semibold pt-2">About</label>
          <textarea
            id="about"
            value={form.about}
            onChange={handleChange}
            className="flex-1 border rounded px-3 py-2 min-h-[120px]"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="file" className="w-24 font-semibold">Image</label>
          <div className="flex-1 flex flex-col gap-2">
            {form.imageURL && (
              <img src={form.imageURL} alt="Current Image" className="h-20 w-auto object-contain rounded" />
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

        <MultiSelectDropdown
          label="Movies"
          options={movies}
          selected={form.movieIDs}
          onChange={(ids) => setForm((current) => ({ ...current, movieIDs: ids }))}
        />

        <div className="flex gap-3 items-center">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Update Director
          </button>
          <Link href={`/directors/${id}`} className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100">
            Back
          </Link>
        </div>
        {status && <div className="text-sm text-slate-700">{status}</div>}
      </form>
    </div>
  );
}
