import { useEffect, useState } from 'react';
import withAuth from '@/components/withAuth';
import Header from '@/components/header.js';
import courses from '../data/courses.json';

function TestResults({ user }) {
  const [results, setResults] = useState([]);
  const [subjectAverages, setSubjectAverages] = useState([]);
  const [topSubjects, setTopSubjects] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [liveStudentData, setLiveStudentData] = useState([]);

  useEffect(() => {
    const savedResults = localStorage.getItem('striveResults');
    const liveData = JSON.parse(localStorage.getItem('liveStudentData')) || [];
    setLiveStudentData(liveData);

    if (!savedResults) return;

    const allResults = JSON.parse(savedResults);
    // Filter by logged-in student email
    const userResults = allResults.filter(r => r.studentEmail === user.email);
    setResults(userResults);

    calculateAverages(userResults);
  }, [user.email]);

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
    if (['maths', 'mathematics', 'applied mathematics', 'physics', 'chemistry', 'biology', 'technology', 'engineering', 'computer science'].some(s => lower.includes(s))) return 'stem';
    if (['french', 'german', 'irish', 'english', 'italian', 'spanish', 'language'].some(s => lower.includes(s))) return 'arts';
    if (['business', 'economics', 'accounting'].some(s => lower.includes(s))) return 'business';
    return '';
  };

  const calculateAverages = (results) => {
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

    const top6 = [...averages].sort((a, b) => b.points - a.points).slice(0, 6);
    const totalPts = top6.reduce((sum, s) => sum + s.points, 0);

    const matchedCourses = courses.filter(course => {
      return course.points <= totalPts &&
        top6.some(sub => course.category?.toLowerCase().includes(mapSubjectToCategory(sub.subject)));
    });

    setSubjectAverages(averages);
    setTopSubjects(top6);
    setTotalPoints(totalPts);
    setRecommendedCourses(matchedCourses);
  };

  const calculateLivePercentile = (courseTitle) => {
    if (!liveStudentData.length) return null;
    // Filter students who have this course in recommendedCourses array (case sensitive)
    const relevantPoints = liveStudentData
      .filter(s => s.recommendedCourses?.includes(courseTitle))
      .map(s => s.caoPoints)
      .sort((a, b) => a - b);

    if (relevantPoints.length === 0) return null;

    // Count how many have CAO points less than or equal to current student's totalPoints
    const countBelow = relevantPoints.filter(p => p <= totalPoints).length;
    return ((countBelow / relevantPoints.length) * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">📊 My Results Dashboard</h1>

        <div className="mb-10">
          <h2 className="text-xl font-semibold text-orange-500 mb-3">📈 Subject Averages & CAO Points</h2>
          {subjectAverages.length === 0 ? (
            <p>No test results yet.</p>
          ) : (
            <ul className="list-disc ml-6 space-y-1">
              {subjectAverages.map((entry, i) => (
                <li key={i}>
                  {entry.subject} ({entry.level}): {entry.avg}% — {entry.points} CAO Points
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold text-orange-500 mb-3">🏆 Top 6 Subjects</h2>
          {topSubjects.length === 0 ? <p>No data.</p> : (
            <ul className="list-disc ml-6">
              {topSubjects.map((subj, i) => (
                <li key={i}>{subj.subject} ({subj.level}) — {subj.points} pts</li>
              ))}
            </ul>
          )}
          <p className="mt-2 font-bold">Total CAO Points: {totalPoints}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-orange-500 mb-3">🎓 Recommended Courses</h2>
          {recommendedCourses.length === 0 ? <p>No courses matched.</p> : (
            <ul className="space-y-3">
              {recommendedCourses.map((c, i) => {
                const percentile = calculateLivePercentile(c.title);
                return (
                  <li key={i} className="bg-gray-100 p-4 rounded flex justify-between items-center">
                    <div>
                      <p className="font-bold text-lg">{c.title}</p>
                      <p>{c.college} — {c.points} Points — {c.category}</p>
                    </div>
                    {percentile !== null && (
                      <p className="text-sm text-gray-600 ml-4 whitespace-nowrap">
                        Live percentile: <strong>{percentile}%</strong>
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(TestResults, ['student']);
