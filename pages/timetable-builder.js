import { useEffect, useState } from 'react';
import withAuth from '@/components/withAuth';
import Header from '@/components/header.js';

function TimetableBuilder({ user }) {
  const [classGroups, setClassGroups] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [timetable, setTimetable] = useState([]);
  const [subject, setSubject] = useState('');
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    const classes = JSON.parse(localStorage.getItem('striveClassGroups')) || [];
    setClassGroups(classes);

    const allTimetables = JSON.parse(localStorage.getItem('striveClassTimetables')) || [];
    if (selectedClass) {
      const classTT = allTimetables.find((tt) => tt.className === selectedClass);
      setTimetable(classTT ? classTT.timetable : []);
    }
  }, [selectedClass]);

  const addSlot = () => {
    if (!selectedClass || !subject || !day || !time) return;

    const teacher = classGroups.find(cls => cls.name === selectedClass)?.teacherName || '';

    const newSlot = { subject, day, time, teacher };
    const updated = [...timetable, newSlot];

    const all = JSON.parse(localStorage.getItem('striveClassTimetables')) || [];
    const existingIndex = all.findIndex((t) => t.className === selectedClass);
    if (existingIndex > -1) {
      all[existingIndex].timetable = updated;
    } else {
      all.push({ className: selectedClass, timetable: updated });
    }

    localStorage.setItem('striveClassTimetables', JSON.stringify(all));
    setTimetable(updated);
    setSubject('');
    setDay('');
    setTime('');
  };

  const deleteSlot = (index) => {
    const updated = [...timetable];
    updated.splice(index, 1);

    const all = JSON.parse(localStorage.getItem('striveClassTimetables')) || [];
    const existingIndex = all.findIndex((t) => t.className === selectedClass);
    if (existingIndex > -1) {
      all[existingIndex].timetable = updated;
      localStorage.setItem('striveClassTimetables', JSON.stringify(all));
    }

    setTimetable(updated);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">📅 Timetable Builder</h1>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full p-2 border rounded text-black mb-6"
        >
          <option value="">Select Class</option>
          {classGroups.map((cls, idx) => (
            <option key={idx} value={cls.name}>{cls.name}</option>
          ))}
        </select>

        {selectedClass && (
          <>
            <div className="bg-gray-100 p-4 rounded mb-6">
              <h2 className="text-xl font-semibold mb-3">➕ Add Lesson Slot</h2>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="w-full p-2 border rounded text-black mb-2"
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="p-2 border rounded text-black"
                >
                  <option value="">Day</option>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
                <input
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="Time (e.g. 09:00)"
                  className="p-2 border rounded text-black"
                />
              </div>
              <button
                onClick={addSlot}
                className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded font-semibold"
              >
                Add to Timetable
              </button>
            </div>

            <div className="bg-orange-50 p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-3 text-orange-500">📚 Timetable for {selectedClass}</h2>
              {timetable.length === 0 ? (
                <p>No slots added yet.</p>
              ) : (
                <ul className="space-y-3">
                  {timetable.map((slot, i) => (
                    <li key={i} className="flex justify-between items-center bg-white p-3 rounded shadow">
                      <div>
                        <p><strong>{slot.subject}</strong></p>
                        <p>{slot.day} at {slot.time} — Teacher: {slot.teacher || 'Not Assigned'}</p>
                      </div>
                      <button
                        onClick={() => deleteSlot(i)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default withAuth(TimetableBuilder, ['principal']);
