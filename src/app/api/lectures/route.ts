import { NextResponse } from 'next/server';
import prisma from '../../lib/db';

export async function GET() {
  try {
    const lectureNotes = await prisma.lectureNote.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(lectureNotes);
  } catch (error) {
    console.error('Error fetching lecture notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lecture notes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { subject, content } = await request.json();
    
    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Subject and content are required' },
        { status: 400 }
      );
    }
    
    const lectureNote = await prisma.lectureNote.create({
      data: {
        subject,
        content,
      },
    });
    
    return NextResponse.json(lectureNote, { status: 201 });
  } catch (error) {
    console.error('Error creating lecture note:', error);
    return NextResponse.json(
      { error: 'Failed to create lecture note' },
      { status: 500 }
    );
  }
} 