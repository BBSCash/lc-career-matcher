function getSubjectCategory(subject) {
  const s = subject.toLowerCase();

  if ([
    'maths', 'mathematics', 'applied mathematics', 'physics', 'chemistry',
    'biology', 'engineering', 'technology', 'computer science',
    'design and communication graphics', 'agricultural science'
  ].some(sub => s.includes(sub))) return 'STEM';

  if ([
    'english', 'irish', 'french', 'german', 'spanish', 'italian',
    'language', 'history', 'geography', 'classics', 'philosophy', 'music'
  ].some(sub => s.includes(sub))) return 'Arts';

  if ([
    'business', 'accounting', 'economics', 'enterprise'
  ].some(sub => s.includes(sub))) return 'Business';

  return 'General';
}

export function recommendCourses(topSubjects, totalPoints, allCourses) {
  const subjectCategories = topSubjects.map(s => getSubjectCategory(s.subject));
  const uniqueCategories = [...new Set(subjectCategories)];

  return allCourses.filter(course => {
    return (
      course.points <= totalPoints &&
      uniqueCategories.includes(course.category.toLowerCase())
    );
  });
}
