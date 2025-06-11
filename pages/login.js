import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('striveUsers')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      setError('Invalid email or password.');
      return;
    }

    localStorage.setItem('striveUser', JSON.stringify(user));

    if (user.role === 'student') router.push('/student-dashboard');
    else if (user.role === 'teacher') router.push('/teacher-dashboard');
    else router.push('/principal-dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="bg-orange-100 p-8 rounded shadow w-full max-w-md">
        <h1 className="text-3xl font-bold text-orange-500 mb-6 text-center">Strive Login</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

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
          className="w-full p-2 mb-4 rounded border"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-orange-500 text-white py-2 rounded font-semibold"
        >
          🔐 Login
        </button>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{' '}
          <a href="/register" className="underline text-orange-600">Register here</a>
        </p>
      </div>
    </div>
  );
}