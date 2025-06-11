import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/header.js';
import withAuth from '@/components/withAuth';

function TeacherTimetable({ user }) {
  const router = useRouter();

  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceLog, setAttendanceLog] = useState([]);

  const todayDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  useEffect(() => {
    const allClasses = JSON.parse(localStorage.getItem('striveClassGroups')) || [];
    const teacherClasses = allClasses.filter(c => c.teacherId === user.email);
    setClasses(teacherClasses);

    const allStudents = JSON.parse(localStorage.getItem('striveStudents')) || [];
    setStudents(allStudents);

    const log = JSON.parse(localStorage.getItem('striveAttendance')) || [];
    setAttendanceLog(log);
  }, [user.email]);

  // Mark attendance (true = present, false = absent)
  const markAttendanceLog = (studentId, isPresent) => {
    let updatedLog = [...attendanceLog];
    const index = updatedLog.findIndex(
      rec => rec.className === selectedClass.name && rec.studentId === studentId && rec.date === todayDate
    );

    if (index !== -1) {
      updatedLog[index].status = isPresent;
    } else {
      updatedLog.push({
        className: selectedClass.name,
        studentId,
        date: todayDate,
        status: isPresent,
      });
    }

    localStorage.setItem('striveAttendance', JSON.stringify(updatedLog));
    setAttendanceLog(updatedLog);
  };

  // Get today’s attendance summary for selected class
  const getTodayAttendanceSummary = () => {
    if (!selectedClass) return { present: 0, absent: 0 };

    const filteredLog = attendanceLog.filter(
      rec => rec.className === selectedClass.name && rec.date === todayDate
    );

    let present = 0;
    let absent = 0;

    selectedClass.studentIds.forEach(studentId => {
      const record = filteredLog.find(r => r.studentId === studentId);
      if (record) {
        if (record.status) present++;
        else absent++;
      } else {
        absent++; // default absent if no record
      }
    });

    return { present, absent };
  };

  const { present, absent } = getTodayAttendanceSummary();

  // Helpers for timetable
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  const getClassAtSlot = (day, time) => classes.find(c => c.day === day && c.time === time);

  // Navigate to student profile page
  const openStudentProfile = (email) => {
    router.push(`/student-profile/${encodeURIComponent(email)}`);
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

              // Get attendance status for today
              const attRecord = attendanceLog.find(
                r => r.className === selectedClass.name && r.studentId === stu.id && r.date === todayDate
              );
              const attendanceStatus = attRecord ? attRecord.status : null;

              return (
                <li key={stu.email} className="flex justify-between items-center bg-white px-4 py-2 border rounded">
                  <button
                    onClick={() => openStudentProfile(stu.email)}
                    className="text-blue-600 hover:underline text-left"
                  >
                    {stu.name}
                  </button>

                  <div className="space-x-2">
                    <button
                      onClick={() => markAttendanceLog(stu.id, true)}
                      className={`px-3 py-1 rounded font-semibold text-sm ${attendanceStatus === true ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}
                    >
                      Present
                    </button>

                    <button
                      onClick={() => markAttendanceLog(stu.id, false)}
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

