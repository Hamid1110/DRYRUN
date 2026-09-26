import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LEVELS, findLevel, levelLabel } from '@/content/course';
import { LevelScreen } from '@/components/level/LevelScreen';

export const dynamicParams = false;

export function generateStaticParams() {
  return LEVELS.map((l) => ({ levelId: l.level.id }));
}

export async function generateMetadata(props: PageProps<'/learn/[levelId]'>): Promise<Metadata> {
  const { levelId } = await props.params;
  const ref = findLevel(levelId);
  if (!ref) return { title: 'DryRun' };
  return { title: `${levelLabel(ref)}: ${ref.level.title} · DryRun`, description: ref.level.tagline.replace(/[`*]/g, '') };
}

export default async function Page(props: PageProps<'/learn/[levelId]'>) {
  const { levelId } = await props.params;
  if (!findLevel(levelId)) notFound();
  return <LevelScreen key={levelId} id={levelId} />;
}
