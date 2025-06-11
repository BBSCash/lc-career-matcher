import { useEffect, useState } from 'react';
import Header from '@/components/header';
import withAuth from '@/components/withAuth';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function PrincipalAnalytics({ user }) {
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem('striveStudents')) || [];
    const storedResults = JSON.parse(localStorage.getItem('striveResults')) || [];
    const storedAttendance = JSON.parse(localStorage.getItem('striveAttendance')) || [];

    setStudents(storedStudents);
    setResults(storedResults);
    setAttendance(storedAttendance);
  }, []);

  const subjectStats = {};
  results.forEach(r => {
    if (!subjectStats[r.subject]) subjectStats[r.subject] = [];
    subjectStats[r.subject].push(r.score);
  });

  const subjectAverages = Object.entries(subjectStats).map(([subject, scores]) => {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return { subject, avg: avg.toFixed(1) };
  });

  const calculateCAO = (avg, level) => {
    if (level === 'OL') {
      if (avg >= 90) return 56;
      if (avg >= 80) return 46;
      if (avg >= 70) return 37;
      if (avg >= 60) return 28;
      if (avg >= 50) return 20;
      if (avg >= 40) return 12;
      return 0;
    } else {
      if (avg >= 90) return 100;
      if (avg >= 80) return 88;
      if (avg >= 70) return 77;
      if (avg >= 60) return 66;
      if (avg >= 50) return 56;
      if (avg >= 40) return 46;
      if (avg >= 30) return 37;
      return 0;
    }
  };

  const studentPoints = students.map(s => {
    const studentResults = results.filter(r => r.studentEmail === s.email);
    const subjectGroups = {};
    studentResults.forEach(r => {
      if (!subjectGroups[r.subject]) subjectGroups[r.subject] = [];
      subjectGroups[r.subject].push(r);
    });

    const caoTotals = Object.entries(subjectGroups).map(([subject, res]) => {
      const avg = res.reduce((a, b) => a + b.score, 0) / res.length;
      const level = res[0].level;
      return calculateCAO(avg, level);
    });

    const top6 = caoTotals.sort((a, b) => b - a).slice(0, 6);
    const totalPoints = top6.reduce((a, b) => a + b, 0);
    return { email: s.email, yearGroup: s.yearGroup, points: totalPoints };
  });

  const groupByYear = {};
  studentPoints.forEach(s => {
    if (!groupByYear[s.yearGroup]) groupByYear[s.yearGroup] = [];
    groupByYear[s.yearGroup].push(s.points);
  });

  const attendanceSummary = {};
  attendance.forEach(r => {
    if (!attendanceSummary[r.className]) attendanceSummary[r.className] = { total: 0, present: 0 };
    attendanceSummary[r.className].total++;
    if (r.status) attendanceSummary[r.className].present++;
  });

  return (
    <div className="bg-white min-h-screen p-6 text-black">
      <Header user={user} />
      <h1 className="text-3xl font-bold text-orange-500 mb-6">📊 Principal Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Overview */}
        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-orange-600">Student Overview</h2>
          <p>Total Students: {students.length}</p>
          <p>Registered: {students.filter(s => s.registered).length}</p>
          <p>Not Registered: {students.filter(s => !s.registered).length}</p>
          <div className="mt-3">
            <h3 className="font-semibold mb-1">By Year Group:</h3>
            <ul className="list-disc ml-6">
              {[...new Set(students.map(s => s.yearGroup))].map(yr => (
                <li key={yr}>{yr}: {students.filter(s => s.yearGroup === yr).length}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Subject Averages */}
        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-orange-600">Subject Averages</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={subjectAverages} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="subject" type="category" />
              <Tooltip />
              <Bar dataKey="avg" fill="#FFA500" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* CAO Points Overview */}
        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-orange-600">CAO Points Overview</h2>
          <ul className="list-disc ml-6">
            {Object.entries(groupByYear).map(([year, points]) => {
              const avg = points.reduce((a, b) => a + b, 0) / points.length;
              const above200 = points.filter(p => p >= 200).length;
              const above300 = points.filter(p => p >= 300).length;
              const above400 = points.filter(p => p >= 400).length;
              const above500 = points.filter(p => p >= 500).length;
              return (
                <li key={year}>
                  <strong>{year}</strong>: Avg = {avg.toFixed(1)} pts | ≥200: {above200}, ≥300: {above300}, ≥400: {above400}, ≥500: {above500}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Attendance Summary */}
        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-orange-600">Attendance Insights</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={Object.entries(attendanceSummary).map(([className, stats]) => ({
                className,
                attendance: ((stats.present / stats.total) * 100).toFixed(1),
              }))}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="className" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="attendance" fill="#FFA500" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default withAuth(PrincipalAnalytics, ['principal']);
