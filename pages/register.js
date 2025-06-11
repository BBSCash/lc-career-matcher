import { useState } from 'react';
import { useRouter } from 'next/router';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [yearGroup, setYearGroup] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = () => {
    if (!name || !email || !password) {
      setError('All fields are required.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('striveUsers')) || [];
    const students = JSON.parse(localStorage.getItem('striveStudents')) || [];

    if (users.find(u => u.email === email)) {
      setError('Email is already registered.');
      return;
    }

    if (role === 'student') {
      const matchingStudent = students.find(s => s.email === email);

      if (!matchingStudent) {
        setError('This student email has not been pre-approved by the principal.');
        return;
      }

      matchingStudent.registered = true;
      matchingStudent.name = name; // Update name
      localStorage.setItem('striveStudents', JSON.stringify(students));

      const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        role,
        yearGroup: matchingStudent.yearGroup
      };

      users.push(newUser);
      localStorage.setItem('striveUsers', JSON.stringify(users));
      alert('✅ Registered successfully!');
      router.push('/login');
    } else {
      const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        role
      };

      users.push(newUser);
      localStorage.setItem('striveUsers', JSON.stringify(users));
      alert('✅ Registered successfully!');
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="bg-orange-100 p-8 rounded shadow w-full max-w-md">
        <h1 className="text-3xl font-bold text-orange-500 mb-6 text-center">Register for Strive</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-3 rounded border"
        />

        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 rounded border"
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 rounded border"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 mb-3 rounded border"
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="principal">Principal</option>
        </select>

        {/* Year group is now auto-detected */}

        <button
          onClick={handleRegister}
          className="w-full bg-orange-500 text-white py-2 rounded font-semibold"
        >
          ➕ Register
        </button>
      </div>
    </div>
  );
}
