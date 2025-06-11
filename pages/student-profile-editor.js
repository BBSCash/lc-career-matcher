import { useEffect, useState } from 'react';
import withAuth from '@/components/withAuth';
import Header from '@/components/header.js';

function StudentProfileEditor({ user }) {
  const [students, setStudents] = useState([]);
  const [classGroups, setClassGroups] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [edited, setEdited] = useState({});

  useEffect(() => {
    const savedStudents = JSON.parse(localStorage.getItem('striveStudents')) || [];
    const savedClasses = JSON.parse(localStorage.getItem('striveClassGroups')) || [];
    setStudents(savedStudents);
    setClassGroups(savedClasses);
  }, []);

  const handleEdit = (student) => {
    setEditingId(student.id);
    setEdited({ ...student });
  };

  const handleSave = () => {
    const updated = students.map((s) => (s.id === editingId ? edited : s));
    setStudents(updated);
    localStorage.setItem('striveStudents', JSON.stringify(updated));
    setEditingId(null);
    setEdited({});
  };

  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    const updated = students.filter((s) => s.id !== id);
    setStudents(updated);
    localStorage.setItem('striveStudents', JSON.stringify(updated));
  };

  const handleChange = (field, value) => {
    setEdited((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">🎓 Student Profile Editor</h1>

        {students.length === 0 ? (
          <p className="text-gray-600">No students found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left bg-white text-black rounded shadow">
              <thead className="bg-orange-100 text-orange-700">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Year</th>
                  <th className="p-2 border">Level</th>
                  <th className="p-2 border">Class</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) =>
                  editingId === s.id ? (
                    <tr key={s.id} className="bg-yellow-50">
                      <td className="p-2 border">
                        <input
                          className="w-full p-1 border rounded"
                          value={edited.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                        />
                      </td>
                      <td className="p-2 border">
                        <select
                          className="w-full p-1 border rounded"
                          value={edited.yearGroup}
                          onChange={(e) => handleChange('yearGroup', e.target.value)}
                        >
                          <option>First Year</option>
                          <option>Second Year</option>
                          <option>Third Year</option>
                          <option>Transition Year</option>
                          <option>Fifth Year</option>
                          <option>Sixth Year</option>
                        </select>
                      </td>
                      <td className="p-2 border">
                        {['Third Year', 'Fifth Year', 'Sixth Year'].includes(edited.yearGroup) ? (
                          <select
                            className="w-full p-1 border rounded"
                            value={edited.level}
                            onChange={(e) => handleChange('level', e.target.value)}
                          >
                            <option value="">—</option>
                            <option value="Higher">Higher</option>
                            <option value="Ordinary">Ordinary</option>
                          </select>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="p-2 border">
                        <select
                          className="w-full p-1 border rounded"
                          value={edited.className}
                          onChange={(e) => handleChange('className', e.target.value)}
                        >
                          <option value="">Select Class</option>
                          {classGroups.map((group, idx) => (
                            <option key={idx} value={group.name}>{group.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2 border flex gap-2">
                        <button onClick={handleSave} className="bg-green-600 text-white px-2 py-1 rounded text-sm">
                          ✅ Save
                        </button>
                        <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-2 py-1 rounded text-sm">
                          ❌ Cancel
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="p-2 border">{s.name}</td>
                      <td className="p-2 border">{s.yearGroup}</td>
                      <td className="p-2 border">{s.level || '—'}</td>
                      <td className="p-2 border">{s.className || '—'}</td>
                      <td className="p-2 border flex gap-2">
                        <button onClick={() => handleEdit(s)} className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
                          ✏️ Edit
                        </button>
                        <button onClick={() => handleDelete(s.id)} className="bg-red-600 text-white px-2 py-1 rounded text-sm">
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(StudentProfileEditor, ['principal']);