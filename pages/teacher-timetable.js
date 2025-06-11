import { useState, useEffect } from 'react';
import Header from '@/components/header.js';
import withAuth from '@/components/withAuth';

function TeacherTimetable({ user }) {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [notes, setNotes] = useState({});

  useEffect(() => {
    const storedClasses = JSON.parse(localStorage.getItem('striveClassGroups')) || [];
    const teacherClasses = storedClasses.filter(c => c.teacherId === user.email);
    setClasses(teacherClasses);

    const allStudents = JSON.parse(localStorage.getItem('striveStudents')) || [];
    setStudents(allStudents);

    const savedResults = JSON.parse(localStorage.getItem('striveResults')) || [];
    setResults(savedResults);

    const savedNotes = JSON.parse(localStorage.getItem('striveNotes')) || {};
    setNotes(savedNotes);
  }, [user.email]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  const getClassAtSlot = (day, time) => {
    return classes.find(c => c.day === day && c.time === time);
  };

  const toggleAttendance = (studentId) => {
    const updated = [...classes];
    const classIndex = classes.findIndex(c => c.name === selectedClass.name && c.day === selectedClass.day && c.time === selectedClass.time);
    if (!updated[classIndex].attendance) updated[classIndex].attendance = {};
    updated[classIndex].attendance[studentId] = !updated[classIndex].attendance[studentId];
    setClasses(updated);
    setSelectedClass(updated[classIndex]);
    localStorage.setItem('striveClassGroups', JSON.stringify(updated));
  };

  const saveNote = (studentId, content) => {
    const updated = { ...notes, [studentId]: content };
    setNotes(updated);
    localStorage.setItem('striveNotes', JSON.stringify(updated));
  };

  const getAttendanceStats = (studentId) => {
    const allAttendance = classes.flatMap(c => Object.entries(c.attendance || {}).filter(([id]) => id === studentId));
    const total = allAttendance.length;
    const present = allAttendance.filter(([_, val]) => val).length;
    return total > 0 ? `${present}/${total} (${Math.round((present / total) * 100)}%)` : 'No data';
  };

  const getStudentResults = (studentId) => {
    return results.filter(r => r.studentId === studentId);
  };

  return (
    <div className="bg-white min-h-screen p-6 text-black">
      <Header user={user} />
      <h1 className="text-3xl font-bold text-orange-500 mb-6">📅 My Timetable</h1>

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

      {selectedClass && (
        <div className="bg-orange-50 p-4 rounded shadow">
          <h2 className="text-xl font-semibold text-orange-600 mb-4">
            🧑‍🏫 {selectedClass.name} - {selectedClass.day} at {selectedClass.time}
          </h2>
          <ul className="space-y-2">
            {selectedClass.studentIds.map(id => {
              const stu = students.find(s => s.id === id);
              if (!stu) return null;
              const isPresent = selectedClass.attendance?.[id];
              return (
                <li key={id} className="flex justify-between items-center bg-white px-4 py-2 border rounded">
                  <button
                    onClick={() => setSelectedStudent(stu)}
                    className="text-blue-600 hover:underline"
                  >
                    {stu.name}
                  </button>
                  <button
                    onClick={() => toggleAttendance(id)}
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

      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold text-orange-600 mb-4">👤 {selectedStudent.name}'s Profile</h3>
            <p><strong>Email:</strong> {selectedStudent.email}</p>
            <p><strong>Year Group:</strong> {selectedStudent.yearGroup}</p>
            <p><strong>ID:</strong> {selectedStudent.id}</p>
            <p><strong>Attendance:</strong> {getAttendanceStats(selectedStudent.id)}</p>

            <h4 className="mt-4 font-semibold text-orange-500">🧪 Test Results</h4>
            <ul className="list-disc ml-5">
              {getStudentResults(selectedStudent.id).map((r, i) => (
                <li key={i} className="text-sm">{r.subject} - {r.score}/{r.total} ({r.level})</li>
              ))}
            </ul>

            <h4 className="mt-4 font-semibold text-orange-500">📝 Teacher Notes</h4>
            <textarea
              className="w-full p-2 border rounded mt-1 text-sm"
              rows="3"
              value={notes[selectedStudent.id] || ''}
              onChange={(e) => saveNote(selectedStudent.id, e.target.value)}
            />

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
