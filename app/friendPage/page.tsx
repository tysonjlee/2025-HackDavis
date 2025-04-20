'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AddFriendsPage() {
  const [emailInput, setEmailInput] = useState('');
  const [friendProfiles, setFriendProfiles] = useState<
    { id: string; name: string; avatar_url: string | null }[]
  >([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndFriends = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const id = session.user.id;
      setUserId(id);

      const { data: friendLinks, error } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', id);

      if (!error && friendLinks.length > 0) {
        const friendIds = friendLinks.map((f) => f.friend_id);

        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name, avatar_url')
          .in('id', friendIds);

        if (profiles) setFriendProfiles(profiles);
      }
    };

    fetchUserAndFriends();
  }, []);

  const handleAddFriend = async () => {
    if (!userId || !emailInput) return;

    const { data: user, error: findError } = await supabase
      .from('profiles')
      .select('id, name, avatar_url')
      .eq('email', emailInput)
      .single();

    if (!findError && user) {
      const { error } = await supabase
        .from('friends')
        .insert({ user_id: userId, friend_id: user.id });

      if (!error) {
        setFriendProfiles((prev) => [...prev, {
          id: user.id,
          name: user.name,
          avatar_url: user.avatar_url || null,
        }]);
        setEmailInput('');
      } else {
        console.error('Error adding friend:', error);
      }
    } else {
      console.error('User not found with that email.');
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    if (!userId) return;

    const { error } = await supabase
      .from('friends')
      .delete()
      .match({ user_id: userId, friend_id: friendId });

    if (!error) {
      setFriendProfiles((prev) => prev.filter((f) => f.id !== friendId));
    } else {
      console.error('Error removing friend:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10 relative">
      <Link href="/clubLists" className="absolute top-4 right-4 text-sm text-blue-600 hover:underline">
        ← Back to Club Lists
      </Link>
      <Card className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">Add Friends</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Input
              placeholder="Enter friend's email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
            <Button onClick={handleAddFriend}>Add</Button>
          </div>

          <div>
            <h2 className="text-md font-semibold mb-2">Your Friends:</h2>
            {friendProfiles.length > 0 ? (
              <div className="space-y-2">
                {friendProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={profile.avatar_url || '/placeholder-avatar.png'}
                        alt={profile.name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-300"
                      />
                      <p className="text-sm text-gray-800">{profile.name}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFriend(profile.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-semibold"
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No friends added yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
