import Link from 'next/link';
import withAuth from '@/components/withAuth';
import Header from '@/components/header.js';

function TeacherDashboard({ user }) {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-orange-500 mb-8">👩‍🏫 Teacher Dashboard</h1>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardCard title="📅 Timetable" link="/teacher-timetable" />
          <DashboardCard title="👥 Manage Classes" link="/teacher-classes" />
          <DashboardCard title="🧪 Test Builder" link="/test-builder" />
          <DashboardCard title="📚 Test Library" link="/teacher-test-library" />
          <DashboardCard title="✅ Take Attendance" link="/attendance" />
          <DashboardCard title="✍️ Enter Student Results" link="/enter-results" />
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, link }) {
  return (
    <Link href={link} className="block bg-orange-100 hover:bg-orange-200 p-6 rounded shadow text-center transition">
      <h2 className="text-xl font-semibold text-orange-600">{title}</h2>
    </Link>
  );
}

export default withAuth(TeacherDashboard, ['teacher']);
