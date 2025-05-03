// app/api/tasks/route.js
import { NextResponse } from "next/server";
import { TaskSchema, createTask } from "@/types/task";

// Mock in-memory database
let tasks = [];

export async function GET() {
  return NextResponse.json(tasks);
}

/**
 * Creates a new task
 * @param {Request} request
 * @returns {Promise<NextResponse>}
 */
export async function POST(request) {
  try {
    const taskData = await request.json();

    if (!taskData.title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const newTask = createTask(taskData);
    tasks.push(newTask);

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid task data", details: error.errors },
      { status: 400 }
    );
  }
}

/**
 * Updates an existing task
 * @param {Request} request
 * @returns {Promise<NextResponse>}
 */
export async function PUT(request) {
  try {
    const taskData = await request.json();

    if (!taskData.id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const index = tasks.findIndex((t) => t.id === taskData.id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    // Validate the updated task data
    const updatedTask = TaskSchema.parse(taskData);
    tasks[index] = updatedTask;

    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid task data", details: error.errors },
      { status: 400 }
    );
  }
}

/**
 * Deletes a task
 * @param {Request} request
 * @returns {Promise<NextResponse>}
 */
export async function DELETE(request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Task ID is required" },
      { status: 400 }
    );
  }

  const initialLength = tasks.length;
  tasks = tasks.filter((task) => task.id !== id);

  if (tasks.length === initialLength) {
    return NextResponse.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}