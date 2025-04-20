'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

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
        .from('profiles-list')
        .select('name, bio, avatar_url')
        .eq('id', id)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          const { error: insertError } = await supabase
            .from('profiles-list')
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
      .upload(filePath, file, { upsert: true });

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
      setProfilePic(cacheBustedURL);

      const { error: updateError } = await supabase
        .from('profiles-list')
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
      .from('profiles-list')
      .update({ name, bio })
      .eq('id', userId);

    if (error) {
      console.error('Error saving profile:', error);
    } else {
      console.log('Profile updated successfully!');
      setIsDialogOpen(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen animated-gradient overflow-hidden px-4">
      {/* 🌊 Animated background wave */}
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

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 space-y-8 z-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#002855]">
            {name ? `Hi ${name}!` : 'Your Profile'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your public info</p>
        </div>

        <div className="flex justify-center">
          {profilePic ? (
            <img
              src={profilePic}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-[#002855] shadow-md"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder-avatar.png";
              }}
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-sm text-white">
              No Image
            </div>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-[#002855] text-white hover:bg-[#1a3e7c]">
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

        <div className="pt-6 border-t text-center space-y-3">
          <Button
            className="w-full bg-[#FFD100] text-[#002855] hover:bg-[#e6bf00]"
            onClick={() => router.push('/clubLists')}
          >
            Go to Club Lists
          </Button>
          <Button
            variant="outline"
            className="w-full text-red-600 border-red-500 hover:bg-red-50"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
