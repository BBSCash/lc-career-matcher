import { useState, useEffect } from 'react';
import withAuth from '@/components/withAuth';
import Header from '@/components/header';

function EnterResults({ user }) {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [score, setScore] = useState('');
  const [level, setLevel] = useState('Higher');

  useEffect(() => {
    // Fetch students from DB or mock data
    const stored = JSON.parse(localStorage.getItem('striveStudents')) || [];
    setStudents(stored);
  }, []);

  const handleSubmit = () => {
    const allResults = JSON.parse(localStorage.getItem('striveResults')) || [];
    const newResult = {
      student: studentId,
      subject,
      topic,
      score: parseFloat(score),
      total: 100,
      level: level === 'Higher' ? 'H' : 'O'
    };
    allResults.push(newResult);
    localStorage.setItem('striveResults', JSON.stringify(allResults));
    alert('Result submitted!');
    setSubject(''); setTopic(''); setScore('');
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-orange-500 mb-6">✍️ Enter Student Result</h1>
        <div className="space-y-4">
          <select className="w-full p-2 border rounded" value={studentId} onChange={e => setStudentId(e.target.value)}>
            <option value="">Select Student</option>
            {students.map((s, i) => (
              <option key={i} value={s.name}>{s.name}</option>
            ))}
          </select>

          <input className="w-full p-2 border rounded" type="text" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />

          <input className="w-full p-2 border rounded" type="text" placeholder="Topic" value={topic} onChange={e => setTopic(e.target.value)} />

          <input className="w-full p-2 border rounded" type="number" placeholder="Score (0-100)" value={score} onChange={e => setScore(e.target.value)} />

          <select className="w-full p-2 border rounded" value={level} onChange={e => setLevel(e.target.value)}>
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
