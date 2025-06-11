import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import withAuth from '@/components/withAuth';
import Header from '@/components/header.js';

function StudentTakeTest({ user }) {
  const router = useRouter();
  const { id } = router.query;

  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!id) return;
    const allTests = JSON.parse(localStorage.getItem('striveTests')) || [];
    const found = allTests.find((t) => t.id === Number(id));
    if (!found) return;

    setTest(found);
    const initial = {};
    found.questions.forEach((q) => {
      initial[q.id] = '';
    });
    setAnswers(initial);
  }, [id]);

  const handleAnswerChange = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleSubmit = () => {
    if (!test) return;

    const correct = test.questions.reduce((score, q) => {
      const userAnswer = answers[q.id]?.trim().toLowerCase();
      const correctAnswer = q.answer.trim().toLowerCase();
      return userAnswer === correctAnswer ? score + 1 : score;
    }, 0);

    const allStudents = JSON.parse(localStorage.getItem('striveStudents')) || [];
    const student = allStudents.find((s) => s.name === user.name);

    const result = {
      student: user.name,
      subject: test.subject,
      className: test.className,
      level: student?.level || '',
      score: correct,
      total: test.questions.length,
      percentage: Math.round((correct / test.questions.length) * 100),
      date: new Date().toLocaleDateString(),
    };

    const existing = JSON.parse(localStorage.getItem('striveResults')) || [];
    const updated = [...existing, result];
    localStorage.setItem('striveResults', JSON.stringify(updated));

    setSubmitted(true);
    setTimeout(() => router.push('/student-test'), 1500);
  };

  if (!test) return <div className="p-6">Loading test...</div>;

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-orange-500 mb-4">{test.title}</h1>
        <p className="mb-6 text-gray-700">Subject: {test.subject} | Class: {test.className}</p>

        {test.questions.map((q, idx) => (
          <div key={q.id} className="mb-6">
            <p className="font-medium">Q{idx + 1}: {q.question}</p>
            {q.type === 'mcq' ? (
              <div className="mt-2 space-y-1">
                {q.options.map((opt, i) => (
                  <label key={i} className="block">
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => handleAnswerChange(q.id, opt)}
                      className="mr-2"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ) : (
              <input
                type="text"
                value={answers[q.id]}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                className="w-full mt-2 p-2 border rounded"
              />
            )}
          </div>
        ))}

        <button
          onClick={handleSubmit}
          disabled={submitted}
          className="bg-green-600 text-white px-6 py-2 rounded font-semibold"
        >
          {submitted ? 'Submitting...' : 'Submit Test'}
        </button>
      </div>
    </div>
  );
}

export default withAuth(StudentTakeTest, ['student']);