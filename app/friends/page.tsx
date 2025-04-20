// app/friends/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession }                       from "@supabase/auth-helpers-react";
import { supabase }                         from "@/lib/supabase";

export default function FriendsPage() {
  const session = useSession();

  const [friends, setFriends]         = useState<any[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  const [searchTerm, setSearchTerm]   = useState("");
  const [results, setResults]         = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch]   = useState(false);

  // — fetchFriends: load your current friends
  const fetchFriends = useCallback(async () => {
    if (!session?.user?.id) return;
    setLoadingFriends(true);

    // 1️⃣ get list of friend_id for this user
    const { data: rows, error: rowsErr } = await supabase
      .from("friends")
      .select("friend_id")
      .eq("user_id", session.user.id);

    if (rowsErr) {
      console.error("Error loading friend IDs:", rowsErr);
      setFriends([]);
      setLoadingFriends(false);
      return;
    }

    const friendIds = rows.map((r: any) => r.friend_id);
    if (friendIds.length === 0) {
      setFriends([]);
      setLoadingFriends(false);
      return;
    }

    // 2️⃣ fetch their profiles from the `profiles` view
    const { data: profiles, error: profilesErr } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .in("id", friendIds);

    if (profilesErr) {
      console.error("Error loading profiles:", profilesErr);
      setFriends([]);
    } else {
      setFriends(profiles || []);
    }
    setLoadingFriends(false);
  }, [session]);

  // load once on mount
  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  // — searchEffect: look up other users by name/email
  useEffect(() => {
    if (!session?.user?.id || searchTerm.length < 2) {
      setResults([]);
      return;
    }
    setLoadingSearch(true);

    supabase
      .from("profiles")
      .select("id, email, full_name")
      .or(
        `email.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`
      )
      .neq("id", session.user.id)
      .limit(10)
      .then(({ data, error }) => {
        setLoadingSearch(false);
        if (error) {
          console.error("Search error:", error);
          return;
        }
        const existing = new Set(friends.map((f) => f.id));
        setResults((data || []).filter((u: any) => !existing.has(u.id)));
      });
  }, [searchTerm, session, friends]);

  // — add a friend
  const addFriend = async (id: string) => {
    if (!session?.user?.id) return;
    const { error } = await supabase
      .from("friends")
      .insert({ user_id: session.user.id, friend_id: id });
    if (error) {
      console.error("Add friend error:", error);
    } else {
      fetchFriends();
      setSearchTerm("");
      setResults([]);
    }
  };

  // — remove a friend
  const removeFriend = async (id: string) => {
    if (!session?.user?.id) return;
    const { error } = await supabase
      .from("friends")
      .delete()
      .match({ user_id: session.user.id, friend_id: id });
    if (error) {
      console.error("Remove friend error:", error);
    } else {
      fetchFriends();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* 🔍 Search & Add */}
        <section>
          <h1 className="text-2xl font-bold mb-2">Add Friends</h1>
          <input
            type="text"
            placeholder="Search by name or email…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md mb-2 focus:ring-2 focus:ring-[#12bca2]"
          />
          {loadingSearch && <p>Searching…</p>}
          <ul className="space-y-2">
            {results.map((u: any) => (
              <li
                key={u.id}
                className="flex justify-between items-center p-2 bg-white rounded shadow"
              >
                <div>
                  <p className="font-medium">{u.full_name}</p>
                  <p className="text-sm text-gray-600">{u.email}</p>
                </div>
                <button
                  onClick={() => addFriend(u.id)}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* 👥 My Friends */}
        <section>
          <h2 className="text-2xl font-bold mb-2">My Friends</h2>
          {loadingFriends && <p>Loading…</p>}
          {!loadingFriends && friends.length === 0 && (
            <p className="italic text-gray-600">No friends yet.</p>
          )}
          <ul className="space-y-2">
            {friends.map((f: any) => (
              <li
                key={f.id}
                className="flex justify-between items-center p-2 bg-white rounded shadow"
              >
                <div>
                  <p className="font-medium">{f.full_name}</p>
                  <p className="text-sm text-gray-600">{f.email}</p>
                </div>
                <button
                  onClick={() => removeFriend(f.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </section>

      </div>
    </div>
  );
}
