import { useState, useEffect } from 'react';
import Header from '@/components/header.js';
import withAuth from '@/components/withAuth';

function TeacherTimetable({ user }) {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
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

  // Editing Results

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

  // Attendance toggle with count

  const toggleAttendance = (studentId) => {
    const updated = [...classes];
    const classIndex = classes.findIndex(c => c.name === selectedClass.name && c.day === selectedClass.day && c.time === selectedClass.time);
    if (classIndex === -1) return;

    if (!updated[classIndex].attendance) updated[classIndex].attendance = {};

    const currentStatus = updated[classIndex].attendance[studentId];
    updated[classIndex].attendance[studentId] = currentStatus === true ? false : true;

    setClasses(updated);
    setSelectedClass(updated[classIndex]);
    localStorage.setItem('striveClassGroups', JSON.stringify(updated));
  };

  const countAttendance = () => {
    if (!selectedClass || !selectedClass.attendance) return { present: 0, absent: 0 };

    let present = 0;
    let absent = 0;

    selectedClass.studentIds.forEach(id => {
      if (selectedClass.attendance[id]) present++;
      else absent++;
    });

    return { present, absent };
  };

  const { present, absent } = countAttendance();

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

              const isPresent = selectedClass.attendance?.[stu.id] ?? false;

              return (
                <li key={stu.email} className="flex justify-between items-center bg-white px-4 py-2 border rounded">
                  <button
                    onClick={() => setSelectedStudent(stu)}
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

      {/* Selected Student Profile & Results */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-orange-600 mb-4">👤 {selectedStudent.name}'s Profile</h3>
            <p><strong>Email:</strong> {selectedStudent.email}</p>
            <p><strong>Year Group:</strong> {selectedStudent.yearGroup}</p>

            <h4 className="mt-4 font-semibold text-orange-500">🧪 Test Results</h4>
            <ul className="list-disc ml-5">
              {results
                .map((r, i) => ({ ...r, index: i }))
                .filter(r => r.studentEmail === selectedStudent.email)
                .map(r => (
                  <li key={r.index} className="flex justify-between items-center text-sm mb-1">
                    <span>{r.subject} ({r.level}) - {r.topic ? `${r.topic} - ` : ''}{r.score}/{r.total}</span>
                    <span>
                      <button onClick={() => startEditResult(r.index)} className="text-blue-600 text-xs mr-2">✏️</button>
                      <button onClick={() => deleteResult(r.index)} className="text-red-600 text-xs">🗑️</button>
                    </span>
                  </li>
                ))}
            </ul>

            {/* Edit Result Panel */}
            {editingResultIndex !== null && (
              <div className="mt-4 bg-gray-100 p-3 rounded">
                <h5 className="text-sm font-semibold mb-2">Edit Result</h5>
                <input
                  placeholder="Subject"
                  className="w-full p-1 mb-2 border rounded text-sm"
                  value={editResult.subject}
                  onChange={(e) => setEditResult({ ...editResult, subject: e.target.value })}
                />
                <input
                  placeholder="Topic"
                  className="w-full p-1 mb-2 border rounded text-sm"
                  value={editResult.topic}
                  onChange={(e) => setEditResult({ ...editResult, topic: e.target.value })}
                />
                <input
                  placeholder="Score"
                  className="w-full p-1 mb-2 border rounded text-sm"
                  value={editResult.score}
                  onChange={(e) => setEditResult({ ...editResult, score: e.target.value })}
                />
                <input
                  placeholder="Total"
                  className="w-full p-1 mb-2 border rounded text-sm"
                  value={editResult.total}
                  onChange={(e) => setEditResult({ ...editResult, total: e.target.value })}
                />
                <select
                  className="w-full p-1 mb-2 border rounded text-sm"
                  value={editResult.level}
                  onChange={(e) => setEditResult({ ...editResult, level: e.target.value })}
                >
                  <option value="">Select Level</option>
                  <option value="H">Higher</option>
                  <option value="O">Ordinary</option>
                </select>
                <button
                  onClick={saveEditResult}
                  className="bg-orange-500 text-white px-3 py-1 rounded text-sm w-full"
                >
                  💾 Save Result
                </button>
              </div>
            )}

            <button
              onClick={() => setSelectedStudent(null)}
              className="mt-4 text-orange-600 underline text-sm"
            >
              ✖ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(TeacherTimetable, ['teacher']);

