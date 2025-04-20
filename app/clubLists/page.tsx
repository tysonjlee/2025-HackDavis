"use client";

import { useState, useEffect } from "react";
import { useDebounce }          from "use-debounce";
import { supabase }             from "@/lib/supabase";
import ClubCard                 from "@/components/ui/ClubCard";

interface Club {
  id: number;
  created_at: string;
  club_name: string;
  description: string;
  club_image: string;
  tags: string;
}

export default function ClubListPage() {
  const [clubs, setClubs]           = useState<Club[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch]           = useDebounce(searchTerm, 200);

  const [tagFilter, setTagFilter]   = useState("");

  const [sortBy, setSortBy]         = useState<"created_at" | "club_name">("created_at");

  // fetch & re‐fetch when sort changes
  useEffect(() => {
    setLoading(true);
    supabase
      .from<Club>("clublists")
      .select("*")
      .order(sortBy, { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          setError("Could not load clubs.");
          setClubs([]);
        } else {
          setClubs(data || []);
          setError(null);
        }
      })
      .finally(() => setLoading(false));
  }, [sortBy]);

  // extract unique tag names
  const uniqueTags = Array.from(
    clubs.reduce<Set<string>>((acc, c) => {
      c.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((t) => acc.add(t));
      return acc;
    }, new Set())
  );

  // final filtered list
  const filteredClubs = clubs.filter((c) => {
    const nameMatch = c.club_name.toLowerCase().includes(debouncedSearch.toLowerCase());
    if (!tagFilter) return nameMatch;
    return c.tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .includes(tagFilter.toLowerCase())
      && nameMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* title + controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Club Directory</h1>

          <div className="flex gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="🔍 Search clubs…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#12bca2]"
            />

            <input
              type="text"
              placeholder="🏷️ Filter by tag…"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#12bca2]"
            />
          </div>
        </div>

        {/* quick‐filter buttons */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setTagFilter("")}
            className={`px-3 py-1 rounded-full text-sm ${
              !tagFilter ? "bg-[#12bca2] text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            All
          </button>
          {uniqueTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tag)}
              className={`px-3 py-1 rounded-full text-sm ${
                tagFilter === tag
                  ? "bg-[#12bca2] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* sort buttons */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setSortBy("created_at")}
            className={`px-3 py-1 rounded ${
              sortBy === "created_at" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            Newest
          </button>
          <button
            onClick={() => setSortBy("club_name")}
            className={`px-3 py-1 rounded ${
              sortBy === "club_name" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            Name
          </button>
        </div>

        {/* status */}
        {loading && <p className="text-gray-600">Loading clubs…</p>}
        {error   && <p className="text-red-600">{error}</p>}
        {!loading && !error && filteredClubs.length === 0 && (
          <p className="text-gray-500 italic">No clubs match your filters.</p>
        )}

        {/* grid */}
        {!loading && !error && filteredClubs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredClubs.map((club) => (
              <ClubCard
                key={club.id}
                club={club}
                onDelete={() =>
                  setClubs((prev) => prev.filter((c) => c.id !== club.id))
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
