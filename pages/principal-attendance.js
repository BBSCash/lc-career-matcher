import { useEffect, useState } from 'react';
import withAuth from '@/components/withAuth';
import Header from '@/components/header';

function PrincipalAttendance({ user }) {
  const [viewMode, setViewMode] = useState('student');
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    setClasses(JSON.parse(localStorage.getItem('striveClassGroups')) || []);
    setStudents(JSON.parse(localStorage.getItem('striveStudents')) || []);
    setAttendance(JSON.parse(localStorage.getItem('striveAttendance')) || []);
  }, []);

  const calculateSummary = () => {
    if (!selectedId) return setSummary([]);
    if (viewMode === 'student') {
      const logs = attendance.filter(a => a.studentId == selectedId);
      setSummary(logs);
    } else {
      const className = selectedId;
      const logs = attendance.filter(a => a.className === className);
      setSummary(logs);
    }
  };

  useEffect(() => {
    calculateSummary();
  }, [selectedId, viewMode]);

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">📊 Principal Attendance Reports</h1>

        <div className="mb-6">
          <label className="font-medium mr-4">View by:</label>
          <select value={viewMode} onChange={(e) => setViewMode(e.target.value)} className="p-2 border rounded">
            <option value="student">Student</option>
            <option value="class">Class</option>
          </select>
        </div>

        {viewMode === 'student' ? (
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="p-2 border rounded mb-4">
            <option value=''>Select Student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        ) : (
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="p-2 border rounded mb-4">
            <option value=''>Select Class</option>
            {classes.map((c, i) => (
              <option key={i} value={c.name}>{c.name}</option>
            ))}
          </select>
        )}

        <h2 className="text-xl font-semibold mb-2">Attendance Records</h2>
        {summary.length === 0 ? (
          <p>No attendance data found.</p>
        ) : (
          <ul className="space-y-2">
            {summary.map((entry, i) => {
              const student = students.find(s => s.id === entry.studentId);
              return (
                <li key={i} className="bg-orange-100 p-3 rounded">
                  <strong>Date:</strong> {entry.date} — <strong>Student:</strong> {student?.name || 'Unknown'} — <strong>Status:</strong> {entry.status}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default withAuth(PrincipalAttendance, ['principal']);
