'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error.message);
      setErrorMsg(error.message);
    } else {
      console.log('Login success:', data);
      router.push('/clubLists');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen animated-gradient overflow-hidden px-4">
      {/* 🌊 Animated Sine Wave Background */}
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

      {/* ✅ Logo + Login Card */}
      <div className="z-10 flex flex-col items-center">
        {/* 🟡 ClubHub Logo */}
        <div className="w-[400px]">
          <Image
            src="/clubhub.png"
            alt="ClubHub Logo"
            width={500}
            height={500}
            priority
          />
        </div>

        {/* 🧾 Login Card - moved upward with -mt-6 */}
        <Card className="w-[380px] h-[380px] shadow-lg rounded-2xl -mt-10">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Log In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@ucdavis.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {errorMsg && (
                <p className="text-red-500 text-sm text-center">{errorMsg}</p>
              )}
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
