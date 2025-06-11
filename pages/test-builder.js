import React, { useState, useEffect } from 'react';
import withAuth from '@/components/withAuth';
import Header from '@/components/header.js';

function TestBuilder({ user }) {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [type, setType] = useState('mcq');
  const [options, setOptions] = useState(['', '', '', '']);
  const [answer, setAnswer] = useState('');
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [classGroups, setClassGroups] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');

  useEffect(() => {
    const storedClasses = JSON.parse(localStorage.getItem('striveClassGroups')) || [];
    setClassGroups(storedClasses);
  }, []);

  const addQuestion = () => {
    const id = questions.length + 1;
    setQuestions([
      ...questions,
      {
        id,
        type,
        question: newQuestion,
        options: type === 'mcq' ? options : undefined,
        answer,
      },
    ]);
    setNewQuestion('');
    setOptions(['', '', '', '']);
    setAnswer('');
  };

  const saveTest = () => {
    if (!subject || !title || !selectedClass || questions.length === 0) {
      alert("Please complete all fields and add at least one question.");
      return;
    }

    const selectedClassObj = classGroups.find(cls => cls.name === selectedClass);
    const yearGroup = selectedClassObj?.yearGroup || 'Unknown';

    const newTest = {
      id: Date.now(),
      subject,
      title,
      questions,
      className: selectedClass,
      yearGroup,
    };

    const existing = JSON.parse(localStorage.getItem('striveTests')) || [];
    const updated = [...existing, newTest];
    localStorage.setItem('striveTests', JSON.stringify(updated));
    alert('✅ Test saved and assigned to class: ' + selectedClass);

    // Clear all fields
    setTitle('');
    setSubject('');
    setQuestions([]);
    setNewQuestion('');
    setOptions(['', '', '', '']);
    setAnswer('');
    setType('mcq');
    setSelectedClass('');
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />

      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6 text-orange-500 text-center">🧪 Build a Test</h1>

        <input
          type="text"
          placeholder="Test Title"
          className="w-full p-2 rounded border mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="w-full p-2 rounded border mb-2"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          <option value="">Select Subject</option>
          <option value="Mathematics">Mathematics</option>
          <option value="English">English</option>
          <option value="Irish">Irish</option>
          <option value="Biology">Biology</option>
          <option value="Chemistry">Chemistry</option>
          {/* Add more if needed */}
        </select>

        <select
          className="w-full p-2 rounded border mb-4"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Assign to Class</option>
          {classGroups.map((group, idx) => (
            <option key={idx} value={group.name}>
              {group.name} — {group.yearGroup || 'No Year Group'}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Enter your question"
          className="w-full p-2 border rounded mb-2"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />

        <div className="mb-2">
          <label className="mr-2 font-medium">Type:</label>
          <select
            className="p-2 rounded border"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="mcq">Multiple Choice</option>
            <option value="short">Short Answer</option>
          </select>
        </div>

        {type === 'mcq' && (
          <div className="space-y-2 mb-2">
            {options.map((opt, idx) => (
              <input
                key={idx}
                className="w-full p-1 border rounded"
                placeholder={`Option ${idx + 1}`}
                value={opt}
                onChange={(e) => {
                  const newOpts = [...options];
                  newOpts[idx] = e.target.value;
                  setOptions(newOpts);
                }}
              />
            ))}
          </div>
        )}

        <input
          className="w-full p-1 border rounded mb-4"
          placeholder="Correct Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />

        <div className="flex gap-2 mb-6">
          <button
            onClick={addQuestion}
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            ➕ Add Question
          </button>
          <button
            onClick={saveTest}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            💾 Save Test
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-orange-500">Test Preview</h2>
          {questions.map((q) => (
            <div key={q.id} className="bg-gray-100 border p-3 rounded mb-2 shadow">
              <p><strong>Q{q.id}:</strong> {q.question}</p>
              {q.type === 'mcq' && (
                <ul className="list-disc ml-6">
                  {q.options?.map((opt, i) => <li key={i}>{opt}</li>)}
                </ul>
              )}
              <p className="text-sm text-green-700">Answer: {q.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default withAuth(TestBuilder, ['teacher']);