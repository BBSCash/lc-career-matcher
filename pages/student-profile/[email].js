import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '@/components/header';
import withAuth from '@/components/withAuth';

function StudentProfile({ user }) {
  const router = useRouter();
  const { email } = router.query;

  const [student, setStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState({});

  useEffect(() => {
    if (!router.isReady) return; // wait for router to be ready

    if (!email) return;

    const students = JSON.parse(localStorage.getItem('striveStudents')) || [];
    const foundStudent = students.find(s => s.email.toLowerCase() === email.toLowerCase());
    setStudent(foundStudent || null);

    const allResults = JSON.parse(localStorage.getItem('striveResults')) || [];
    const studentResults = allResults.filter(r => r.studentEmail.toLowerCase() === email.toLowerCase());
    setResults(studentResults);

    const attendanceLog = JSON.parse(localStorage.getItem('striveAttendance')) || [];
    const studentAttendance = attendanceLog.filter(a => a.studentId === foundStudent?.id);

    // Aggregate attendance by class
    const summary = {};
    studentAttendance.forEach(({ className, status }) => {
      if (!summary[className]) summary[className] = { present: 0, absent: 0 };
      if (status) summary[className].present++;
      else summary[className].absent++;
    });

    setAttendanceSummary(summary);
  }, [router.isReady, email]);

  if (!router.isReady) {
    // You can show a loading spinner or nothing while router loads
    return null;
  }

  if (!student) return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-red-600">Student not found.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">{student.name}'s Profile</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Personal Details</h2>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Year Group:</strong> {student.yearGroup}</p>
          <p><strong>Date of Birth:</strong> {student.dateOfBirth || 'N/A'}</p>
          <p><strong>Parent Contact:</strong> {student.parentContact || 'N/A'}</p>
          <p><strong>Address:</strong> {student.address || 'N/A'}</p>
          <p><strong>Registered:</strong> {student.registered ? 'Yes' : 'No'}</p>
          <p><strong>Notes:</strong> {student.notes || 'None'}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Test Results</h2>
          {results.length === 0 ? (
            <p>No test results available.</p>
          ) : (
            <ul className="list-disc ml-6 space-y-1">
              {results.map((r, i) => (
                <li key={i}>{r.subject} ({r.level}) — {r.topic}: {r.score}/{r.total}</li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Attendance Summary (Year-to-date)</h2>
          {Object.keys(attendanceSummary).length === 0 ? (
            <p>No attendance records available.</p>
          ) : (
            <table className="table-auto border border-gray-300 w-full text-left">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-3 py-1">Class</th>
                  <th className="border border-gray-300 px-3 py-1">Present</th>
                  <th className="border border-gray-300 px-3 py-1">Absent</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(attendanceSummary).map(([className, counts]) => (
                  <tr key={className}>
                    <td className="border border-gray-300 px-3 py-1">{className}</td>
                    <td className="border border-gray-300 px-3 py-1">{counts.present}</td>
                    <td className="border border-gray-300 px-3 py-1">{counts.absent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}

export default withAuth(StudentProfile, ['teacher', 'principal']);

