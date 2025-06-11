import { useEffect, useState } from 'react';
import withAuth from '@/components/withAuth';
import Header from '@/components/header.js';

function TeacherClasses({ user }) {
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const allClasses = JSON.parse(localStorage.getItem('striveClassGroups')) || [];
    const teacherClasses = allClasses.filter(cls => cls.teacherId === user.email);
    setAssignedClasses(teacherClasses);

    const allStudents = JSON.parse(localStorage.getItem('striveStudents')) || [];
    setStudents(allStudents);
  }, [user.email]);

  const getStudentsForClass = (studentIds) => {
    return students.filter(s => studentIds.includes(s.id));
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">🧑‍🏫 My Assigned Classes</h1>

        {assignedClasses.length === 0 ? (
          <p className="text-gray-600">You are not currently assigned to any classes.</p>
        ) : (
          <div className="space-y-6">
            {assignedClasses.map((cls, idx) => (
              <div key={idx} className="bg-gray-100 rounded shadow p-4">
                <h2 className="text-xl font-semibold text-orange-600 mb-1">{cls.name}</h2>
                <p className="mb-1 text-sm text-gray-700">
                  <strong>Year:</strong> {cls.yearGroup} | <strong>Subject:</strong> {cls.subject} | <strong>Time:</strong> {cls.day} at {cls.time}
                </p>
                <p className="font-semibold mt-3 mb-1">👥 Students:</p>
                <ul className="list-disc ml-6">
                  {getStudentsForClass(cls.studentIds).map(s => (
                    <li key={s.id}>{s.name} ({s.yearGroup})</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(TeacherClasses, ['teacher']);