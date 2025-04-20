import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col h-screen items-center justify-center bg-white space-y-4">
      <h1 className="text-4xl font-bold">Welcome to ClubHub</h1>
      
      <Link
        href="/login"
        className="text-blue-600 underline text-lg hover:text-blue-800"
      >
        Go to Login
      </Link>
      <Link
        href="/register"
        className="text-yellow-600 underline text-lg hover:text-yellow-800"
      >
        Register Now
      </Link>
    </main>
  );
}
