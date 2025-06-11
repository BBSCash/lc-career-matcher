import { useEffect, useState } from 'react';
import withAuth from '@/components/withAuth';
import Header from '@/components/Header';

function UserManagement({ user }) {
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('striveUsers')) || [];
    const storedClasses = JSON.parse(localStorage.getItem('striveClassGroups')) || [];
    const storedStudents = JSON.parse(localStorage.getItem('striveStudents')) || [];

    setUsers(storedUsers);
    setClasses(storedClasses);
    setStudents(storedStudents);
  }, []);

  const assignClass = (studentId, className) => {
    const updatedClasses = classes.map((group) => {
      if (group.name === className && !group.studentIds.includes(studentId)) {
        return { ...group, studentIds: [...group.studentIds, studentId] };
      }
      return group;
    });

    setClasses(updatedClasses);
    localStorage.setItem('striveClassGroups', JSON.stringify(updatedClasses));
    alert('✅ Student added to class.');
  };

  const removeFromClass = (studentId, className) => {
    const updatedClasses = classes.map((group) => {
      if (group.name === className && group.studentIds.includes(studentId)) {
        return { ...group, studentIds: group.studentIds.filter((id) => id !== studentId) };
      }
      return group;
    });

    setClasses(updatedClasses);
    localStorage.setItem('striveClassGroups', JSON.stringify(updatedClasses));
    alert('❌ Student removed from class.');
  };

  const getStudentClasses = (id) => {
    return classes.filter((c) => c.studentIds.includes(id)).map((c) => c.name);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">👥 User Management</h1>

        <div className="overflow-x-auto">
          <table className="w-full bg-white text-black rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Classes</th>
                <th className="p-2 border">Add to Class</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                if (u.role !== 'student') {
                  return (
                    <tr key={u.id}>
                      <td className="p-2 border">{u.name}</td>
                      <td className="p-2 border">{u.email}</td>
                      <td className="p-2 border capitalize">{u.role}</td>
                      <td className="p-2 border">—</td>
                      <td className="p-2 border">—</td>
                    </tr>
                  );
                }

                const studentData = students.find((s) => s.name === u.name);
                const studentId = studentData ? studentData.id : null;
                const currentClasses = studentId ? getStudentClasses(studentId) : [];

                return (
                  <tr key={u.id}>
                    <td className="p-2 border align-top">{u.name}</td>
                    <td className="p-2 border align-top">{u.email}</td>
                    <td className="p-2 border align-top">{u.role}</td>
                    <td className="p-2 border align-top">
                      {currentClasses.length === 0 ? (
                        <span className="text-gray-500">Unassigned</span>
                      ) : (
                        <ul className="list-disc ml-4">
                          {currentClasses.map((cls, idx) => (
                            <li key={idx} className="flex justify-between items-center">
                              <span>{cls}</span>
                              <button
                                className="ml-2 text-red-600 text-sm underline"
                                onClick={() => removeFromClass(studentId, cls)}
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="p-2 border align-top">
                      {studentId ? (
                        <select
                          className="p-1 rounded border text-black"
                          onChange={(e) => {
                            if (e.target.value) assignClass(studentId, e.target.value);
                            e.target.selectedIndex = 0; // Reset
                          }}
                        >
                          <option value="">Select Class</option>
                          {classes.map((c, i) => (
                            <option key={i} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      ) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default withAuth(UserManagement, ['principal']);
