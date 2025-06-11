import { useEffect, useState } from 'react';

export default function TeacherManager() {
  const [teachers, setTeachers] = useState([]);
  const [name, setName] = useState('');
  const [subjects, setSubjects] = useState('');
  const [hours, setHours] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('striveTeachers')) || [];
    setTeachers(stored);
  }, []);

  const saveTeachers = (data) => {
    setTeachers(data);
    localStorage.setItem('striveTeachers', JSON.stringify(data));
  };

  const addTeacher = () => {
    if (!name || !subjects || !hours) return alert('Fill all fields!');
    const newTeacher = {
      id: Date.now(),
      name,
      subjects: subjects.split(',').map(s => s.trim()),
      hours: parseInt(hours)
    };
    saveTeachers([...teachers, newTeacher]);
    setName('');
    setSubjects('');
    setHours('');
  };

  const removeTeacher = (id) => {
    const updated = teachers.filter(t => t.id !== id);
    saveTeachers(updated);
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold text-orange-500 mb-6">👩‍🏫 Teacher Manager</h1>

      <div className="bg-gray-100 p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Add New Teacher</h2>
        <div className="space-y-2">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={subjects}
            onChange={e => setSubjects(e.target.value)}
            placeholder="Subjects (comma-separated)"
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            value={hours}
            onChange={e => setHours(e.target.value)}
            placeholder="Weekly hour limit"
            className="w-full p-2 border rounded"
          />
          <button onClick={addTeacher} className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
            ➕ Add Teacher
          </button>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">All Teachers</h2>
        {teachers.length === 0 ? (
          <p className="text-gray-600">No teachers added yet.</p>
        ) : (
          <ul className="space-y-3">
            {teachers.map(t => (
              <li key={t.id} className="border p-3 rounded flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">{t.name}</p>
                  <p>Subjects: {t.subjects.join(', ')}</p>
                  <p>Weekly Hours: {t.hours}</p>
                </div>
                <button onClick={() => removeTeacher(t.id)} className="text-red-600 underline text-sm">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
