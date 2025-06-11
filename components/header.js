import Link from 'next/link';

export default function Header({ user }) {
  const logout = () => {
    localStorage.removeItem('striveUser');
    window.location.href = '/login';
  };

  const dashboardRoutes = {
    teacher: '/teacher-dashboard',
    student: '/student-dashboard',
    principal: '/principal-dashboard',
  };
  const dashboardPath = user ? dashboardRoutes[user.role] || '/' : '/';

  return (
    <header className="bg-white py-4 px-8 flex justify-between items-center border-b border-gray-200">
      <h1 className="text-2xl font-bold text-orange-500 cursor-pointer hover:text-orange-600">
        <Link href={dashboardPath}>
          <a>Strive</a>
        </Link>
      </h1>

      {user && (
        <button
          onClick={logout}
          className="text-red-600 underline font-semibold"
          aria-label="Logout"
        >
          Logout
        </button>
      )}
    </header>
  );
}
