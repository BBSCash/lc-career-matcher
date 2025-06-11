import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '@/components/header.js';
import Link from 'next/link';
import withAuth from '@/components/withAuth';

function StudentProfile({ user }) {
  const router = useRouter();
  const { email } = router.query;
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/student-results?email=${email}`);
      const data = await res.json();

      const stored = JSON.parse(localStorage.getItem('striveStudents')) || [];
      const profile = stored.find(s => s.email === email) || {};

      setStudentData({ ...profile, results: data.results });
    };
    if (email) fetchData();
  }, [email]);

  const calculateCAOPoints = (avg, level) => {
    if (level === 'OL') {
      if (avg >= 90) return 56;
      if (avg >= 80) return 46;
      if (avg >= 70) return 37;
      if (avg >= 60) return 28;
      if (avg >= 50) return 20;
      if (avg >= 40) return 12;
      if (avg >= 30) return 0;
    } else {
      if (avg >= 90) return 100;
      if (avg >= 80) return 88;
      if (avg >= 70) return 77;
      if (avg >= 60) return 66;
      if (avg >= 50) return 56;
      if (avg >= 40) return 46;
      if (avg >= 30) return 37;
      if (avg >= 20) return 0;
    }
    return 0;
  };

  if (!studentData) return <div className="p-4">Loading...</div>;

  const subjectGroups = {};
  studentData.results.forEach(result => {
    if (!subjectGroups[result.subject]) subjectGroups[result.subject] = [];
    subjectGroups[result.subject].push(result);
  });

  const subjectAverages = Object.entries(subjectGroups).map(([subject, results]) => {
    const avg = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    const level = results[0].level;
    const cao = calculateCAOPoints(avg, level);
    return { subject, avg, level, cao, results };
  });

  const top6 = [...subjectAverages]
    .sort((a, b) => b.cao - a.cao)
    .slice(0, 6);

  const totalCAO = top6.reduce((sum, s) => sum + s.cao, 0);
  const overallAvg = subjectAverages.reduce((sum, s) => sum + s.avg, 0) / subjectAverages.length;

  return (
    <div className="bg-white min-h-screen text-black">
      <Header user={user} />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-orange-500">{studentData.name}'s Profile</h1>
        <p className="text-sm text-gray-600">{studentData.email} | {studentData.yearGroup}</p>
        {studentData.dateOfBirth && (
          <p className="text-sm text-gray-600">Date of Birth: {studentData.dateOfBirth}</p>
        )}
        {studentData.parentContact && (
          <p className="text-sm text-gray-600">Parent Contact: {studentData.parentContact}</p>
        )}
        {studentData.address && (
          <p className="text-sm text-gray-600">Address: {studentData.address}</p>
        )}
        {studentData.registered && (
          <p className="text-sm text-green-600 font-semibold">✅ Registered</p>
        )}
        {studentData.notes && (
          <p className="text-sm text-gray-700 mt-1 italic">📝 {studentData.notes}</p>
        )}

        <div className="mt-4">
          <p><strong>Overall Average:</strong> {overallAvg.toFixed(1)}%</p>
          <p><strong>Total CAO Points (Top 6):</strong> {totalCAO}</p>
        </div>

        <div className="mt-6">
          {subjectAverages.map(subj => (
            <div key={subj.subject} className="border-b border-gray-300 pb-4 mb-4">
              <h2 className="text-xl font-semibold text-orange-500">{subj.subject}</h2>
              <p>Average: {subj.avg.toFixed(1)}% | Level: {subj.level} | CAO Points: {subj.cao}</p>
              <ul className="mt-2 list-disc ml-6">
                {subj.results.map((r, i) => (
                  <li key={i} className="mb-1">
                    <span>{r.topic} - {r.score}% ({r.date})</span>
                    {['teacher', 'principal'].includes(user.role) && (
                      <span className="ml-4">
                        <button className="text-blue-600 mr-2" onClick={() => console.log('Edit', r)}>Edit</button>
                        <button className="text-red-600" onClick={() => console.log('Delete', r)}>Delete</button>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-orange-500">Top 6 Subjects</h2>
          <ul className="list-disc ml-6 mt-2">
            {top6.map((s, i) => (
              <li key={i}>{s.subject}: {s.cao} CAO Points</li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <Link href="/teacher-dashboard" className="text-blue-600">← Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}

export default withAuth(StudentProfile, ['teacher', 'principal']);

