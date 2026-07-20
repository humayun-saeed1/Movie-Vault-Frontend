"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ItemType = "movies" | "actors" | "directors" | "users";

export default function AdminPanel({ token }: { token: string }) {
  const [activeTab, setActiveTab] = useState<ItemType>("movies");
  const [data, setData] = useState<{
    movies: any[];
    actors: any[];
    directors: any[];
    users: any[];
  }>({
    movies: [],
    actors: [],
    directors: [],
    users: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [moviesRes, actorsRes, directorsRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/movie/get-all`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/actor/get-all`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/director/get-all`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/auth/get-all`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      let moviesData = await moviesRes.json();
      let actorsData = await actorsRes.json();
      let directorsData = await directorsRes.json();
      let usersData = await usersRes.json();

      moviesData = moviesData.movies || moviesData;
      actorsData = actorsData.actors || actorsData;
      directorsData = directorsData.directors || directorsData;
      usersData = usersData.users || usersData;

      setData({
        movies: Array.isArray(moviesData) ? moviesData.filter((m) => m.status === "PENDING") : [],
        actors: Array.isArray(actorsData) ? actorsData.filter((a) => a.status === "PENDING") : [],
        directors: Array.isArray(directorsData) ? directorsData.filter((d) => d.status === "PENDING") : [],
        users: Array.isArray(usersData) ? usersData.filter((u) => u.status === "PENDING") : [],
      });
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleAction = async (type: ItemType, id: string, action: "approve" | "reject") => {
    let endpoint = "";
    if (type === "users") {
      endpoint = `${API_URL}/auth/${action}-user/${id}`;
    } else {
      let routePrefix = type.slice(0, -1); // movies -> movie, actors -> actor, directors -> director
      endpoint = `${API_URL}/${routePrefix}/${action}/${id}`;
    }

    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        // Remove item from state
        setData((prev) => ({
          ...prev,
          [type]: prev[type].filter((item) => item.id !== id),
        }));
      } else {
        console.error("Action failed");
      }
    } catch (error) {
      console.error("Action failed", error);
    }
  };

  const renderTable = (type: ItemType) => {
    const items = data[type];
    if (items.length === 0) return <p className="text-gray-500 p-4">No pending {type}.</p>;

    return (
      <div className="overflow-x-auto bg-gray-900 rounded-lg shadow">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="text-xs uppercase bg-gray-800 text-gray-400">
            <tr>
              <th className="px-6 py-3">Name/Title</th>
              {type === "users" ? (
                <>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                </>
              ) : (
                <th className="px-6 py-3">Creator ID</th>
              )}
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-800">
                <td className="px-6 py-4 font-medium text-white">{item.name || item.username}</td>
                {type === "users" ? (
                  <>
                    <td className="px-6 py-4">{item.email}</td>
                    <td className="px-6 py-4">{item.role}</td>
                  </>
                ) : (
                  <td className="px-6 py-4">{item.createrId}</td>
                )}
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleAction(type, item.id, "approve")}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-semibold transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(type, item.id, "reject")}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-semibold transition"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex space-x-4 border-b border-gray-700 mb-6 pb-2 overflow-x-auto">
        {(["movies", "actors", "directors", "users"] as ItemType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 capitalize font-semibold transition-colors rounded-t-md ${
              activeTab === tab
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {tab}
            {!loading && data[tab].length > 0 && (
              <span className="ml-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {data[tab].length}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : (
        renderTable(activeTab)
      )}
    </div>
  );
}
