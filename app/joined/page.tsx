// app/joined/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession }          from "@supabase/auth-helpers-react";
import { supabase }            from "@/lib/supabase";
import ClubCard                from "@/components/ui/ClubCard";

export default function JoinedClubsPage() {
  const session = useSession();
  const [clubs, setClubs]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string|null>(null);

  useEffect(() => {
    async function loadJoined() {
      if (!session?.user?.id) return;
      setLoading(true);
      setError(null);

      // 1️⃣ get the list of club_ids you've joined
      const { data: rows, error: rowsErr } = await supabase
        .from("club_joins")
        .select("club_id")
        .eq("user_id", session.user.id);

      if (rowsErr) {
        console.error("Error fetching joined IDs:", rowsErr);
        setError("Could not load your joined clubs.");
        setClubs([]);
        setLoading(false);
        return;
      }

      const clubIds = (rows || []).map((r: any) => r.club_id);
      if (clubIds.length === 0) {
        setClubs([]);
        setLoading(false);
        return;
      }

      // 2️⃣ fetch full club records
      const { data: clubData, error: clubErr } = await supabase
        .from("clublists")
        .select("*")
        .in("id", clubIds)
        .order("created_at", { ascending: false });

      if (clubErr) {
        console.error("Error fetching clubs:", clubErr);
        setError("Could not load your joined clubs.");
        setClubs([]);
      } else {
        setClubs(clubData || []);
      }
      setLoading(false);
    }

    loadJoined();
  }, [session]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Clubs You’ve Joined</h1>

        {loading && <p>Loading your clubs…</p>}
        {error   && <p className="text-red-600">{error}</p>}
        {!loading && !error && clubs.length === 0 && (
          <p className="text-gray-500 italic">You haven’t joined any clubs yet.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && !error && clubs.map((club) => (
            <ClubCard
              key={club.id}
              club={club}
              onDelete={() => {
                // Optional: remove from UI immediately
                setClubs((prev) => prev.filter((c) => c.id !== club.id));
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
