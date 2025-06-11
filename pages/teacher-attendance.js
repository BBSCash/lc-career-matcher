import { useEffect, useState } from 'react';
import withAuth from '@/components/withAuth';
import Header from '@/components/header.js';

function TeacherAttendance({ user }) {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const allClasses = JSON.parse(localStorage.getItem('striveClassGroups')) || [];
    const teacherClasses = allClasses.filter(c => c.teacherId === user.id);
    setClasses(teacherClasses);

    const allStudents = JSON.parse(localStorage.getItem('striveStudents')) || [];
    setStudents(allStudents);
  }, [user.id]);

  const handleMark = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    const records = Object.entries(attendance).map(([studentId, status]) => ({
      date,
      className: selectedClass,
      studentId: parseInt(studentId),
      status
    }));

    const existing = JSON.parse(localStorage.getItem('striveAttendance')) || [];
    localStorage.setItem('striveAttendance', JSON.stringify([...existing, ...records]));
    alert('✅ Attendance saved!');
    setAttendance({});
  };

  const currentClass = classes.find(c => c.name === selectedClass);
  const studentList = currentClass ? currentClass.studentIds.map(id => students.find(s => s.id === id)) : [];

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">📅 Mark Attendance</h1>

        <label className="block mb-2 font-medium">Select Class:</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full p-2 mb-4 rounded border"
        >
          <option value="">-- Select --</option>
          {classes.map((c, i) => (
            <option key={i} value={c.name}>{c.name}</option>
          ))}
        </select>

        <label className="block mb-2 font-medium">Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 mb-6 rounded border"
        />

        {studentList.length > 0 && (
          <div className="space-y-4">
            {studentList.map(student => (
              <div key={student.id} className="flex items-center justify-between p-3 border rounded">
                <span>{student.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleMark(student.id, 'present')}
                    className={`px-3 py-1 rounded ${attendance[student.id] === 'present' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                  >Present</button>
                  <button
                    onClick={() => handleMark(student.id, 'absent')}
                    className={`px-3 py-1 rounded ${attendance[student.id] === 'absent' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                  >Absent</button>
                </div>
              </div>
            ))}
            <button
              onClick={handleSave}
              className="mt-6 w-full bg-orange-500 text-white py-2 rounded font-semibold"
            >
              💾 Save Attendance
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(TeacherAttendance, ['teacher']);
