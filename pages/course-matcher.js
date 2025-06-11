import { useEffect, useState } from 'react';
import Header from '../components/header';
import { calculateTop6 } from '../lib/cao';
import { recommendCourses } from '../lib/course-recommend';
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
    const { top6, totalPoints } = calculateTop6(results);

    setCaoPoints(totalPoints);
    setTopSubjects(top6.map((s) => s.subject));

    const matches = recommendCourses(top6, totalPoints, courses);
    setMatchedCourses(matches);
  }, []);

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

