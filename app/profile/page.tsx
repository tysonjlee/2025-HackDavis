'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.user) {
        console.error("No active session or user not logged in.");
        return;
      }

      const id = session.user.id;
      setUserId(id);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('name, bio, avatar_url')
        .eq('id', id)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([{ id }]);
          if (insertError) {
            console.error('Error inserting default profile row:', insertError);
          }
        } else {
          console.error('Error fetching profile:', profileError);
        }
        return;
      }

      if (profile) {
        setName(profile.name || '');
        setBio(profile.bio || '');
        setProfilePic(profile.avatar_url || null);
      }
    };

    loadProfile();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true }); // ✅ Overwrite old file

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return;
    }

    const { data: publicURLData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const publicURL = publicURLData?.publicUrl;
    const cacheBustedURL = `${publicURL}?t=${Date.now()}`;

    if (publicURL) {
      // Update UI
      setProfilePic(cacheBustedURL);

      // Update database with latest URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: cacheBustedURL })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating avatar URL:', updateError);
      }
    }
  };

  const handleSave = async () => {
    if (!userId) return;

    const { error } = await supabase
      .from('profiles')
      .update({ name, bio })
      .eq('id', userId);

    if (error) {
      console.error('Error saving profile:', error);
    } else {
      console.log('Profile updated successfully!');
      setIsDialogOpen(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-[#f2f5fa] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#002855]">Your Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your public info</p>
        </div>

        <div className="flex justify-center">
          {profilePic ? (
            <img
              src={profilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border border-gray-300"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder-avatar.png";
              }}
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-sm text-white">
              No Image
            </div>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-[#002855] text-white hover:bg-[#1a3e7c] mt-2">
              Edit Profile
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="profilePic">Profile Picture</Label>
                <Input
                  id="profilePic"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="pt-6 border-t text-center text-sm text-gray-500">
          <Link href="/clubLists" className="hover:text-[#002855]">Go to Club Lists</Link>
        </div>
      </div>
    </main>
  );
}
