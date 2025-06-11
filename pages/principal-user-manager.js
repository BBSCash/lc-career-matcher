import { useState, useEffect } from 'react';
import withAuth from '@/components/withAuth';
import Header from '@/components/header';

const YEAR_GROUPS = ['1st Year', '2nd Year', '3rd Year', 'Transition Year', '5th Year', '6th Year'];

function PrincipalUserManager({ user }) {
  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: '', password: '' });
  const [roleFilter, setRoleFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('striveUsers')) || [];
    setUsers(stored);
  }, []);

  const handleEdit = (index) => {
    const u = users[index];
    setForm({ name: u.name, email: u.email, role: u.role, password: u.password || '' });
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    const updated = users.filter((_, i) => i !== index);
    setUsers(updated);
    localStorage.setItem('striveUsers', JSON.stringify(updated));
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    const updated = [...users];
    updated[editIndex] = { ...updated[editIndex], ...form };
    setUsers(updated);
    localStorage.setItem('striveUsers', JSON.stringify(updated));
    setEditIndex(null);
    setForm({ name: '', email: '', role: '', password: '' });
  };

  const filteredUsers = users.filter(u => {
    if (roleFilter && u.role !== roleFilter) return false;
    if (roleFilter === 'student' && yearFilter && u.yearGroup !== yearFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">👥 Manage All Accounts</h1>

        <div className="mb-6 flex gap-4 items-center">
          <label className="text-sm font-medium">Filter by Role:</label>
          <select
            className="border p-2 rounded"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setYearFilter('');
            }}
          >
            <option value="">All</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="principal">Principal</option>
          </select>

          {roleFilter === 'student' && (
            <>
              <label className="text-sm font-medium ml-4">Year Group:</label>
              <select
                className="border p-2 rounded"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="">All Years</option>
                {YEAR_GROUPS.map(yr => <option key={yr} value={yr}>{yr}</option>)}
              </select>
            </>
          )}
        </div>

        {filteredUsers.length === 0 ? (
          <p>No user accounts found.</p>
        ) : (
          <table className="min-w-full border border-gray-300 mb-8">
            <thead className="bg-orange-100">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Year Group</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, i) => (
                <tr key={i} className="odd:bg-gray-50">
                  <td className="p-2 border">{u.name}</td>
                  <td className="p-2 border">{u.email}</td>
                  <td className="p-2 border">{u.role}</td>
                  <td className="p-2 border">{u.yearGroup || '-'}</td>
                  <td className="p-2 border text-center">
                    <button onClick={() => handleEdit(users.indexOf(u))} className="text-blue-600 hover:underline mr-3">Edit</button>
                    <button onClick={() => handleDelete(users.indexOf(u))} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {editIndex !== null && (
          <div className="bg-orange-50 p-4 rounded shadow">
            <h2 className="text-xl font-semibold text-orange-600 mb-4">✏️ Edit User</h2>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full p-2 rounded border mb-2" />
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full p-2 rounded border mb-2" disabled />
            <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 rounded border mb-2">
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="principal">Principal</option>
            </select>
            {form.role === 'student' && (
              <select name="yearGroup" value={form.yearGroup || ''} onChange={handleChange} className="w-full p-2 rounded border mb-2">
                <option value="">Select Year Group</option>
                {YEAR_GROUPS.map(yr => <option key={yr} value={yr}>{yr}</option>)}
              </select>
            )}
            <input name="password" type="password" placeholder="New Password" value={form.password} onChange={handleChange} className="w-full p-2 rounded border mb-2" />
            <button onClick={handleSave} className="bg-orange-500 text-white px-4 py-2 rounded font-semibold w-full">💾 Save Changes</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(PrincipalUserManager, ['principal']);

