'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AddFriendsPage() {
  const [emailInput, setEmailInput] = useState('');
  const [friendEmails, setFriendEmails] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndFriends = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const id = session.user.id;
      setUserId(id);

      const { data, error } = await supabase
        .from('friends')
        .select('friend_email')
        .eq('user_id', id);

      if (!error && data) {
        setFriendEmails(data.map((entry) => entry.friend_email));
      }
    };

    fetchUserAndFriends();
  }, []);

  const handleAddFriend = async () => {
    if (!userId || !emailInput) return;

    const { error } = await supabase
      .from('friends')
      .insert({ user_id: userId, friend_email: emailInput });

    if (!error) {
      setFriendEmails((prev) => [...prev, emailInput]);
      setEmailInput('');
    } else {
      console.error('Error adding friend:', error);
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
        <CardContent className="space-y-4">
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
            {friendEmails.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-gray-700">
                {friendEmails.map((email, index) => (
                  <li key={index}>{email}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No friends added yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}