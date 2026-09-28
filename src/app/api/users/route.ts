import { NextResponse } from 'next/server';
import { getCommunityData, recordUserHeartbeat } from '@/lib/serverUsers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = getCommunityData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API /api/users GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch community data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    recordUserHeartbeat({
      id: String(body.id),
      name: String(body.name || ''),
      institute: body.institute ? String(body.institute) : undefined,
      xp: typeof body.xp === 'number' ? body.xp : 0,
      streakDays: typeof body.streakDays === 'number' ? body.streakDays : 0,
      levelsDone: typeof body.levelsDone === 'number' ? body.levelsDone : 0,
    });

    const data = getCommunityData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API /api/users POST error:', error);
    return NextResponse.json({ error: 'Failed to record user heartbeat' }, { status: 500 });
  }
}
