import { NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { auth } from '@clerk/nextjs/server';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Try to get user ID from Clerk auth
    const authResult = auth();
    let userId = authResult?.userId;
    console.log("DELETE Lecture Auth result:", JSON.stringify(authResult));
    console.log("DELETE Lecture Auth userId:", userId);
    
    // If Clerk auth fails, try to get user ID from custom header
    if (!userId) {
      const headers = request.headers;
      const headerUserId = headers.get('X-User-Id');
      console.log("Using header user ID as fallback:", headerUserId);
      
      if (headerUserId) {
        userId = headerUserId;
      } else {
        console.log("Unauthorized DELETE: No userId found in auth or headers");
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }
    
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
    
    // Check if the lecture note belongs to the authenticated user
    if (lectureNote.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - you do not have permission to delete this lecture note' },
        { status: 403 }
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
    // Try to get user ID from Clerk auth
    const authResult = auth();
    let userId = authResult?.userId;
    console.log("GET Lecture[id] Auth result:", JSON.stringify(authResult));
    console.log("GET Lecture[id] Auth userId:", userId);
    
    // If Clerk auth fails, try to get user ID from custom header
    if (!userId) {
      const headers = request.headers;
      const headerUserId = headers.get('X-User-Id');
      console.log("Using header user ID as fallback:", headerUserId);
      
      if (headerUserId) {
        userId = headerUserId;
      } else {
        console.log("Unauthorized GET[id]: No userId found in auth or headers");
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }
    
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
    
    // Check if the lecture note belongs to the authenticated user
    if (lectureNote.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - you do not have permission to view this lecture note' },
        { status: 403 }
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