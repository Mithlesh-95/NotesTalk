import { NextResponse } from 'next/server';
import prisma from '../../lib/db';

export async function GET() {
  try {
    const diaryEntries = await prisma.diaryEntry.findMany({
      orderBy: {
        date: 'desc',
      },
    });
    
    return NextResponse.json(diaryEntries);
  } catch (error) {
    console.error('Error fetching diary entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch diary entries' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { content, date } = await request.json();
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }
    
    const diaryEntry = await prisma.diaryEntry.create({
      data: {
        content,
        date: date ? new Date(date) : new Date(),
      },
    });
    
    return NextResponse.json(diaryEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating diary entry:', error);
    return NextResponse.json(
      { error: 'Failed to create diary entry' },
      { status: 500 }
    );
  }
} 