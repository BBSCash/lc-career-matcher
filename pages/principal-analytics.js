import { useEffect, useState } from 'react';
import Header from '@/components/header';
import withAuth from '@/components/withAuth';

function PrincipalAnalytics({ user }) {
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem('striveStudents')) || [];
    setStudents(storedStudents);

    fetch('/api/all-results')
      .then(res => res.json())
      .then(data => setResults(data.results || []));

    const storedAttendance = JSON.parse(localStorage.getItem('striveAttendance')) || [];
    setAttendance(storedAttendance);
  }, []);

  return (
    <div className="bg-white min-h-screen p-6 text-black">
      <Header user={user} />
      <h1 className="text-3xl font-bold text-orange-500 mb-6">📊 Principal Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Student Breakdown */}
        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-orange-600">Student Overview</h2>
          <p>Total Students: {students.length}</p>
          <p>Registered: {students.filter(s => s.registered).length}</p>
          <p>Not Registered: {students.filter(s => !s.registered).length}</p>
          <div className="mt-3">
            <h3 className="font-semibold mb-1">By Year Group:</h3>
            <ul className="list-disc ml-6">
              {[...new Set(students.map(s => s.yearGroup))].map(yr => (
                <li key={yr}>{yr}: {students.filter(s => s.yearGroup === yr).length}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 2: Placeholder for Subject Averages */}
        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-orange-600">Subject Averages</h2>
          <p>Coming next: Average % scores per subject</p>
        </div>

        {/* Section 3: CAO Points Insights */}
        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-orange-600">CAO Points Overview</h2>
          <p>Coming soon: Avg CAO points and high performers by year</p>
        </div>

        {/* Section 4: Attendance Summary */}
        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-orange-600">Attendance Insights</h2>
          <p>Coming soon: Class-level attendance %</p>
        </div>
      </div>
    </div>
  );
}

export default withAuth(PrincipalAnalytics, ['principal']);
