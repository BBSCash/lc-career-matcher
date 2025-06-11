import { useEffect, useState } from 'react';
import withAuth from '@/components/withAuth';
import Header from '@/components/header';

function TeacherTestLibrary({ user }) {
  const [testsByYear, setTestsByYear] = useState({});

  useEffect(() => {
    const tests = JSON.parse(localStorage.getItem('striveTests')) || [];

    const grouped = {};
    tests.forEach(test => {
      const group = test.yearGroup || 'Unspecified';
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(test);
    });

    setTestsByYear(grouped);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-orange-500 mb-8">📚 Test Library by Year Group</h1>

        {Object.keys(testsByYear).length === 0 ? (
          <p>No tests found.</p>
        ) : (
          Object.entries(testsByYear).map(([yearGroup, tests]) => (
            <div key={yearGroup} className="mb-10">
              <h2 className="text-2xl font-semibold text-orange-500 mb-4">{yearGroup}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tests.map(test => (
                  <div key={test.id} className="bg-gray-100 p-4 rounded shadow">
                    <h3 className="text-lg font-semibold text-orange-600">{test.title}</h3>
                    <p><strong>Subject:</strong> {test.subject}</p>
                    <p><strong>Class:</strong> {test.className}</p>
                    <p><strong>Questions:</strong> {test.questions.length}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default withAuth(TeacherTestLibrary, ['teacher']);
