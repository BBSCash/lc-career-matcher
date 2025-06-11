import { useState, useEffect } from 'react';
import Header from '@/components/header.js';
import withAuth from '@/components/withAuth';
import { useRouter } from 'next/router';

function TeacherTimetable({ user }) {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [results, setResults] = useState([]);
  const [editingResultIndex, setEditingResultIndex] = useState(null);
  const [editResult, setEditResult] = useState({ subject: '', topic: '', score: '', total: 100, level: '' });

  useEffect(() => {
    const allClasses = JSON.parse(localStorage.getItem('striveClassGroups')) || [];
    const teacherClasses = allClasses.filter(c => c.teacherId === user.email);
    setClasses(teacherClasses);

    const allStudents = JSON.parse(localStorage.getItem('striveStudents')) || [];
    setStudents(allStudents);

    const savedResults = JSON.parse(localStorage.getItem('striveResults')) || [];
    setResults(savedResults);
  }, [user.email]);

  // Helpers
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  const getClassAtSlot = (day, time) => classes.find(c => c.day === day && c.time === time);

  // Edit results handlers
  const startEditResult = (index) => {
    setEditingResultIndex(index);
    setEditResult(results[index]);
  };

  const saveEditResult = () => {
    const updatedResults = [...results];
    updatedResults[editingResultIndex] = editResult;
    setResults(updatedResults);
    localStorage.setItem('striveResults', JSON.stringify(updatedResults));
    setEditingResultIndex(null);
    setEditResult({ subject: '', topic: '', score: '', total: 100, level: '' });
  };

  const deleteResult = (index) => {
    const updatedResults = [...results];
    updatedResults.splice(index, 1);
    setResults(updatedResults);
    localStorage.setItem('striveResults', JSON.stringify(updatedResults));
  };

  // Attendance toggle
  const toggleAttendance = (studentId) => {
    const updated = [...classes];
    const classIndex = classes.findIndex(c => c.name === selectedClass.name && c.day === selectedClass.day && c.time === selectedClass.time);
    if (!updated[classIndex].attendance) updated[classIndex].attendance = {};
    updated[classIndex].attendance[studentId] = !updated[classIndex].attendance[studentId];
    setClasses(updated);
    setSelectedClass(updated[classIndex]);
    localStorage.setItem('striveClassGroups', JSON.stringify(updated));
  };

  // Navigate to student profile page
  const goToStudentProfile = (studentEmail) => {
    router.push(`/student-profile/${encodeURIComponent(studentEmail)}`);
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

      {/* Selected Class Students */}
      {selectedClass && (
        <div className="bg-orange-50 p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold text-orange-600 mb-4">
            🧑‍🏫 {selectedClass.name} - {selectedClass.day} at {selectedClass.time}
          </h2>
          <ul className="space-y-2 max-h-80 overflow-y-auto">
            {selectedClass.studentIds.map(emailOrId => {
              const stu = students.find(s => s.email === emailOrId || s.id === emailOrId);
              if (!stu) return null;
              const isPresent = selectedClass.attendance?.[stu.id];
              return (
                <li key={stu.email} className="flex justify-between items-center bg-white px-4 py-2 border rounded">
                  <button
                    onClick={() => goToStudentProfile(stu.email)}
                    className="text-blue-600 hover:underline"
                  >
                    {stu.name}
                  </button>
                  <button
                    onClick={() => toggleAttendance(stu.id)}
                    className={`px-3 py-1 rounded font-semibold text-sm ${isPresent ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                  >
                    {isPresent ? 'Present' : 'Absent'}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Edit Result Panel */}
      {editingResultIndex !== null && (
        <div className="bg-gray-100 p-6 rounded shadow max-w-md mx-auto">
          <h5 className="text-lg font-semibold mb-4 text-center">Edit Result</h5>
          <input
            placeholder="Subject"
            className="w-full p-2 mb-4 border rounded text-sm"
            value={editResult.subject}
            onChange={(e) => setEditResult({ ...editResult, subject: e.target.value })}
          />
          <input
            placeholder="Topic"
            className="w-full p-2 mb-4 border rounded text-sm"
            value={editResult.topic}
            onChange={(e) => setEditResult({ ...editResult, topic: e.target.value })}
          />
          <input
            placeholder="Score"
            type="number"
            className="w-full p-2 mb-4 border rounded text-sm"
            value={editResult.score}
            onChange={(e) => setEditResult({ ...editResult, score: e.target.value })}
          />
          <input
            placeholder="Total"
            type="number"
            className="w-full p-2 mb-4 border rounded text-sm"
            value={editResult.total}
            onChange={(e) => setEditResult({ ...editResult, total: e.target.value })}
          />
          <select
            className="w-full p-2 mb-4 border rounded text-sm"
            value={editResult.level}
            onChange={(e) => setEditResult({ ...editResult, level: e.target.value })}
          >
            <option value="">Select Level</option>
            <option value="H">Higher</option>
            <option value="O">Ordinary</option>
          </select>
          <div className="flex justify-between">
            <button
              onClick={() => {
                setEditingResultIndex(null);
                setEditResult({ subject: '', topic: '', score: '', total: 100, level: '' });
              }}
              className="bg-gray-300 px-4 py-2 rounded text-sm"
            >
              Cancel
            </button>
            <button
              onClick={saveEditResult}
              className="bg-orange-500 text-white px-4 py-2 rounded text-sm"
            >
              Save Result
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(TeacherTimetable, ['teacher']);

