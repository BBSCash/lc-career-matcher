// pages/principal-dashboard.js

import Header from '@/components/header';
import withAuth from '@/components/withAuth';
import { useRouter } from 'next/router';

function PrincipalDashboard({ user }) {
  const router = useRouter();

  const buttons = [
    { label: 'Manage Students', path: '/principal-students' },
    { label: 'Manage Classes', path: '/principal-classes' },
    { label: 'Attendance Report', path: '/attendance-report' },
    { label: 'Manage Users', path: '/user-management.js' },
    { label: 'Analytics', path: '/principal-analytics' }
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-orange-500 mb-8">🎓 Principal Dashboard</h1>

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
    </div>
  );
}


export default withAuth(PrincipalDashboard, ['principal']);
