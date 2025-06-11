import { useState, useEffect } from 'react';
import Header from '@/components/header.js';
import withAuth from '@/components/withAuth';

function TeacherTimetable({ user }) {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    const storedClasses = JSON.parse(localStorage.getItem('striveClassGroups')) || [];
    const teacherClasses = storedClasses.filter(c => c.teacherId === user.email);
    setClasses(teacherClasses);

    const allStudents = JSON.parse(localStorage.getItem('striveStudents')) || [];
    setStudents(allStudents);
  }, [user.email]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  const getClassAtSlot = (day, time) => {
    return classes.find(c => c.day === day && c.time === time);
  };

  const toggleAttendance = (studentId) => {
    const updated = [...classes];
    const classIndex = classes.findIndex(c => c.name === selectedClass.name && c.day === selectedClass.day && c.time === selectedClass.time);
    if (!updated[classIndex].attendance) updated[classIndex].attendance = {};
    updated[classIndex].attendance[studentId] = !updated[classIndex].attendance[studentId];
    setClasses(updated);
    setSelectedClass(updated[classIndex]);
    localStorage.setItem('striveClassGroups', JSON.stringify(updated));
  };

  return (
    <div className="bg-white min-h-screen p-6 text-black">
      <Header user={user} />
      <h1 className="text-3xl font-bold text-orange-500 mb-6">📅 My Timetable</h1>

      <div className="overflow-x-auto mb-8">
        <table className="min-w-full border border-gray-300 text-center">
          <thead className="bg-orange-100 text-orange-700">
            <tr>
              <th className="border px-4 py-3 text-sm">Time</th>
              {days.map(day => (
                <th key={day} className="border px-4 py-3 text-sm font-medium">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map(time => (
              <tr key={time} className="odd:bg-gray-50">
                <td className="border px-4 py-3 font-semibold text-sm text-gray-700">{time}</td>
                {days.map(day => {
                  const classSlot = getClassAtSlot(day, time);
                  return (
                    <td key={day} className="border px-2 py-3 text-sm">
                      {classSlot ? (
                        <button
                          onClick={() => setSelectedClass(classSlot)}
                          className="bg-orange-100 hover:bg-orange-200 p-2 rounded shadow-sm w-full text-left"
                        >
                          <div className="text-orange-600 font-semibold">{classSlot.name}</div>
                          <div className="text-xs text-gray-700">{classSlot.yearGroup} • {classSlot.subject}</div>
                        </button>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedClass && (
        <div className="bg-orange-50 p-4 rounded shadow">
          <h2 className="text-xl font-semibold text-orange-600 mb-4">
            🧑‍🏫 {selectedClass.name} - {selectedClass.day} at {selectedClass.time}
          </h2>
          <ul className="space-y-2">
            {selectedClass.studentIds.map(id => {
              const stu = students.find(s => s.id === id);
              if (!stu) return null;
              const isPresent = selectedClass.attendance?.[id];
              return (
                <li key={id} className="flex justify-between items-center bg-white px-4 py-2 border rounded">
                  <span>{stu.name}</span>
                  <button
                    onClick={() => toggleAttendance(id)}
                    className={`px-3 py-1 rounded font-semibold text-sm ${isPresent ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                  >
                    {isPresent ? 'Present' : 'Absent'}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default withAuth(TeacherTimetable, ['teacher']);
