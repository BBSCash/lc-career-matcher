import { useEffect, useState } from 'react';
import withAuth from '@/components/withAuth';
import Header from '@/components/header';

function PrincipalTimetable({ user }) {
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    const allTimetables = JSON.parse(localStorage.getItem('striveTimetables')) || [];
    setTimetable(allTimetables);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">🏫 School Timetable</h1>

        {timetable.length === 0 ? (
          <p className="text-gray-600">No timetable data available.</p>
        ) : (
          <div className="space-y-4">
            {timetable.map((entry, idx) => (
              <div key={idx} className="bg-gray-100 p-4 rounded shadow">
                <p><strong>Class:</strong> {entry.className}</p>
                <p><strong>Subject:</strong> {entry.subject}</p>
                <p><strong>Teacher:</strong> {entry.teacher}</p>
                <p><strong>Day:</strong> {entry.day}</p>
                <p><strong>Time:</strong> {entry.time}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(PrincipalTimetable, ['principal']);