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
    console.log("DELETE Auth result:", JSON.stringify(authResult));
    console.log("DELETE Auth userId:", userId);
    
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
    
    // Parse the ID as a number - params.id is already a string, no need to await
    const id = Number(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid note ID' },
        { status: 400 }
      );
    }
    
    // Check if note exists and belongs to current user
    const note = await prisma.note.findUnique({
      where: { id },
    });
    
    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }
    
    // Check if the note belongs to the authenticated user
    if (note.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - you do not have permission to delete this note' },
        { status: 403 }
      );
    }
    
    // Delete the note
    await prisma.note.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Failed to delete note' },
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
    console.log("GET[id] Auth result:", JSON.stringify(authResult));
    console.log("GET[id] Auth userId:", userId);
    
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
    
    // Parse the ID as a number - params.id is already a string, no need to await
    const id = Number(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid note ID' },
        { status: 400 }
      );
    }
    
    const note = await prisma.note.findUnique({
      where: { id },
    });
    
    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }
    
    // Check if the note belongs to the authenticated user
    if (note.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - you do not have permission to view this note' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    return NextResponse.json(
      { error: 'Failed to fetch note' },
      { status: 500 }
    );
  }
} 