import { useEffect, useState } from 'react';
import withAuth from '@/components/withAuth';
import Header from '@/components/header';

function AssignTeachers({ user }) {
  const [teachers, setTeachers] = useState([]);
  const [classGroups, setClassGroups] = useState([]);
  const [assignments, setAssignments] = useState({});

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('striveUsers')) || [];
    const storedTeachers = users.filter(u => u.role === 'teacher');
    const storedClasses = JSON.parse(localStorage.getItem('striveClassGroups')) || [];

    const currentAssignments = {};
    storedClasses.forEach(cls => {
      currentAssignments[cls.name] = cls.teacher || '';
    });

    setTeachers(storedTeachers);
    setClassGroups(storedClasses);
    setAssignments(currentAssignments);
  }, []);

  const handleChange = (className, teacherEmail) => {
    setAssignments(prev => ({
      ...prev,
      [className]: teacherEmail
    }));
  };

  const handleSave = () => {
    const updated = classGroups.map(cls => ({
      ...cls,
      teacher: assignments[cls.name] || ''
    }));

    localStorage.setItem('striveClassGroups', JSON.stringify(updated));
    alert('✅ Teacher assignments saved!');
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">👩‍🏫 Assign Teachers to Classes</h1>

        {classGroups.length === 0 || teachers.length === 0 ? (
          <p className="text-gray-600">Make sure both classes and teachers exist before assigning.</p>
        ) : (
          <table className="w-full bg-white shadow rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border text-left">Class Name</th>
                <th className="p-2 border text-left">Assigned Teacher</th>
              </tr>
            </thead>
            <tbody>
              {classGroups.map(cls => (
                <tr key={cls.name} className="hover:bg-gray-50">
                  <td className="p-2 border">{cls.name}</td>
                  <td className="p-2 border">
                    <select
                      className="w-full p-1 border rounded"
                      value={assignments[cls.name] || ''}
                      onChange={(e) => handleChange(cls.name, e.target.value)}
                    >
                      <option value="">-- Select Teacher --</option>
                      {teachers.map(t => (
                        <option key={t.email} value={t.email}>
                          {t.name} ({t.email})
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-2 rounded font-semibold"
          >
            💾 Save Assignments
          </button>
        </div>
      </div>
    </div>
  );
}

export default withAuth(AssignTeachers, ['principal']);