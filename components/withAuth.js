import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function withAuth(Component, allowedRoles = []) {
  return function AuthWrapper(props) {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
      const stored = localStorage.getItem('striveUser');
      if (!stored) return router.push('/login');

      const parsed = JSON.parse(stored);
      if (!allowedRoles.includes(parsed.role)) return router.push('/login');

      setUser(parsed);
    }, []);

    if (!user) return null;

    return <Component {...props} user={user} />;
  };
}