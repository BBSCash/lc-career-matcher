import { useState } from 'react';
import Link from 'next/link';

export default function Header({ user }) {
  const [hovered, setHovered] = useState('');

  const logout = () => {
    localStorage.removeItem('striveUser');
    window.location.href = '/login';
  };

  // Map roles to dashboard paths for logo link
  const dashboardRoutes = {
    teacher: '/teacher-dashboard',
    student: '/student-dashboard',
    principal: '/principal-dashboard',
  };
  const dashboardPath = user ? dashboardRoutes[user.role] || '/' : '/';

  return (
    <header className="bg-white py-4 px-8 flex justify-between items-center border-b border-gray-200">
      <h1 className="text-2xl font-bold text-orange-500 cursor-pointer hover:text-orange-600">
        <Link href={dashboardPath}>
          <a>Strive</a>
        </Link>
      </h1>
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
              <div className="absolute top-full left-0 mt-1 bg-white shadow-md rounded-md py-2 px-4 text-black z-10 flex flex-col space-y-1 min-w-[150px]">
                {section === 'teacher' && (
                  <>
                    <Link href="/test-builder"><a className="hover:text-orange-500">Test Builder</a></Link>
                    <Link href="/teacher-dashboard"><a className="hover:text-orange-500">Dashboard</a></Link>
                    <Link href="/teacher-classes"><a className="hover:text-orange-500">Manage Classes</a></Link>
                  </>
                )}
                {section === 'student' && (
                  <>
                    <Link href="/student-test"><a className="hover:text-orange-500">Tests</a></Link>
                    <Link href="/test-results"><a className="hover:text-orange-500">Results</a></Link>
                  </>
                )}
                {section === 'principal' && (
                  <>
                    <Link href="/principal-dashboard"><a className="hover:text-orange-500">Principal Dashboard</a></Link>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
        <Link href="/contact"><a className="hover:underline">Contact</a></Link>
        {user && (
          <div className="ml-4 text-sm text-black whitespace-nowrap">
            Logged in as <strong>{user.name}</strong> ({user.role})
            <button onClick={logout} className="ml-2 underline text-red-600">Logout</button>
          </div>
        )}
      </nav>
    </header>
  );
}

