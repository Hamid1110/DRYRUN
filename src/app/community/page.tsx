import { UsersScreen } from '@/components/user/UsersScreen';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learner Community & Leaderboard | DryRun',
  description: 'Live active learners, daily streaks, and university leaderboards.',
};

export default function Page() {
  return <UsersScreen />;
}
