import { COURSES, COURSE_TRACKS, LEVELS, type CourseTrack, type LevelRef } from '@/content/course';
import { LABS } from '@/content/labs';
import type { Lab, TaskQ } from '@/content/types';

export interface SearchItem {
  id: string;
  type: 'level' | 'checkpoint' | 'lab';
  track: CourseTrack;
  title: string;
  subtitle: string;
  badge: string;
  keywords: string;
  targetId: string;
  labTrackIndex?: number;
}

export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  // Index all levels across all course tracks
  LEVELS.forEach((ref) => {
    const isCp = ref.level.kind === 'revision';
    const trackInfo = COURSE_TRACKS.find((t) => t.id === ref.track);
    const trackLabel = trackInfo?.shortLabel ?? ref.track.toUpperCase();
    
    // Keywords from objectives, cheatsheet, and title
    const cheatKeywords = ref.level.cheatsheet?.map((c) => `${c.code} ${c.text}`).join(' ') ?? '';
    const objKeywords = ref.level.objectives?.join(' ') ?? '';
    const examKeywords = ref.level.exam?.questions?.map((q) => q.prompt).join(' ') ?? '';
    
    items.push({
      id: `level-${ref.level.id}`,
      type: isCp ? 'checkpoint' : 'level',
      track: ref.track,
      title: ref.level.title,
      subtitle: `${trackInfo?.label} · Unit ${ref.unit.num}: ${ref.unit.title}`,
      badge: isCp ? `${trackLabel} Checkpoint ${ref.num}` : `${trackLabel} Level ${ref.num}`,
      keywords: `${ref.level.title} ${ref.level.tagline} ${ref.unit.title} ${objKeywords} ${cheatKeywords} ${examKeywords}`.toLowerCase(),
      targetId: ref.level.id,
    });
  });

  // Index all lab tasks
  let pfLabIdx = 0, oopLabIdx = 0, dsaLabIdx = 0;
  LABS.forEach((lab) => {
    const tr = lab.track ?? 'pf';
    const trackInfo = COURSE_TRACKS.find((t) => t.id === tr);
    const trackLabel = trackInfo?.shortLabel ?? tr.toUpperCase();

    lab.tasks.forEach((task) => {
      let idx = 0;
      if (tr === 'pf') idx = pfLabIdx++;
      else if (tr === 'oop') idx = oopLabIdx++;
      else if (tr === 'dsa') idx = dsaLabIdx++;

      items.push({
        id: `lab-${task.id}`,
        type: 'lab',
        track: tr,
        title: task.prompt.split('\n')[0].replace(/[*_#]/g, '').trim(),
        subtitle: `${trackInfo?.label} · Lab Task (${task.source ?? lab.title})`,
        badge: `${trackLabel} Lab`,
        keywords: `${task.id} ${task.prompt} ${task.hints?.join(' ') ?? ''} ${lab.title}`.toLowerCase(),
        targetId: task.id,
        labTrackIndex: idx,
      });
    });
  });

  return items;
}

export function searchTopics(query: string, items: SearchItem[], limit = 20): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/).filter(Boolean);

  return items
    .map((item) => {
      let score = 0;
      const titleLower = item.title.toLowerCase();
      const subtitleLower = item.subtitle.toLowerCase();

      // Exact match in title gives highest score
      if (titleLower.includes(q)) score += 50;
      if (titleLower.startsWith(q)) score += 30;
      if (subtitleLower.includes(q)) score += 20;

      // Word matches
      for (const w of words) {
        if (titleLower.includes(w)) score += 15;
        else if (item.keywords.includes(w)) score += 5;
      }

      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}
