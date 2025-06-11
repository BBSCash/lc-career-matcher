import { useEffect, useState } from 'react';
import Header from '@/components/header';
import withAuth from '@/components/withAuth';
import { v4 as uuidv4 } from 'uuid';

const YEAR_GROUPS = ['1st Year', '2nd Year', '3rd Year', 'Transition Year', '5th Year', '6th Year'];

function PrincipalStudents({ user }) {
  const [students, setStudents] = useState([]);
  const [activeYear, setActiveYear] = useState('6th Year');
  const [viewingStudentEmail, setViewingStudentEmail] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    yearGroup: '',
    dateOfBirth: '',
    parentContact: '',
    address: '',
    registered: false,
    notes: '',
  });

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('striveStudents')) || [];
    setStudents(stored);
  }, []);

  const saveStudents = (updated) => {
    setStudents(updated);
    localStorage.setItem('striveStudents', JSON.stringify(updated));
  };

  const handleEdit = (email, field, value) => {
    const updated = students.map(s => s.email === email ? { ...s, [field]: value } : s);
    saveStudents(updated);
  };

  const handleDelete = (email) => {
    const updated = students.filter(s => s.email !== email);
    saveStudents(updated);
  };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.email || !newStudent.yearGroup) {
      alert('Please fill in all required fields (Name, Email, Year Group).');
      return;
    }
    if (students.some(s => s.email === newStudent.email)) {
      alert('A student with this email already exists.');
      return;
    }
    const student = { id: uuidv4(), ...newStudent };
    const updated = [...students, student];
    saveStudents(updated);
    setNewStudent({
      name: '',
      email: '',
      yearGroup: '',
      dateOfBirth: '',
      parentContact: '',
      address: '',
      registered: false,
      notes: '',
    });
  };

  const filteredStudents = students
    .filter(s => s.yearGroup === activeYear)
    .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const viewingStudent = students.find(s => s.email === viewingStudentEmail);

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
            placeholder="Name *"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            placeholder="Email *"
            type="email"
            value={newStudent.email}
            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />
          <select
            value={newStudent.yearGroup}
            onChange={(e) => setNewStudent({ ...newStudent, yearGroup: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          >
            <option value="">Select Year Group *</option>
            {YEAR_GROUPS.map(yr => <option key={yr} value={yr}>{yr}</option>)}
          </select>

          <input
            placeholder="Date of Birth (YYYY-MM-DD)"
            type="date"
            value={newStudent.dateOfBirth}
            onChange={(e) => setNewStudent({ ...newStudent, dateOfBirth: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            placeholder="Parent/Guardian Contact"
            value={newStudent.parentContact}
            onChange={(e) => setNewStudent({ ...newStudent, parentContact: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            placeholder="Address"
            value={newStudent.address}
            onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />

          <label className="inline-flex items-center mb-2">
            <input
              type="checkbox"
              checked={newStudent.registered}
              onChange={(e) => setNewStudent({ ...newStudent, registered: e.target.checked })}
              className="mr-2"
            />
            Registered
          </label>

          <textarea
            placeholder="Notes"
            value={newStudent.notes}
            onChange={(e) => setNewStudent({ ...newStudent, notes: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
            rows={3}
          />

          <button onClick={handleAddStudent} className="bg-orange-500 text-white px-4 py-2 rounded w-full font-semibold">
            Add Student
          </button>
        </div>

        {filteredStudents.length === 0 ? (
          <p className="text-gray-600">No students found for {activeYear}.</p>
        ) : (
          <div className="space-y-6">
            {filteredStudents.map((student) => (
              <div key={student.email} className="bg-gray-100 p-4 rounded shadow">
                <p><strong>Name:</strong> 
                  <input
                    type="text"
                    className="border rounded px-2 py-1 text-sm"
                    value={student.name}
                    onChange={(e) => handleEdit(student.email, 'name', e.target.value)}
                  />
                </p>
                <p className="mt-1 text-sm"><strong>Email:</strong> {student.email}</p>
                <p className="mt-1"><strong>Year Group:</strong>
                  <select
                    value={student.yearGroup || ''}
                    onChange={(e) => handleEdit(student.email, 'yearGroup', e.target.value)}
                    className="ml-2 border rounded px-2 py-1 text-sm"
                  >
                    <option value="">Select Year</option>
                    {YEAR_GROUPS.map(yr => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </p>

                {/* Additional fields editable inline */}
                <p className="mt-1"><strong>Date of Birth:</strong>
                  <input
                    type="date"
                    value={student.dateOfBirth || ''}
                    onChange={(e) => handleEdit(student.email, 'dateOfBirth', e.target.value)}
                    className="ml-2 border rounded px-2 py-1 text-sm"
                  />
                </p>
                <p className="mt-1"><strong>Parent Contact:</strong>
                  <input
                    type="text"
                    value={student.parentContact || ''}
                    onChange={(e) => handleEdit(student.email, 'parentContact', e.target.value)}
                    className="ml-2 border rounded px-2 py-1 text-sm"
                  />
                </p>
                <p className="mt-1"><strong>Address:</strong>
                  <input
                    type="text"
                    value={student.address || ''}
                    onChange={(e) => handleEdit(student.email, 'address', e.target.value)}
                    className="ml-2 border rounded px-2 py-1 text-sm"
                  />
                </p>
                <p className="mt-1"><strong>Registered:</strong>
                  <input
                    type="checkbox"
                    checked={student.registered || false}
                    onChange={(e) => handleEdit(student.email, 'registered', e.target.checked)}
                    className="ml-2"
                  />
                </p>
                <p className="mt-1"><strong>Notes:</strong>
                  <textarea
                    value={student.notes || ''}
                    onChange={(e) => handleEdit(student.email, 'notes', e.target.value)}
                    className="ml-2 border rounded px-2 py-1 text-sm w-full"
                    rows={2}
                  />
                </p>

                <div className="mt-3 flex gap-3">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                    onClick={() => handleDelete(student.email)}
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
            {/* You can expand this if you want a popup profile too */}
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
