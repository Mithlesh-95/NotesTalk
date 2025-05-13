import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/db';
import { auth } from '@clerk/nextjs/server';

// GET request to fetch all notes
export async function GET(request: NextRequest) {
  try {
    // Try to get user ID from Clerk auth
    const authResult = auth();
    let clerkId = authResult?.userId;
    console.log("Auth result:", JSON.stringify(authResult));
    console.log("Auth userId:", clerkId);
    
    // If Clerk auth fails, try to get user ID from custom header
    if (!clerkId) {
      const headers = request.headers;
      clerkId = headers.get('X-User-Id');
      console.log("Using header user ID as fallback:", clerkId);
      
      if (!clerkId) {
        console.log("Unauthorized: No userId found in auth or headers");
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    // Get or create user in the database
    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      console.log("User not found in database, creating a new one");
      user = await prisma.user.create({
        data: {
          clerkId,
          name: 'New User',
        },
      });
    }
    
    const notes = await prisma.note.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    console.log(`Found ${notes.length} notes for user ${user.id} (Clerk ID: ${clerkId})`);
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

// POST request to create a new note
export async function POST(request: NextRequest) {
  try {
    // Try to get user ID from Clerk auth
    const authResult = auth();
    let clerkId = authResult?.userId;
    console.log("POST Auth result:", JSON.stringify(authResult));
    console.log("POST Auth userId:", clerkId);
    
    // If Clerk auth fails, try to get user ID from custom header
    if (!clerkId) {
      const headers = request.headers;
      clerkId = headers.get('X-User-Id');
      console.log("Using header user ID as fallback:", clerkId);
      
      if (!clerkId) {
        console.log("Unauthorized POST: No userId found in auth or headers");
        return NextResponse.json(
          { error: 'Unauthorized - You must be signed in to create notes' },
          { status: 401 }
        );
      }
    }

    // Get or create user in the database
    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      console.log("User not found in database, creating a new one");
      user = await prisma.user.create({
        data: {
          clerkId,
          name: 'New User',
        },
      });
    }
    
    // Parse request body
    let requestBody;
    try {
      requestBody = await request.json();
      console.log("Request body:", JSON.stringify(requestBody));
    } catch (error) {
      console.error("Error parsing request body:", error);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    const { title, content } = requestBody;
    
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    console.log(`Attempting to create note for user ${user.id} (Clerk ID: ${clerkId}) with title: ${title}`);
    
    try {
      // Create the note linked to our database user model
      const note = await prisma.note.create({
        data: {
          title,
          content,
          userId: user.id, // Use the User model's ID
        },
      });
      
      console.log(`Created note ${note.id} for user ${user.id}`);
      return NextResponse.json(note, { status: 201 });
    } catch (dbError) {
      console.error('Database error creating note:', dbError);
      return NextResponse.json(
        { error: 'Database error: Failed to create note', details: String(dbError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unhandled error creating note:', error);
    return NextResponse.json(
      { error: 'Failed to create note', details: String(error) },
      { status: 500 }
    );
  }
} 