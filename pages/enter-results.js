import { useState, useEffect } from 'react';
import withAuth from '@/components/withAuth';
import Header from '@/components/header.js';

function EnterResults({ user }) {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [studentEmail, setStudentEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [score, setScore] = useState('');
  const [level, setLevel] = useState('Higher');

  useEffect(() => {
    const allClasses = JSON.parse(localStorage.getItem('striveClassGroups')) || [];
    const teacherClasses = allClasses.filter(cls => cls.teacherId === user.email);
    setClasses(teacherClasses);

    const allStudents = JSON.parse(localStorage.getItem('striveStudents')) || [];
    setStudents(allStudents);
  }, [user.email]);

  const handleSubmit = () => {
    if (!selectedClass || !studentEmail || !score) {
      alert('Please fill in all fields');
      return;
    }

    const allResults = JSON.parse(localStorage.getItem('striveResults')) || [];
    const newResult = {
      studentEmail,
      subject: selectedClass.subject,
      topic,
      score: parseFloat(score),
      total: 100,
      level: level === 'Higher' ? 'H' : 'O',
    };

    allResults.push(newResult);
    localStorage.setItem('striveResults', JSON.stringify(allResults));

    alert('Result submitted!');
    setStudentEmail('');
    setTopic('');
    setScore('');
    setLevel('Higher');
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-orange-500 mb-6">✍️ Enter Student Result</h1>

        <div className="space-y-4">
          {/* Select Class */}
          <select
            className="w-full p-2 border rounded"
            value={selectedClass?.name || ''}
            onChange={e => {
              const cls = classes.find(c => c.name === e.target.value);
              setSelectedClass(cls);
              setStudentEmail('');
            }}
          >
            <option value="">Select Class</option>
            {classes.map((cls, i) => (
              <option key={i} value={cls.name}>
                {cls.name} ({cls.subject})
              </option>
            ))}
          </select>

          {/* Select Student */}
          {selectedClass && (
            <select
              className="w-full p-2 border rounded"
              value={studentEmail}
              onChange={e => setStudentEmail(e.target.value)}
            >
              <option value="">Select Student</option>
              {selectedClass.studentIds.map(id => {
                const s = students.find(stu => stu.id === id);
                return s ? (
                  <option key={s.email} value={s.email}>
                    {s.name} ({s.email})
                  </option>
                ) : null;
              })}
            </select>
          )}

          {/* Auto-subject shown */}
          {selectedClass && (
            <input
              className="w-full p-2 border rounded bg-gray-100"
              type="text"
              value={selectedClass.subject}
              disabled
              readOnly
            />
          )}

          <input
            className="w-full p-2 border rounded"
            type="text"
            placeholder="Topic"
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />

          <input
            className="w-full p-2 border rounded"
            type="number"
            placeholder="Score (0-100)"
            value={score}
            onChange={e => setScore(e.target.value)}
          />

          <select
            className="w-full p-2 border rounded"
            value={level}
            onChange={e => setLevel(e.target.value)}
          >
            <option>Higher</option>
            <option>Ordinary</option>
          </select>

          <button className="bg-orange-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>
            Submit Result
          </button>
        </div>
      </div>
    </div>
  );
}

export default withAuth(EnterResults, ['teacher']);
