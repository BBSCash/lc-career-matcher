import { useEffect, useState } from 'react';
import withAuth from '@/components/withAuth';
import Header from '@/components/header.js';

function TestEditor({ user }) {
  const [tests, setTests] = useState([]);
  const [classGroups, setClassGroups] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [edited, setEdited] = useState({});

  useEffect(() => {
    const savedTests = JSON.parse(localStorage.getItem('striveTests')) || [];
    const savedClasses = JSON.parse(localStorage.getItem('striveClassGroups')) || [];
    setTests(savedTests);
    setClassGroups(savedClasses);
  }, []);

  const handleEdit = (test) => {
    setEditingId(test.id);
    setEdited({ ...test });
  };

  const handleSave = () => {
    const updated = tests.map((t) => (t.id === editingId ? edited : t));
    setTests(updated);
    localStorage.setItem('striveTests', JSON.stringify(updated));
    setEditingId(null);
    setEdited({});
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this test?')) return;
    const updated = tests.filter((t) => t.id !== id);
    setTests(updated);
    localStorage.setItem('striveTests', JSON.stringify(updated));
  };

  const handleChange = (field, value) => {
    setEdited((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (idx, value) => {
    const newQs = [...edited.questions];
    newQs[idx].question = value;
    setEdited((prev) => ({ ...prev, questions: newQs }));
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">🧠 Test Editor</h1>

        {tests.length === 0 ? (
          <p className="text-gray-600">No tests found.</p>
        ) : (
          <div className="space-y-6">
            {tests.map((test) =>
              editingId === test.id ? (
                <div key={test.id} className="bg-yellow-50 border p-4 rounded shadow">
                  <div className="mb-2">
                    <label className="font-semibold">Title:</label>
                    <input
                      className="w-full p-2 border rounded"
                      value={edited.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                    />
                  </div>

                  <div className="mb-2">
                    <label className="font-semibold">Subject:</label>
                    <input
                      className="w-full p-2 border rounded"
                      value={edited.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="font-semibold">Assigned Class:</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={edited.className}
                      onChange={(e) => handleChange('className', e.target.value)}
                    >
                      <option value="">Select Class</option>
                      {classGroups.map((group, idx) => (
                        <option key={idx} value={group.name}>{group.name}</option>
                      ))}
                    </select>
                  </div>

                  <h2 className="font-semibold text-orange-500">Questions</h2>
                  {edited.questions.map((q, idx) => (
                    <div key={idx} className="mb-2">
                      <label className="text-sm font-medium text-gray-700">Q{idx + 1}:</label>
                      <textarea
                        className="w-full p-2 border rounded mt-1"
                        value={q.question}
                        onChange={(e) => handleQuestionChange(idx, e.target.value)}
                      />
                    </div>
                  ))}

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleSave}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      ✅ Save Changes
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div key={test.id} className="bg-gray-100 border p-4 rounded shadow">
                  <h2 className="text-lg font-bold text-orange-500">{test.title}</h2>
                  <p><strong>Subject:</strong> {test.subject}</p>
                  <p><strong>Class:</strong> {test.className}</p>
                  <p><strong>Questions:</strong> {test.questions.length}</p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(test)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(test.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(TestEditor, ['teacher']);