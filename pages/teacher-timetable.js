import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/header.js';
import withAuth from '@/components/withAuth';

function TeacherTimetable({ user }) {
  const router = useRouter();

  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    const allClasses = JSON.parse(localStorage.getItem('striveClassGroups')) || [];
    const teacherClasses = allClasses.filter(c => c.teacherId === user.email);
    setClasses(teacherClasses);

    const allStudents = JSON.parse(localStorage.getItem('striveStudents')) || [];
    setStudents(allStudents);
  }, [user.email]);

  // Count attendance for the selected class
  const countAttendance = () => {
    if (!selectedClass || !selectedClass.attendance) return { present: 0, absent: 0 };

    let present = 0;
    let absent = 0;

    selectedClass.studentIds.forEach(id => {
      if (selectedClass.attendance[id] === true) present++;
      else if (selectedClass.attendance[id] === false) absent++;
      else absent++; // default assume absent if no record
    });

    return { present, absent };
  };

  const { present, absent } = countAttendance();

  // Helper to find class for timetable slot
  const getClassAtSlot = (day, time) => classes.find(c => c.day === day && c.time === time);

  // Days and Times for table
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  // Navigate to student profile page
  const openStudentProfile = (email) => {
    router.push(`/student-profile/${encodeURIComponent(email)}`);
  };

  // Mark attendance: true = present, false = absent
  const markAttendance = (studentId, isPresent) => {
    const updated = [...classes];
    const classIndex = classes.findIndex(c => c.name === selectedClass.name && c.day === selectedClass.day && c.time === selectedClass.time);
    if (classIndex === -1) return;

    if (!updated[classIndex].attendance) updated[classIndex].attendance = {};
    updated[classIndex].attendance[studentId] = isPresent;

    setClasses(updated);
    setSelectedClass(updated[classIndex]);
    localStorage.setItem('striveClassGroups', JSON.stringify(updated));
  };

  return (
    <div className="bg-white min-h-screen p-6 text-black">
      <Header user={user} />
      <h1 className="text-3xl font-bold text-orange-500 mb-6">📅 My Timetable</h1>

      {/* Timetable Table */}
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

      {/* Selected Class Students & Attendance */}
      {selectedClass && (
        <div className="bg-orange-50 p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold text-orange-600 mb-2">
            🧑‍🏫 {selectedClass.name} - {selectedClass.day} at {selectedClass.time}
          </h2>

          <div className="mb-4 text-sm">
            <span className="mr-4 font-semibold">Present: {present}</span>
            <span className="font-semibold">Absent: {absent}</span>
          </div>

          <ul className="space-y-2">
            {selectedClass.studentIds.map(emailOrId => {
              const stu = students.find(s => s.email === emailOrId || s.id === emailOrId);
              if (!stu) return null;

              const attendanceStatus = selectedClass.attendance?.[stu.id];

              return (
                <li key={stu.email} className="flex justify-between items-center bg-white px-4 py-2 border rounded">
                  <button
                    onClick={() => openStudentProfile(stu.email)}
                    className="text-blue-600 hover:underline"
                  >
                    {stu.name}
                  </button>

                  <div className="space-x-2">
                    <button
                      onClick={() => markAttendance(stu.id, true)}
                      className={`px-3 py-1 rounded font-semibold text-sm ${attendanceStatus === true ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}
                    >
                      Present
                    </button>

                    <button
                      onClick={() => markAttendance(stu.id, false)}
                      className={`px-3 py-1 rounded font-semibold text-sm ${attendanceStatus === false ? 'bg-red-500 text-white' : 'bg-gray-300 text-black'}`}
                    >
                      Absent
                    </button>
                  </div>
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
