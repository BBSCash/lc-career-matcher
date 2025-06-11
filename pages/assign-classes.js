import { useEffect, useState } from 'react';
import withAuth from '@/components/withAuth';
import Header from '@/components/header';

function AssignClasses({ user }) {
  const [students, setStudents] = useState([]);
  const [classGroups, setClassGroups] = useState([]);
  const [studentClassMap, setStudentClassMap] = useState({});

  // Load data
  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem('striveStudents')) || [];
    const storedClasses = JSON.parse(localStorage.getItem('striveClassGroups')) || [];

    const map = {};
    storedClasses.forEach(cls => {
      cls.studentIds.forEach(id => {
        if (!map[id]) map[id] = [];
        map[id].push(cls.name);
      });
    });

    setStudents(storedStudents);
    setClassGroups(storedClasses);
    setStudentClassMap(map);
  }, []);

  const handleClassToggle = (studentId, className) => {
    const updatedMap = { ...studentClassMap };
    const current = updatedMap[studentId] || [];

    if (current.includes(className)) {
      updatedMap[studentId] = current.filter(c => c !== className);
    } else {
      updatedMap[studentId] = [...current, className];
    }

    setStudentClassMap(updatedMap);
  };

  const handleSave = () => {
    const updatedClasses = classGroups.map(cls => {
      const studentIds = students
        .filter(student => studentClassMap[student.id]?.includes(cls.name))
        .map(student => student.id);
      return { ...cls, studentIds };
    });

    setClassGroups(updatedClasses);
    localStorage.setItem('striveClassGroups', JSON.stringify(updatedClasses));
    alert('✅ Student assignments saved!');
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">🎓 Assign Students to Classes</h1>

        {students.length === 0 || classGroups.length === 0 ? (
          <p className="text-gray-600">Add students and class groups before assigning.</p>
        ) : (
          <table className="w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Year</th>
                {classGroups.map(cls => (
                  <th key={cls.name} className="p-2 border">{cls.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{student.name}</td>
                  <td className="p-2 border">{student.yearGroup}</td>
                  {classGroups.map(cls => (
                    <td key={cls.name} className="p-2 border text-center">
                      <input
                        type="checkbox"
                        checked={studentClassMap[student.id]?.includes(cls.name) || false}
                        onChange={() => handleClassToggle(student.id, cls.name)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-2 rounded font-semibold"
          >
            💾 Save Assignments
          </button>
        </div>
      </div>
    </div>
  );
}

export default withAuth(AssignClasses, ['principal']);