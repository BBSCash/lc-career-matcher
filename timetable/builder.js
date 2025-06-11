// timetable/builder.js

import { useEffect, useState } from 'react';
import Header from '@/components/header';
import withAuth from '@/components/withAuth';

function TimetableBuilder({ user }) {
  const [teachers, setTeachers] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [timetable, setTimetable] = useState({});

  useEffect(() => {
    const storedTeachers = JSON.parse(localStorage.getItem('ttTeachers')) || [];
    const storedRequirements = JSON.parse(localStorage.getItem('ttRequirements')) || [];
    const storedTimetable = JSON.parse(localStorage.getItem('ttBuiltTimetable')) || {};
    setTeachers(storedTeachers);
    setRequirements(storedRequirements);
    setTimetable(storedTimetable);
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['1', '2', '3', 'Break', '4', '5', '6', 'Break', '7', '8', '9'];
  const yearGroups = ['1st Year', '2nd Year', '3rd Year', 'Transition Year', '5th Year', '6th Year'];

  const assignClass = (day, period, yearGroup, subject, teacherName) => {
    const key = `${day}-${period}-${yearGroup}`;
    const updated = { ...timetable, [key]: { subject, teacherName } };
    setTimetable(updated);
    localStorage.setItem('ttBuiltTimetable', JSON.stringify(updated));
  };

  const renderCell = (day, period, yearGroup) => {
    const key = `${day}-${period}-${yearGroup}`;
    const cell = timetable[key] || {};

    return (
      <td key={yearGroup} className="border p-1 text-sm text-center">
        {period === 'Break' ? (
          <span className="text-gray-500 italic">Break</span>
        ) : (
          <>
            <div>{cell.subject || '-'}</div>
            <div className="text-xs text-gray-600">{cell.teacherName || ''}</div>
            <select
              className="text-black mt-1 text-xs"
              onChange={(e) => {
                const [subject, teacherName] = e.target.value.split('__');
                assignClass(day, period, yearGroup, subject, teacherName);
              }}
              defaultValue=""
            >
              <option value="">Assign</option>
              {teachers.map(t =>
                t.subjects.map(sub => (
                  <option key={`${t.name}-${sub}`} value={`${sub}__${t.name}`}>
                    {sub} - {t.name}
                  </option>
                ))
              )}
            </select>
          </>
        )}
      </td>
    );
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <Header user={user} />
      <h1 className="text-3xl font-bold text-orange-500 mb-6">🗓️ Timetable Builder</h1>

      {days.map(day => (
        <div key={day} className="mb-10">
          <h2 className="text-2xl text-orange-600 font-semibold mb-2">{day}</h2>
          <table className="w-full border text-sm">
            <thead>
              <tr>
                <th className="border p-1">Period</th>
                {yearGroups.map(y => (
                  <th key={y} className="border p-1">{y}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map(p => (
                <tr key={`${day}-${p}`}>
                  <td className="border p-1 font-semibold text-center">{p}</td>
                  {yearGroups.map(y => renderCell(day, p, y))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default withAuth(TimetableBuilder, ['principal']);
