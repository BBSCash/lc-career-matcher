import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '@/components/header';
import withAuth from '@/components/withAuth';

function StudentProfile({ user }) {
  const router = useRouter();
  const { email } = router.query;

  const [student, setStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [attendance, setAttendance] = useState([]);

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <p className="text-gray-500 text-lg">Loading student profile...</p>
      </div>
    );
  }

  useEffect(() => {
    if (!email) return;

    const students = JSON.parse(localStorage.getItem('striveStudents')) || [];
    const foundStudent = students.find(s => s.email && s.email.toLowerCase() === email.toLowerCase());
    setStudent(foundStudent || null);

    const allResults = JSON.parse(localStorage.getItem('striveResults')) || [];
    const studentResults = allResults.filter(r => r.studentEmail && r.studentEmail.toLowerCase() === email.toLowerCase());
    setResults(studentResults);

    const allAttendance = JSON.parse(localStorage.getItem('striveAttendance')) || [];
    const studentAttendance = allAttendance.filter(a => a.studentEmail && a.studentEmail.toLowerCase() === email.toLowerCase());
    setAttendance(studentAttendance);
  }, [email]);

  if (!student) return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <main className="max-w-4xl mx-auto p-8">
        <p className="text-red-600 text-center text-xl font-semibold">Student not found.</p>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <main className="max-w-5xl mx-auto p-8 space-y-12">
        <h1 className="text-4xl font-extrabold text-orange-600 border-b-4 border-orange-300 pb-2">{student.name}'s Profile</h1>

        {/* Personal Details */}
        <section className="bg-orange-50 rounded shadow p-6">
          <h2 className="text-2xl font-semibold text-orange-500 mb-4 border-b border-orange-300 pb-1">Personal Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg">
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Year Group:</strong> {student.yearGroup}</p>
            <p><strong>Date of Birth:</strong> {student.dateOfBirth || 'N/A'}</p>
            <p><strong>Parent Contact:</strong> {student.parentContact || 'N/A'}</p>
            <p><strong>Address:</strong> {student.address || 'N/A'}</p>
            <p><strong>Registered:</strong> {student.registered ? 'Yes' : 'No'}</p>
            <p className="sm:col-span-2"><strong>Notes:</strong> {student.notes || 'None'}</p>
          </div>
        </section>

        {/* Test Results */}
        <section className="bg-orange-50 rounded shadow p-6">
          <h2 className="text-2xl font-semibold text-orange-500 mb-4 border-b border-orange-300 pb-1">Test Results</h2>
          {results.length === 0 ? (
            <p className="text-gray-600">No test results available.</p>
          ) : (
            <ul className="list-disc ml-6 space-y-2 text-lg max-h-96 overflow-y-auto pr-4">
              {results.map((r, i) => (
                <li key={i} className="flex justify-between">
                  <span>{r.subject} ({r.level}) — {r.topic || 'General'}:</span>
                  <span className="font-semibold">{r.score}/{r.total}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Attendance Records */}
        <section className="bg-orange-50 rounded shadow p-6">
          <h2 className="text-2xl font-semibold text-orange-500 mb-4 border-b border-orange-300 pb-1">Attendance Records</h2>
          {attendance.length === 0 ? (
            <p className="text-gray-600">No attendance records available.</p>
          ) : (
            <ul className="list-disc ml-6 space-y-2 text-lg max-h-96 overflow-y-auto pr-4">
              {attendance.map((a, i) => (
                <li key={i} className="flex justify-between">
                  <span>{a.date}</span>
                  <span className={`font-semibold ${a.status === 'Present' ? 'text-green-600' : 'text-red-600'}`}>{a.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default withAuth(StudentProfile, ['teacher', 'principal']);
