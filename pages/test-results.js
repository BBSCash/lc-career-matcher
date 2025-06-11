import { useEffect, useState } from 'react';
import Header from '@/components/header.js';
import { calculateTop6 } from '@/lib/cao.js';
import { recommendCourses } from '@/lib/course-recommend.js';
import courses from '@/data/courses.json';
import withAuth from '@/components/withAuth';

function TestResults({ user }) {
  const [results, setResults] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [percentiles, setPercentiles] = useState({});
  const [top6Subjects, setTop6Subjects] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const savedResults = JSON.parse(localStorage.getItem('striveResults')) || [];
    setResults(savedResults);

    const { top6, totalPoints: points } = calculateTop6(savedResults);
    setTotalPoints(points);
    setTop6Subjects(top6.map(s => s.subject));

    const matches = recommendCourses(top6, points, courses);
    setRecommendedCourses(matches);

    // Calculate percentiles live from all students' results in localStorage
    const allResults = JSON.parse(localStorage.getItem('striveResults')) || [];
    const allStudents = JSON.parse(localStorage.getItem('striveStudents')) || [];
    // Map student email to their total points (top6)
    const studentPointsMap = {};

    allStudents.forEach(student => {
      // Filter results for this student
      const studentResults = allResults.filter(r => r.student === student.email);
      const { totalPoints: studentTotalPoints } = calculateTop6(studentResults);
      studentPointsMap[student.email] = studentTotalPoints;
    });

    // For each recommended course, calculate percentile based on students who have that course's category in their top6 subjects
    const newPercentiles = {};
    matches.forEach(course => {
      const courseCategory = course.category.toLowerCase();
      // Gather points of students who have this category in their top6 subjects
      const relevantPoints = allStudents
        .map(student => {
          const studentResults = allResults.filter(r => r.student === student.email);
          const { top6 } = calculateTop6(studentResults);
          const categories = top6.map(s => s.subject.toLowerCase());
          // Simple mapping of subject to category - replicate mapSubjectToCategory logic here if needed
          // For now, just check if courseCategory is included in student's categories
          if (categories.some(sub => courseCategory.includes(sub))) {
            const { totalPoints: pts } = calculateTop6(studentResults);
            return pts;
          }
          return null;
        })
        .filter(pts => pts !== null)
        .sort((a, b) => a - b);

      // Calculate percentile for current user's total points against relevantPoints
      const rank = relevantPoints.filter(pts => pts < totalPoints).length;
      const percentile = relevantPoints.length > 0 ? Math.round((rank / relevantPoints.length) * 100) : null;

      if (percentile !== null) {
        newPercentiles[course.title] = percentile;
      }
    });

    setPercentiles(newPercentiles);
  }, [user.email]);

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">📊 Your Test Results & Recommended Courses</h1>

        {recommendedCourses.length === 0 ? (
          <p className="text-gray-500">No recommended courses found based on your results.</p>
        ) : (
          <div className="space-y-4">
            {recommendedCourses.map((course, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 p-4 rounded shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-orange-500">{course.title}</h3>
                  <p className="text-sm text-gray-700">
                    {course.college} — {course.points} Points — {course.category}
                  </p>
                </div>
                <div className="text-gray-500 font-semibold">
                  {percentiles[course.title] !== undefined ? `${percentiles[course.title]}th percentile` : '-'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(TestResults, ['student']);
