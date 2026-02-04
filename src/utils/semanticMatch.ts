import courses from '../data/courses.json';

type Course = typeof courses[number];

const intentMap: Record<string, string[]> = {
  piano: ['music', 'keys'],
  guitar: ['music', 'strings'],
  jazz: ['improvisation', 'music'],
  spanish: ['language', 'conversation'],
  yoga: ['wellness', 'mindfulness'],
  meditation: ['mindfulness']
};

export function semanticSearch(query: string): Course[] {
  const tokens = query.toLowerCase().split(/\s+/);

  const expanded = new Set(tokens);
  tokens.forEach(t => {
    intentMap[t]?.forEach(extra => expanded.add(extra));
  });

  return courses
    .map(course => {
      let score = 0;

      course.tags.forEach(tag => {
        if (expanded.has(tag)) score += 3;
      });

      course.outcomes.forEach(outcome => {
        expanded.forEach(token => {
          if (outcome.toLowerCase().includes(token)) score += 1;
        });
      });

      return { ...course, matchScore: score };
    })
    .filter(c => c.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}
