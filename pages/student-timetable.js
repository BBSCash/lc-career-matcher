import { useEffect, useState } from 'react';
import withAuth from '@/components/withAuth';
import Header from '@/components/header.js';

function StudentTimetable({ user }) {
  const [studentData, setStudentData] = useState(null);
  const [classGroups, setClassGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const TIMES = [
    '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00'
  ];

  useEffect(() => {
    const allStudents = JSON.parse(localStorage.getItem('striveStudents')) || [];
    const matchedStudent = allStudents.find(
      (s) => s.email && user.email && s.email.toLowerCase() === user.email.toLowerCase()
    );
    if (!matchedStudent) return;

    setStudentData(matchedStudent);

    const allClasses = JSON.parse(localStorage.getItem('striveClassGroups')) || [];
    const assigned = allClasses.filter(cls => cls.studentIds.includes(matchedStudent.id));
    setClassGroups(assigned);

    const attendanceRecords = JSON.parse(localStorage.getItem('striveAttendance')) || [];
    setAttendance(attendanceRecords);

    const allUsers = JSON.parse(localStorage.getItem('striveUsers')) || [];
    const teacherList = allUsers.filter(u => u.role === 'teacher');
    setTeachers(teacherList);
  }, [user.email]);

  const getAttendanceStatus = (className) => {
    const today = new Date().toISOString().split('T')[0];
    const record = attendance.find(
      (a) => a.studentId === studentData?.id && a.className === className && a.date === today
    );
    return record ? record.status : '';
  };

  const getTeacherName = (email) => {
    const teacher = teachers.find(t => t.email === email);
    return teacher ? teacher.name : email;
  };

  const renderCell = (day, time) => {
    const entry = classGroups.find(c => c.day === day && c.time === time);
    if (!entry) return null;
    return (
      <div className="text-sm">
        <div className="font-semibold">{entry.subject}</div>
        <div>{entry.name}</div>
        <div className="text-xs italic">{getTeacherName(entry.teacherEmail)}</div>
        <div className="text-xs">{getAttendanceStatus(entry.name)}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">📅 My Weekly Timetable</h1>

        {!studentData ? (
          <p className="text-gray-600">Unable to load your student profile.</p>
        ) : classGroups.length === 0 ? (
          <p className="text-gray-600">You're not assigned to any classes yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left bg-orange-100">Time</th>
                  {DAYS.map(day => (
                    <th key={day} className="border border-gray-300 px-4 py-2 text-left bg-orange-100">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIMES.map(time => (
                  <tr key={time}>
                    <td className="border border-gray-300 px-4 py-2 bg-gray-100 font-medium">{time}</td>
                    {DAYS.map(day => (
                      <td key={day + time} className="border border-gray-300 px-4 py-2 align-top">
                        {renderCell(day, time)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(StudentTimetable, ['student']);