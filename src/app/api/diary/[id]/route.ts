import { NextResponse } from 'next/server';
import prisma from '../../../lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid diary entry ID' },
        { status: 400 }
      );
    }
    
    // Check if diary entry exists
    const diaryEntry = await prisma.diaryEntry.findUnique({
      where: { id },
    });
    
    if (!diaryEntry) {
      return NextResponse.json(
        { error: 'Diary entry not found' },
        { status: 404 }
      );
    }
    
    // Delete the diary entry
    await prisma.diaryEntry.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting diary entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete diary entry' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid diary entry ID' },
        { status: 400 }
      );
    }
    
    const diaryEntry = await prisma.diaryEntry.findUnique({
      where: { id },
    });
    
    if (!diaryEntry) {
      return NextResponse.json(
        { error: 'Diary entry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(diaryEntry);
  } catch (error) {
    console.error('Error fetching diary entry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch diary entry' },
      { status: 500 }
    );
  }
} 