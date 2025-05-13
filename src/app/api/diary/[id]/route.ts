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
    console.log("DELETE Diary Auth result:", JSON.stringify(authResult));
    console.log("DELETE Diary Auth userId:", userId);
    
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
    
    // Check if the diary entry belongs to the authenticated user
    if (diaryEntry.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - you do not have permission to delete this diary entry' },
        { status: 403 }
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
    // Try to get user ID from Clerk auth
    const authResult = auth();
    let userId = authResult?.userId;
    console.log("GET Diary[id] Auth result:", JSON.stringify(authResult));
    console.log("GET Diary[id] Auth userId:", userId);
    
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
    
    // Check if the diary entry belongs to the authenticated user
    if (diaryEntry.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - you do not have permission to view this diary entry' },
        { status: 403 }
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