import { useEffect, useState } from 'react';
import withAuth from '@/components/withAuth';
import Header from '@/components/header.js';

function AttendanceReport({ user }) {
  const [classGroups, setClassGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');

  useEffect(() => {
    const cls = JSON.parse(localStorage.getItem('striveClassGroups')) || [];
    const stu = JSON.parse(localStorage.getItem('striveStudents')) || [];
    const rec = JSON.parse(localStorage.getItem('striveAttendanceRecords')) || [];

    setClassGroups(cls);
    setStudents(stu);
    setRecords(rec);
  }, []);

  const getClassStudents = () => {
    const group = classGroups.find((g) => g.name === selectedClass);
    return group ? students.filter((s) => group.studentIds.includes(s.id)) : [];
  };

  const getStudentRecords = (id) =>
    records.filter((r) => r.studentId === id && r.className === selectedClass);

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">📊 Attendance Report</h1>

        <select
          className="w-full p-2 border rounded text-black mb-6"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class</option>
          {classGroups.map((cls, idx) => (
            <option key={idx} value={cls.name}>{cls.name}</option>
          ))}
        </select>

        {selectedClass && (
          <div className="space-y-6">
            {getClassStudents().map((student) => {
              const studentRecs = getStudentRecords(student.id);
              return (
                <div key={student.id} className="bg-gray-100 p-4 rounded shadow">
                  <h2 className="text-lg font-semibold mb-2">{student.name}</h2>
                  {studentRecs.length === 0 ? (
                    <p className="text-gray-500">No attendance records yet.</p>
                  ) : (
                    <table className="w-full text-left bg-white rounded text-sm">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="p-2 border">Date</th>
                          <th className="p-2 border">Subject</th>
                          <th className="p-2 border">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentRecs.map((rec, i) => (
                          <tr key={i}>
                            <td className="p-2 border">{rec.date}</td>
                            <td className="p-2 border">{rec.subject}</td>
                            <td className={`p-2 border font-semibold ${rec.status === 'present' ? 'text-green-600' : 'text-red-600'}`}>
                              {rec.status === 'present' ? '✅ Present' : '❌ Absent'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(AttendanceReport, ['principal']);
