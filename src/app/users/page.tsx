import { UsersScreen } from '@/components/user/UsersScreen';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learners & Live Activity | DryRun',
  description: 'See learners currently online, active streaks, and community leaderboard.',
};

export default function Page() {
  return <UsersScreen />;
}
