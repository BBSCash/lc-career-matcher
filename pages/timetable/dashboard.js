// timetable/dashboard.js

import { useRouter } from 'next/router';

export default function TimetableDashboard() {
  const router = useRouter();

  const buttons = [
    { label: '📋 Teacher Setup', path: '/timetable/teachers' },
    { label: '📊 Requirements Setup', path: '/timetable/requirements' },
    { label: '🧱 Timetable Builder', path: '/timetable/builder' },
    { label: '📅 Timetable Overview', path: '/timetable/overview' }
  ];

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <h1 className="text-3xl font-bold text-orange-500 mb-6">🗂 Timetable Management</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {buttons.map(({ label, path }) => (
          <button
            key={path}
            onClick={() => router.push(path)}
            className="bg-orange-500 text-white rounded-lg p-6 shadow-md hover:bg-orange-600 transition text-xl font-semibold"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
