import { useEffect, useState } from 'react';
import withAuth from '@/components/withAuth';
import Header from '@/components/header';

function UserManagement({ user }) {
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const yearGroups = ['1st Year', '2nd Year', '3rd Year', 'Transition Year', '5th Year', '6th Year'];

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('striveUsers')) || [];
    const storedStudents = JSON.parse(localStorage.getItem('striveStudents')) || [];
    setUsers(storedUsers);
    setStudents(storedStudents);
  }, []);

  const updateUser = (email, field, value) => {
    const updatedUsers = users.map(u =>
      u.email === email ? { ...u, [field]: value } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('striveUsers', JSON.stringify(updatedUsers));
  };

  const updateStudentYear = (email, newYearGroup) => {
    const updatedStudents = students.map(s =>
      s.email === email ? { ...s, yearGroup: newYearGroup } : s
    );
    setStudents(updatedStudents);
    localStorage.setItem('striveStudents', JSON.stringify(updatedStudents));
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">👥 User Management</h1>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Password</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Year Group</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const isStudent = u.role === 'student';
                const studentData = students.find(s => s.email === u.email);
                const currentYear = studentData?.yearGroup || '';

                return (
                  <tr key={u.email}>
                    <td className="p-2 border">{u.name}</td>

                    <td className="p-2 border">
                      <input
                        type="email"
                        className="p-1 border rounded w-full"
                        value={u.email}
                        onChange={e => updateUser(u.email, 'email', e.target.value)}
                      />
                    </td>

                    <td className="p-2 border">
                      <input
                        type="password"
                        className="p-1 border rounded w-full"
                        value={u.password || ''}
                        onChange={e => updateUser(u.email, 'password', e.target.value)}
                      />
                    </td>

                    <td className="p-2 border capitalize">{u.role}</td>

                    <td className="p-2 border">
                      {isStudent ? (
                        <select
                          className="p-1 border rounded"
                          value={currentYear}
                          onChange={e => updateStudentYear(u.email, e.target.value)}
                        >
                          <option value="">Select Year</option>
                          {yearGroups.map(yr => (
                            <option key={yr} value={yr}>{yr}</option>
                          ))}
                        </select>
                      ) : (
                        '—'
                      )}
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
