import { useState } from 'react';
import Link from 'next/link';

export default function Header({ user }) {
  const [hovered, setHovered] = useState('');

  const logout = () => {
    localStorage.removeItem('striveUser');
    window.location.href = '/login';
  };

  return (
    <header className="bg-white py-4 px-8 flex justify-between items-center border-b border-gray-200">
      <h1 className="text-2xl font-bold text-orange-500">Strive</h1>
      <nav className="flex space-x-6 font-medium relative items-center">
        {['teacher', 'student', 'principal'].map((section) => (
          <div
            key={section}
            onMouseEnter={() => setHovered(section)}
            onMouseLeave={() => setHovered('')}
            className="relative"
          >
            <span className="cursor-pointer hover:underline capitalize">{section}</span>
            {hovered === section && (
              <div className="absolute top-full left-0 mt-1 bg-white shadow-md rounded-md py-2 px-4 text-black z-10 flex flex-col space-y-1">
                {section === 'teacher' && (
                  <>
                    <Link href="/test-builder">Test Builder</Link>
                    <Link href="/teacher-dashboard">Dashboard</Link>
                    <Link href="/teacher-classes">Manage Classes</Link>
                  </>
                )}
                {section === 'student' && (
                  <>
                    <Link href="/student-test">Tests</Link>
                    <Link href="/test-results">Results</Link>
                  </>
                )}
                {section === 'principal' && (
                  <>
                    <Link href="/principal-dashboard">Principal Dashboard</Link>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
        <Link href="/contact" className="hover:underline">Contact</Link>
        {user && (
          <div className="ml-4 text-sm text-black">
            Logged in as <strong>{user.name}</strong> ({user.role})
            <button onClick={logout} className="ml-2 underline text-red-600">Logout</button>
          </div>
        )}
      </nav>
    </header>
  );
}

