import { useEffect, useState } from 'react';
import Header from '../components/header.js';
import courses from '../data/courses.json';

function CourseMatcher() {
  const [caoPoints, setCaoPoints] = useState(0);
  const [matchedCourses, setMatchedCourses] = useState([]);
  const [topSubjects, setTopSubjects] = useState([]);
  const [liveStudentData, setLiveStudentData] = useState([]);

  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('striveUser')) : null;

  useEffect(() => {
    if (!user?.email) return;

    const savedResults = localStorage.getItem('striveResults');
    if (!savedResults) return;

    const results = JSON.parse(savedResults);

    // Filter results by this student
    const userResults = results.filter(r => r.studentEmail === user.email);

    // Calculate averages & points
    const { top6, totalPoints } = calculateTop6(userResults);

    setCaoPoints(totalPoints);
    setTopSubjects(top6.map((s) => s.subject));

    // Recommend courses based on top subjects and points
    const matches = recommendCourses(top6, totalPoints, courses);
    setMatchedCourses(matches);

    // Update live student data with current user's points and courses
    updateLiveStudentData(user.email, totalPoints, matches.map(c => c.title));
  }, [user]);

  // CAO points calculator (same as before)
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

  // Calculate top 6 averages & points
  const calculateTop6 = (results) => {
    const data = {};

    results.forEach(res => {
      const key = `${res.subject}__${res.level}`;
      const percent = (res.score / (res.total || 100)) * 100;
      if (!data[key]) {
        data[key] = { subject: res.subject, level: res.level, total: 0, count: 0 };
      }
      data[key].total += percent;
      data[key].count++;
    });

    const averages = Object.values(data).map(({ subject, level, total, count }) => {
      const avg = total / count;
      const points = getCAOPoints(avg, level);
      return { subject, level, avg: avg.toFixed(1), points };
    });

    const top6 = averages.sort((a, b) => b.points - a.points).slice(0, 6);
    const totalPoints = top6.reduce((sum, s) => sum + s.points, 0);

    return { top6, totalPoints };
  };

  // Map subjects to categories (same as before)
  const mapSubjectToCategory = (subject) => {
    const lower = subject.toLowerCase();
    if (['maths', 'mathematics', 'applied mathematics', 'physics', 'chemistry', 'biology', 'technology', 'engineering', 'computer science'].some(s => lower.includes(s))) return 'stem';
    if (['french', 'german', 'irish', 'english', 'italian', 'spanish', 'language'].some(s => lower.includes(s))) return 'arts';
    if (['business', 'economics', 'accounting'].some(s => lower.includes(s))) return 'business';
    return '';
  };

  // Recommend courses based on category and points
  const recommendCourses = (topSubjects, totalPoints, coursesList) => {
    return coursesList.filter(course => {
      return course.points <= totalPoints &&
        topSubjects.some(sub => course.category?.toLowerCase().includes(mapSubjectToCategory(sub.subject)));
    });
  };

  // Update live student data in localStorage
  const updateLiveStudentData = (email, points, recommendedCourses) => {
    const stored = JSON.parse(localStorage.getItem('liveStudentData')) || [];
    const index = stored.findIndex(s => s.email === email);
    if (index >= 0) {
      stored[index] = { email, caoPoints: points, recommendedCourses };
    } else {
      stored.push({ email, caoPoints: points, recommendedCourses });
    }
    localStorage.setItem('liveStudentData', JSON.stringify(stored));
    setLiveStudentData(stored);
  };

  // Calculate percentile for live data
  const calculateLivePercentile = (courseTitle) => {
    if (!liveStudentData.length) return null;
    const relevantPoints = liveStudentData
      .filter(s => s.recommendedCourses.includes(courseTitle))
      .map(s => s.caoPoints)
      .sort((a, b) => a - b);

    if (relevantPoints.length === 0) return null;

    const countBelow = relevantPoints.filter(p => p <= caoPoints).length;
    return ((countBelow / relevantPoints.length) * 100).toFixed(1);
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
            {matchedCourses.map((course, i) => {
              const percentile = calculateLivePercentile(course.title);
              return (
                <div key={i} className="bg-gray-50 border border-gray-200 p-4 rounded shadow-sm">
                  <h3 className="text-xl font-semibold text-orange-500">{course.title}</h3>
                  <p className="text-sm text-gray-700">
                    {course.college} — {course.points} Points — {course.category}
                  </p>
                  {percentile !== null && (
                    <p className="text-sm text-gray-600 mt-1">
                      Your live percentile for this course: <strong>{percentile}%</strong>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseMatcher;
