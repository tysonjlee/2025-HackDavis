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

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

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
          } else {
            console.log('Inserted default profile row for new user');
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
    const filePath = `${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
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
    console.log("Public profile pic URL:", publicURL);

    if (publicURL) {
      setProfilePic(publicURL);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicURL })
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
      .update({ name, bio, avatar_url: profilePic })
      .eq('id', userId);

    if (error) {
      console.error('Error saving profile:', error);
    } else {
      console.log('Profile updated successfully!');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Profile Page</h1>
      <div style={{ marginBottom: '20px' }}>
        <p>Welcome to your profile!</p>

        {profilePic ? (
          <img
            src={profilePic}
            alt="Profile"
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginTop: '1rem',
            }}
          />
        ) : (
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: '#ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '1rem',
            }}
          >
            <span>No Image</span>
          </div>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <button
              style={{
                marginTop: '1rem',
                padding: '10px 20px',
                backgroundColor: '#0070f3',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Edit Profile
            </button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            <Link href="/" style={{ color: '#0070f3', textDecoration: 'none' }}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/settings" style={{ color: '#0070f3', textDecoration: 'none' }}>
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ProfilePage;
