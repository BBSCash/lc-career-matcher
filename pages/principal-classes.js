// principal-classes.js

import { useState, useEffect } from 'react';
import withAuth from '@/components/withAuth';
import Header from '@/components/header';

const YEAR_GROUPS = ['1st Year', '2nd Year', '3rd Year', 'Transition Year', '5th Year', '6th Year'];
const SUBJECTS = ['Maths', 'English', 'Irish', 'Science', 'French', 'History', 'Geography', 'Business', 'Art', 'Music'];

function PrincipalClasses({ user }) {
  const [activeYear, setActiveYear] = useState('6th Year');
  const [activeSubject, setActiveSubject] = useState('Maths');
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ name: '', teacherId: '', day: '', time: '', editingIndex: null });

  useEffect(() => {
    setStudents(JSON.parse(localStorage.getItem('striveStudents')) || []);
    setTeachers(JSON.parse(localStorage.getItem('striveUsers'))?.filter(u => u.role === 'teacher') || []);
    setClasses(JSON.parse(localStorage.getItem('striveClassGroups')) || []);
  }, []);

  const handleFormChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const createOrUpdateClass = () => {
    if (!form.name || !form.teacherId || !form.day || !form.time) {
      alert('Please fill in all fields.');
      return;
    }

    const existingStudentIds = form.editingIndex !== null ? classes[form.editingIndex].studentIds : [];

    const newClass = {
      name: form.name,
      teacherId: form.teacherId,
      day: form.day,
      time: form.time,
      subject: activeSubject,
      yearGroup: activeYear,
      studentIds: existingStudentIds,
    };

    const updated = form.editingIndex !== null
      ? classes.map((c, i) => i === form.editingIndex ? newClass : c)
      : [...classes, newClass];

    setClasses(updated);
    localStorage.setItem('striveClassGroups', JSON.stringify(updated));
    setForm({ name: '', teacherId: '', day: '', time: '', editingIndex: null });
  };

  const assignStudent = (studentEmail, classIndex) => {
    const student = students.find(s => s.email === studentEmail && s.yearGroup === activeYear);
    if (!student) return;

    const updated = [...classes];
    const target = updated[classIndex];
    if (!target.studentIds.includes(student.id)) {
      target.studentIds.push(student.id);
      updated[classIndex] = target;
      setClasses(updated);
      localStorage.setItem('striveClassGroups', JSON.stringify(updated));
    }
  };

  const editClass = (index) => {
    const cls = classes[index];
    setForm({
      name: cls.name,
      teacherId: cls.teacherId,
      day: cls.day,
      time: cls.time,
      editingIndex: index,
    });
  };

  const filteredStudents = students.filter(s => s.yearGroup === activeYear);
  const filteredClasses = classes.filter(c => c.yearGroup === activeYear && c.subject === activeSubject);

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6 text-orange-500">🏫 Class Manager</h1>

        {/* Year & Subject Selectors */}
        <div className="mb-6 flex flex-wrap gap-2">
          {YEAR_GROUPS.map(yr => (
            <button key={yr} className={`px-4 py-2 rounded ${activeYear === yr ? 'bg-orange-500 text-white' : 'bg-gray-200'}`} onClick={() => setActiveYear(yr)}>
              {yr}
            </button>
          ))}
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {SUBJECTS.map(sub => (
            <button key={sub} className={`px-4 py-2 rounded ${activeSubject === sub ? 'bg-orange-300' : 'bg-gray-100'}`} onClick={() => setActiveSubject(sub)}>
              {sub}
            </button>
          ))}
        </div>

        {/* Class Form */}
        <div className="bg-orange-100 p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-3 text-orange-600">
            {form.editingIndex !== null ? '✏️ Edit Class' : '➕ Create New Class'}
          </h2>
          <input name="name" placeholder="Class Name (e.g. 6A Maths)" value={form.name} onChange={handleFormChange} className="w-full p-2 rounded border mb-2" />
          <select name="teacherId" value={form.teacherId} onChange={handleFormChange} className="w-full p-2 rounded border mb-2">
            <option value="">Assign Teacher</option>
            {teachers.map(t => (
              <option key={t.email} value={t.email}>{t.name} ({t.email})</option>
            ))}
          </select>
          <div className="flex gap-2 mb-2">
            <select name="day" value={form.day} onChange={handleFormChange} className="w-1/2 p-2 rounded border">
              <option value="">Day</option>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <input name="time" type="time" value={form.time} onChange={handleFormChange} className="w-1/2 p-2 rounded border" />
          </div>
          <button onClick={createOrUpdateClass} className="bg-orange-500 text-white px-4 py-2 rounded font-semibold w-full">
            {form.editingIndex !== null ? '💾 Save Changes' : '📚 Create Class'}
          </button>
        </div>

        {/* Existing Classes */}
        <h2 className="text-xl font-semibold mb-4 text-orange-500">📚 Existing {activeYear} {activeSubject} Classes</h2>
        {filteredClasses.length === 0 ? (
          <p>No classes yet.</p>
        ) : (
          filteredClasses.map((cls, idx) => (
            <div key={idx} className="bg-gray-100 p-4 rounded shadow mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">{cls.name}</h3>
                <button onClick={() => editClass(classes.indexOf(cls))} className="text-blue-600 underline">Edit</button>
              </div>
              <p><strong>Teacher:</strong> {teachers.find(t => t.email === cls.teacherId)?.name || 'N/A'}</p>
              <p><strong>Time:</strong> {cls.day} at {cls.time}</p>
              <p className="mt-2 font-semibold">👨‍🎓 Assigned Students:</p>
              <ul className="list-disc ml-6">
                {cls.studentIds.map(id => {
                  const stu = students.find(s => s.id === id);
                  return stu ? <li key={id}>{stu.name} ({stu.email})</li> : null;
                })}
              </ul>
              <div className="mt-3">
                <select
                  onChange={(e) => {
                    assignStudent(e.target.value, classes.indexOf(cls));
                    e.target.selectedIndex = 0;
                  }}
                  className="p-2 border rounded"
                >
                  <option value="">➕ Add Student</option>
                  {filteredStudents.filter(s => !cls.studentIds.includes(s.id)).map(s => (
                    <option key={s.email} value={s.email}>{s.name} ({s.email})</option>
                  ))}
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default withAuth(PrincipalClasses, ['principal']);


