import { NextResponse } from 'next/server';
import connection from '@/utils/database';
import Podcast from '@/models/podcast';

export async function GET() {
  try {
    await connection();

    const podcasts = await Podcast.find({}, 'title image podcaster views createdAt')
      .populate('podcaster', 'username'); // Populate podcaster with username field

    return NextResponse.json(podcasts);
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    return NextResponse.json({ error: 'Failed to fetch podcasts' }, { status: 500 });
  }
}
