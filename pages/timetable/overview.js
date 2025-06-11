// timetable/overview.js

import { useEffect, useState } from 'react';
import Header from '@/components/header';

function TimetableOverview({ user }) {
  const [teachers, setTeachers] = useState([]);
  const [requirements, setRequirements] = useState({});
  const [timetable, setTimetable] = useState({});

  useEffect(() => {
    const storedTeachers = JSON.parse(localStorage.getItem('timetableTeachers')) || [];
    const storedRequirements = JSON.parse(localStorage.getItem('timetableRequirements')) || {};
    const storedTimetable = JSON.parse(localStorage.getItem('schoolTimetable')) || {};
    setTeachers(storedTeachers);
    setRequirements(storedRequirements);
    setTimetable(storedTimetable);
  }, []);

  const yearGroups = Object.keys(timetable);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['1', '2', '3', 'Break', '4', '5', '6', 'Break', '7', '8', '9'];

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <Header user={user} />
      <h1 className="text-3xl font-bold text-orange-500 mb-6">🗓️ Timetable Overview</h1>

      {yearGroups.length === 0 ? (
        <p>No timetable data found.</p>
      ) : (
        yearGroups.map((year) => (
          <div key={year} className="mb-12">
            <h2 className="text-xl font-semibold text-orange-600 mb-4">{year} Year</h2>
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 bg-gray-100">Period</th>
                    {days.map((day) => (
                      <th key={day} className="border p-2 bg-gray-100">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {periods.map((p, i) => (
                    <tr key={i} className={p === 'Break' ? 'bg-yellow-100 font-bold' : ''}>
                      <td className="border p-2 text-center">{p}</td>
                      {days.map((day) => (
                        <td key={day} className="border p-2 text-center">
                          {timetable[year]?.[day]?.[p] || '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TimetableOverview;
