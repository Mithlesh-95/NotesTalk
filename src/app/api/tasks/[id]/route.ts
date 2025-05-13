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
    console.log("DELETE Task Auth result:", JSON.stringify(authResult));
    console.log("DELETE Task Auth userId:", userId);
    
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
        { error: 'Invalid task ID' },
        { status: 400 }
      );
    }
    
    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id },
    });
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    // Check if the task belongs to the authenticated user
    if (task.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - you do not have permission to delete this task' },
        { status: 403 }
      );
    }
    
    // Delete the task
    await prisma.task.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
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
    console.log("GET Task[id] Auth result:", JSON.stringify(authResult));
    console.log("GET Task[id] Auth userId:", userId);
    
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
        { error: 'Invalid task ID' },
        { status: 400 }
      );
    }
    
    const task = await prisma.task.findUnique({
      where: { id },
    });
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    // Check if the task belongs to the authenticated user
    if (task.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - you do not have permission to view this task' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Try to get user ID from Clerk auth
    const authResult = auth();
    let userId = authResult?.userId;
    console.log("PATCH Task Auth result:", JSON.stringify(authResult));
    console.log("PATCH Task Auth userId:", userId);
    
    // If Clerk auth fails, try to get user ID from custom header
    if (!userId) {
      const headers = request.headers;
      const headerUserId = headers.get('X-User-Id');
      console.log("Using header user ID as fallback:", headerUserId);
      
      if (headerUserId) {
        userId = headerUserId;
      } else {
        console.log("Unauthorized PATCH: No userId found in auth or headers");
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }
    
    const id = Number(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid task ID' },
        { status: 400 }
      );
    }
    
    const { description, isCompleted } = await request.json();
    
    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id },
    });
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    // Check if the task belongs to the authenticated user
    if (task.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - you do not have permission to update this task' },
        { status: 403 }
      );
    }
    
    // Update the task
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        description: description !== undefined ? description : undefined,
        isCompleted: isCompleted !== undefined ? isCompleted : undefined,
      },
    });
    
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
} 