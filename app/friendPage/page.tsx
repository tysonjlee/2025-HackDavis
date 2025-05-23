'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AddFriendsPage() {
  const router = useRouter();
  const [emailInput, setEmailInput] = useState('');
  const [friendProfiles, setFriendProfiles] = useState<
    { id: string; name: string; avatar_url: string | null }[]
  >([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMsg(message);
    setTimeout(() => {
      setToastMsg(null);
    }, 2500);
  };

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
      .select('id, name, avatar_url, email')
      .eq('email', emailInput)
      .single();

    if (findError || !user) {
      showToast('User not found with that email.');
      return;
    }

    if (user.id === userId) {
      showToast("You can't add yourself as a friend.");
      return;
    }

    const alreadyFriends = friendProfiles.some((f) => f.id === user.id);
    if (alreadyFriends) {
      showToast('This user is already your friend.');
      return;
    }

    const { error } = await supabase
      .from('friends')
      .insert({ user_id: userId, friend_id: user.id });

    if (!error) {
      setFriendProfiles((prev) => [
        ...prev,
        {
          id: user.id,
          name: user.name,
          avatar_url: user.avatar_url || null,
        },
      ]);
      setEmailInput('');
    } else {
      console.error('Error adding friend:', error);
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
    <div className="relative flex items-center justify-center min-h-screen animated-gradient overflow-hidden px-4 py-10">
      {/* 🌊 Animated wave top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden z-0 pointer-events-none">
        <svg
          className="w-full h-[400px] animate-sine-wave transform-gpu"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            fillOpacity="0.1"
            d="M0,224L60,224C120,224,240,224,360,197.3C480,171,600,117,720,96C840,75,960,85,1080,96C1200,107,1320,117,1380,122.7L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* 🟦 Back Button Styled */}
      <Button
        variant="outline"
        className="absolute top-4 right-4 text-[#002855] border-[#002855] hover:bg-[#e5e7eb] z-10"
        onClick={() => router.push('/clubLists')}
      >
        ← Back to Club Lists
      </Button>

      {/* 🍞 Toast Message */}
      {toastMsg && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg animate-fade-out z-10">
          {toastMsg}
        </div>
      )}

      <Card className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 relative z-10">
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
    </div>
  );
}
