import { useEffect, useState } from 'react';

export default function CurriculumRequirements() {
  const [requirements, setRequirements] = useState([]);
  const [yearGroup, setYearGroup] = useState('');
  const [subject, setSubject] = useState('');
  const [numClasses, setNumClasses] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('striveCurriculumNeeds')) || [];
    setRequirements(stored);
  }, []);

  const saveRequirements = (data) => {
    setRequirements(data);
    localStorage.setItem('striveCurriculumNeeds', JSON.stringify(data));
  };

  const addRequirement = () => {
    if (!yearGroup || !subject || !numClasses) return alert('Fill all fields');
    const newEntry = {
      id: Date.now(),
      yearGroup,
      subject,
      numClasses: parseInt(numClasses)
    };
    saveRequirements([...requirements, newEntry]);
    setYearGroup('');
    setSubject('');
    setNumClasses('');
  };

  const removeRequirement = (id) => {
    const updated = requirements.filter(r => r.id !== id);
    saveRequirements(updated);
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold text-orange-500 mb-6">📘 Curriculum Requirements</h1>

      <div className="bg-gray-100 p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Add Requirement</h2>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Year Group (e.g. 6th Year)"
            value={yearGroup}
            onChange={e => setYearGroup(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Number of Classes"
            value={numClasses}
            onChange={e => setNumClasses(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button onClick={addRequirement} className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
            ➕ Add
          </button>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Requirements List</h2>
        {requirements.length === 0 ? (
          <p className="text-gray-600">No curriculum requirements added yet.</p>
        ) : (
          <ul className="space-y-3">
            {requirements.map(r => (
              <li key={r.id} className="border p-3 rounded flex justify-between items-center">
                <div>
                  <p><strong>{r.yearGroup}</strong> — {r.subject} × {r.numClasses} classes</p>
                </div>
                <button onClick={() => removeRequirement(r.id)} className="text-red-600 underline text-sm">
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
