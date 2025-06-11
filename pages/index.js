import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-center items-center px-6">
      <h1 className="text-4xl font-bold text-orange-500 mb-6 text-center">🎓 Welcome to Strive</h1>
      <p className="text-lg text-center max-w-xl mb-8">
        Empowering students, teachers, and principals to track progress, manage classes, and prepare for success.
      </p>

      <div className="flex space-x-4">
        <Link href="/login" className="bg-orange-500 text-white px-6 py-3 rounded text-lg font-semibold">
          🔐 Login
        </Link>
        <Link href="/register" className="border border-orange-500 text-orange-500 px-6 py-3 rounded text-lg font-semibold">
          ➕ Register
        </Link>
      </div>
    </div>
  );
}
