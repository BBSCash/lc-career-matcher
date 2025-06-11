function getCaoPoints(score, level, subject = '') {
  const s = Math.round(score);

  if (level === "Higher") {
    if (s >= 90) return 100;
    if (s >= 80) return 88;
    if (s >= 70) return 77;
    if (s >= 60) return 66;
    if (s >= 50) return 56;
    if (s >= 40) return 46;
    if (s >= 30) return 37;
    return 0;
  }

  if (level === "Ordinary") {
    if (s >= 90) return 56;
    if (s >= 80) return 46;
    if (s >= 70) return 37;
    if (s >= 60) return 28;
    if (s >= 50) return 20;
    if (s >= 40) return 12;
    return 0;
  }

  if (level === "LCVP") {
    if (s >= 80) return 66;
    if (s >= 65) return 46;
    if (s >= 50) return 28;
    return 0;
  }

  return 0;
}

function applyMathsBonus(entry) {
  if (entry.subject.toLowerCase() === "maths" && entry.level === "Higher" && entry.points > 0) {
    return { ...entry, points: entry.points + 25 };
  }
  return entry;
}

export function calculateTop6(results) {
  const subjects = {};

  results.forEach(({ subject, score, level }) => {
    if (!subjects[subject]) {
      subjects[subject] = { total: 0, count: 0, level };
    }
    subjects[subject].total += score;
    subjects[subject].count += 1;
  });

  let subjectAverages = Object.entries(subjects).map(([subject, { total, count, level }]) => {
    const average = total / count;
    const points = getCaoPoints(average, level, subject);
    return { subject, average, level, points };
  });

  subjectAverages = subjectAverages.map(applyMathsBonus);

  const top6 = subjectAverages.sort((a, b) => b.points - a.points).slice(0, 6);
  const totalPoints = top6.reduce((sum, s) => sum + s.points, 0);

  return { top6, totalPoints };
}
