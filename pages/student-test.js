import { useEffect, useState } from 'react';
import Link from 'next/link';
import withAuth from '@/components/withAuth';
import Header from '@/components/Header';

function StudentTestList({ user }) {
  const [assignedTests, setAssignedTests] = useState([]);
  const [studentClass, setStudentClass] = useState('');
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const allStudents = JSON.parse(localStorage.getItem('striveStudents')) || [];
    const student = allStudents.find((s) => s.name === user.name);
    if (!student) return;

    setStudentId(student.id);

    const allClasses = JSON.parse(localStorage.getItem('striveClassGroups')) || [];
    const classGroup = allClasses.find((g) => g.studentIds.includes(student.id));
    if (!classGroup) return;

    setStudentClass(classGroup.name);

    const allTests = JSON.parse(localStorage.getItem('striveTests')) || [];
    const relevant = allTests.filter((t) => t.className === classGroup.name);
    setAssignedTests(relevant);
  }, [user.name]);

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">📝 My Assigned Tests</h1>

        {!studentClass ? (
          <p className="text-gray-600">You're not assigned to any class.</p>
        ) : assignedTests.length === 0 ? (
          <p className="text-gray-600">No tests assigned to your class: <strong>{studentClass}</strong>.</p>
        ) : (
          <ul className="space-y-4">
            {assignedTests.map((test) => (
              <li key={test.id} className="bg-gray-100 p-4 rounded shadow">
                <h2 className="text-lg font-semibold text-orange-500">{test.title}</h2>
                <p><strong>Subject:</strong> {test.subject}</p>
                <p><strong>Class:</strong> {test.className}</p>
                <p><strong>Questions:</strong> {test.questions.length}</p>

                <Link
                  href={`/student-test/${test.id}`}
                  className="inline-block mt-3 bg-orange-500 text-white px-4 py-1 rounded text-sm"
                >
                  📝 Take Test
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default withAuth(StudentTestList, ['student']);