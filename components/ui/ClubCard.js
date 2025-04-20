// components/ui/ClubCard.js
"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useSession } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";

export default function ClubCard({ club, onDelete }) {
  const session = useSession();

  const [deleting, setDeleting] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [friendsJoinedCount, setFriendsJoinedCount] = useState(0);

  // — load this user’s join/follow status —
  useEffect(() => {
    if (!session) return;
    supabase
      .from("club_joins")
      .select("club_id", { head: true, count: "exact" })
      .eq("user_id", session.user.id)
      .eq("club_id", club.id)
      .then(({ count }) => setIsJoined((count ?? 0) > 0));

    supabase
      .from("club_follows")
      .select("club_id", { head: true, count: "exact" })
      .eq("user_id", session.user.id)
      .eq("club_id", club.id)
      .then(({ count }) => setIsFollowing((count ?? 0) > 0));
  }, [session, club.id]);

  // — count how many friends have joined this club —
  useEffect(() => {
    if (!session) return;
    (async () => {
      const { data: friends, error: fErr } = await supabase
        .from("friends")
        .select("friend_id")
        .eq("user_id", session.user.id);

      if (fErr || !friends?.length) {
        setFriendsJoinedCount(0);
        return;
      }

      const friendIds = friends.map((r) => r.friend_id);
      const { count, error: cErr } = await supabase
        .from("club_joins")
        .select("*", { head: true, count: "exact" })
        .eq("club_id", club.id)
        .in("user_id", friendIds);

      if (cErr) {
        console.error("count error:", cErr);
        setFriendsJoinedCount(0);
      } else {
        setFriendsJoinedCount(count ?? 0);
      }
    })();
  }, [session, club.id]);

  // — handlers —
  const handleJoin = async () => {
    if (!session) return;
    if (isJoined) {
      await supabase
        .from("club_joins")
        .delete()
        .eq("user_id", session.user.id)
        .eq("club_id", club.id);
    } else {
      await supabase
        .from("club_joins")
        .insert({ user_id: session.user.id, club_id: club.id });
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
        .eq("club_id", club.id);
    } else {
      await supabase
        .from("club_follows")
        .insert({ user_id: session.user.id, club_id: club.id });
    }
    setIsFollowing(!isFollowing);
  };

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    const { error } = await supabase
      .from("clublists")
      .delete()
      .eq("id", club.id);
    if (error) {
      console.error("Delete failed:", error);
      setDeleting(false);
    } else {
      onDelete(club.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md flex flex-col overflow-hidden">
      <Link href={`/clubLists/${club.id}`} className="group block flex-1">
        <div className="p-4 space-y-2">
          <h3 className="text-xl font-semibold text-gray-800 group-hover:text-[#12bca2] transition">
            {club.club_name}
          </h3>
          {club.club_image && (
            <div className="w-full h-40 bg-gray-100 rounded-md overflow-hidden">
              <img
                src={club.club_image}
                alt={club.club_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
          )}
          {/* Description now clamps to 3 lines with an ellipsis */}
          <p className="text-gray-600 overflow-hidden line-clamp-2">
            {club.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {club.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
              .map((t) => (
                <span
                  key={t}
                  className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-full"
                >
                  {t}
                </span>
              ))}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={handleJoin}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              isJoined ? "bg-green-200 text-green-800" : "bg-green-500 text-white"
            }`}
          >
            {isJoined ? "Joined" : "Join"}
          </button>
          <button
            onClick={handleFollow}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              isFollowing ? "bg-blue-200 text-blue-800" : "bg-blue-500 text-white"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
          {friendsJoinedCount} {friendsJoinedCount === 1 ? "Friend" : "Friends"}
        </span>
      </div>
    </div>
  );
}
