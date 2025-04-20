// app/clubLists/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession }           from "@supabase/auth-helpers-react";
import { useEffect, useState }  from "react";
import { supabase }             from "@/lib/supabase";

interface Club {
  id: number;
  club_name: string;
  description: string;
  club_image: string;
  tags: string;
  created_at: string;
}

export default function ClubDetailPage() {
  const { id }    = useParams() as { id: string };
  const router    = useRouter();
  const session   = useSession();

  const [club,        setClub]        = useState<Club | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [isJoined,    setIsJoined]    = useState(false);
  const [isFollowing,setIsFollowing] = useState(false);

  // 1) Load the club record
  useEffect(() => {
    setLoading(true);
    supabase
      .from<Club>("clublists")
      .select("*")
      .eq("id", Number(id))
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setError("Could not load that club.");
          setClub(null);
        } else {
          setClub(data);
          setError(null);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  // 2) Load join/follow state for current user
  useEffect(() => {
    if (!session) return;

    supabase
      .from("club_joins")
      .select("club_id", { count: "exact" })
      .eq("user_id", session.user.id)
      .eq("club_id", Number(id))
      .then(({ count }) => setIsJoined(count > 0));

    supabase
      .from("club_follows")
      .select("club_id", { count: "exact" })
      .eq("user_id", session.user.id)
      .eq("club_id", Number(id))
      .then(({ count }) => setIsFollowing(count > 0));
  }, [id, session]);

  const handleJoin = async () => {
    if (!session) return;
    if (isJoined) {
      await supabase
        .from("club_joins")
        .delete()
        .eq("user_id", session.user.id)
        .eq("club_id", Number(id));
    } else {
      await supabase
        .from("club_joins")
        .insert({ user_id: session.user.id, club_id: Number(id) });
    }
    setIsJoined(!isJoined);
  };

  const handleFollow = async () => {
    if (!session) return;
    if (isFollowing) {
      await supabase
        .from("club_follows")
        .delete()
        .eq("user_id", session.user.id)
        .eq("club_id", Number(id));
    } else {
      await supabase
        .from("club_follows")
        .insert({ user_id: session.user.id, club_id: Number(id) });
    }
    setIsFollowing(!isFollowing);
  };

  if (loading) return <p className="p-4 text-gray-600">Loading…</p>;
  if (error)   return <p className="p-4 text-red-600">{error}</p>;
  if (!club)   return <p className="p-4">Club not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Back button */}
        <div className="p-4">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-600 hover:underline"
          >
            ← Back to list
          </button>
        </div>

        {/* Header & Actions */}
        <div className="px-6 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{club.club_name}</h1>
            <p className="text-sm text-gray-500">
              Created on {new Date(club.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleJoin}
              className={`px-4 py-2 rounded-md font-medium transition ${
                isJoined
                  ? "bg-green-200 text-green-800"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {isJoined ? "Joined" : "Join"}
            </button>
            <button
              onClick={handleFollow}
              className={`px-4 py-2 rounded-md font-medium transition ${
                isFollowing
                  ? "bg-blue-200 text-blue-800"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          </div>
        </div>

        {/* Club Image */}
        {club.club_image && (
          <div className="w-full h-64 bg-gray-200">
            <img
              src={club.club_image}
              alt={club.club_name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Description & Tags */}
        <div className="px-6 py-4 space-y-4">
          <div>
            <h2 className="font-semibold text-gray-700">Description</h2>
            <p className="mt-1 text-gray-600">{club.description}</p>
          </div>
          <div>
            <h2 className="font-semibold text-gray-700">Tags</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {club.tags.split(",").map((t) => (
                <span
                  key={t}
                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm"
                >
                  {t.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
