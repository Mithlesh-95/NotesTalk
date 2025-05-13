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
        { error: 'Invalid lecture note ID' },
        { status: 400 }
      );
    }
    
    // Check if lecture note exists
    const lectureNote = await prisma.lectureNote.findUnique({
      where: { id },
    });
    
    if (!lectureNote) {
      return NextResponse.json(
        { error: 'Lecture note not found' },
        { status: 404 }
      );
    }
    
    // Delete the lecture note
    await prisma.lectureNote.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lecture note:', error);
    return NextResponse.json(
      { error: 'Failed to delete lecture note' },
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
        { error: 'Invalid lecture note ID' },
        { status: 400 }
      );
    }
    
    const lectureNote = await prisma.lectureNote.findUnique({
      where: { id },
    });
    
    if (!lectureNote) {
      return NextResponse.json(
        { error: 'Lecture note not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(lectureNote);
  } catch (error) {
    console.error('Error fetching lecture note:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lecture note' },
      { status: 500 }
    );
  }
} 