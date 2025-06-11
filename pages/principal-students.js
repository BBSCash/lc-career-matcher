import { useEffect, useState } from 'react';
import Header from '@/components/header';
import withAuth from '@/components/withAuth';
import { v4 as uuidv4 } from 'uuid';

const YEAR_GROUPS = ['1st Year', '2nd Year', '3rd Year', 'Transition Year', '5th Year', '6th Year'];

function PrincipalStudents({ user }) {
  const [students, setStudents] = useState([]);
  const [activeYear, setActiveYear] = useState('6th Year');
  const [viewingStudentId, setViewingStudentId] = useState(null);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', yearGroup: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('striveStudents')) || [];
    setStudents(stored);
  }, []);

  const saveStudents = (updated) => {
    setStudents(updated);
    localStorage.setItem('striveStudents', JSON.stringify(updated));
  };

  const handleEdit = (id, field, value) => {
    const updated = students.map(s => s.id === id ? { ...s, [field]: value } : s);
    saveStudents(updated);
  };

  const handleDelete = (id) => {
    const updated = students.filter(s => s.id !== id);
    saveStudents(updated);
  };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.email || !newStudent.yearGroup) {
      alert('Please fill in all fields.');
      return;
    }
    const student = { id: uuidv4(), registered: false, caoResults: [], attendance: [], ...newStudent };
    const updated = [...students, student];
    saveStudents(updated);
    setNewStudent({ name: '', email: '', yearGroup: '' });
  };

  const filteredStudents = students
    .filter(s => s.yearGroup === activeYear)
    .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const viewingStudent = students.find(s => s.id === viewingStudentId);

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">👩‍🎓 Manage Students</h1>

        <div className="mb-4 flex flex-wrap gap-2">
          {YEAR_GROUPS.map(yr => (
            <button
              key={yr}
              className={`px-4 py-2 rounded ${activeYear === yr ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveYear(yr)}
            >
              {yr}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="🔍 Search students by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-6 p-2 border rounded"
        />

        <div className="bg-orange-100 p-4 rounded shadow mb-8">
          <h2 className="text-xl font-semibold text-orange-600 mb-2">➕ Add New Student</h2>
          <input
            placeholder="Name"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            placeholder="Email"
            value={newStudent.email}
            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />
          <select
            value={newStudent.yearGroup}
            onChange={(e) => setNewStudent({ ...newStudent, yearGroup: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          >
            <option value="">Select Year Group</option>
            {YEAR_GROUPS.map(yr => <option key={yr} value={yr}>{yr}</option>)}
          </select>
          <button onClick={handleAddStudent} className="bg-orange-500 text-white px-4 py-2 rounded w-full font-semibold">
            Add Student
          </button>
        </div>

        {filteredStudents.length === 0 ? (
          <p className="text-gray-600">No students found for {activeYear}.</p>
        ) : (
          <div className="space-y-6">
            {filteredStudents.map((student) => (
              <div key={student.id} className="bg-gray-100 p-4 rounded shadow">
                <p><strong>Name:</strong> <input
                  type="text"
                  className="border rounded px-2 py-1 text-sm"
                  value={student.name}
                  onChange={(e) => handleEdit(student.id, 'name', e.target.value)}
                /></p>
                <p className="mt-1 text-sm"><strong>Email:</strong> {student.email}</p>
                <p className="mt-1"><strong>Year Group:</strong>
                  <select
                    value={student.yearGroup || ''}
                    onChange={(e) => handleEdit(student.id, 'yearGroup', e.target.value)}
                    className="ml-2 border rounded px-2 py-1 text-sm"
                  >
                    <option value="">Select Year</option>
                    {YEAR_GROUPS.map(yr => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </p>
                <div className="mt-3 flex gap-3">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                    onClick={() => {
                      setViewingStudentId(student.id);
                      setShowProfile(true);
                    }}
                  >
                    View Profile
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                    onClick={() => handleDelete(student.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showProfile && viewingStudent && (
          <div className="mt-10 bg-blue-50 p-6 rounded shadow">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">📋 {viewingStudent.name}'s Profile</h2>
            <p><strong>Email:</strong> {viewingStudent.email}</p>
            <p><strong>Year Group:</strong> {viewingStudent.yearGroup}</p>
            <p><strong>Registered:</strong> {viewingStudent.registered ? 'Yes' : 'No'}</p>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">📊 CAO Results</h3>
              {viewingStudent.caoResults?.length > 0 ? (
                <ul className="list-disc ml-6">
                  {viewingStudent.caoResults.map((res, i) => (
                    <li key={i}>{res.subject}: {res.score}</li>
                  ))}
                </ul>
              ) : <p className="text-sm text-gray-600">No results available.</p>}
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">📅 Attendance Record</h3>
              {viewingStudent.attendance?.length > 0 ? (
                <ul className="list-disc ml-6">
                  {viewingStudent.attendance.map((a, i) => (
                    <li key={i}>{a.date} - {a.status}</li>
                  ))}
                </ul>
              ) : <p className="text-sm text-gray-600">No attendance recorded.</p>}
            </div>

            <button
              className="mt-4 bg-gray-500 text-white px-3 py-1 rounded"
              onClick={() => setShowProfile(false)}
            >
              Close Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(PrincipalStudents, ['principal']);
