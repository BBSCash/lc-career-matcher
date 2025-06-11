import { useEffect, useState } from 'react';
import Header from '../components/header.js';
import courses from '../data/courses.json';

export default function CourseMatcher() {
  const [caoPoints, setCaoPoints] = useState(0);
  const [matchedCourses, setMatchedCourses] = useState([]);
  const [topSubjects, setTopSubjects] = useState([]);

  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('striveUser')) : null;

  useEffect(() => {
    const saved = localStorage.getItem('striveResults');
    if (!saved) return;

    const results = JSON.parse(saved);
    const subjectScores = {};

    results.forEach((res) => {
      const key = `${res.subject}__${res.level}`;
      const percent = (res.score / res.total) * 100;

      if (!subjectScores[key]) {
        subjectScores[key] = { total: 0, count: 0, subject: res.subject, level: res.level };
      }

      subjectScores[key].total += percent;
      subjectScores[key].count += 1;
    });

    const subjectAverages = Object.values(subjectScores).map((entry) => {
      const avg = entry.total / entry.count;
      const points = getCAOPoints(avg, entry.level);
      return {
        subject: entry.subject,
        level: entry.level,
        avg,
        points,
      };
    });

    const top6 = subjectAverages.sort((a, b) => b.points - a.points).slice(0, 6);
    const total = top6.reduce((sum, s) => sum + s.points, 0);
    setCaoPoints(total);
    setTopSubjects(top6.map((s) => s.subject));

    const filtered = courses.filter((c) => {
      return c.points <= total &&
        top6.some(sub => c.category?.toLowerCase().includes(mapSubjectToCategory(sub.subject)));
    });

    setMatchedCourses(filtered);
  }, []);

  const getCAOPoints = (percent, level) => {
    if (level === 'H') {
      if (percent >= 90) return 100;
      if (percent >= 80) return 88;
      if (percent >= 70) return 77;
      if (percent >= 60) return 66;
      if (percent >= 50) return 56;
      if (percent >= 40) return 46;
      if (percent >= 30) return 37;
      return 0;
    } else {
      if (percent >= 90) return 56;
      if (percent >= 80) return 46;
      if (percent >= 70) return 37;
      if (percent >= 60) return 28;
      if (percent >= 50) return 20;
      if (percent >= 40) return 12;
      return 0;
    }
  };

  const mapSubjectToCategory = (subject) => {
    const lower = subject.toLowerCase();
    if (['maths', 'mathematics', 'applied mathematics', 'physics', 'chemistry', 'biology', 'technology', 'engineering'].some(s => lower.includes(s))) return 'stem';
    if (['french', 'german', 'irish', 'english', 'italian', 'spanish', 'language'].some(s => lower.includes(s))) return 'arts';
    if (['business', 'economics', 'accounting'].some(s => lower.includes(s))) return 'business';
    return '';
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-orange-500 mb-4">🎓 Recommended CAO Courses</h1>
        <p className="text-lg mb-2 text-gray-700">Your CAO Points (Top 6 Subjects):</p>
        <p className="text-4xl font-extrabold text-orange-500 mb-6">{caoPoints} Points</p>

        {matchedCourses.length === 0 ? (
          <p className="text-gray-500">No course matches found for your profile yet.</p>
        ) : (
          <div className="space-y-4">
            {matchedCourses.map((course, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 p-4 rounded shadow-sm">
                <h3 className="text-xl font-semibold text-orange-500">{course.title}</h3>
                <p className="text-sm text-gray-700">
                  {course.college} — {course.points} Points — {course.category}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
