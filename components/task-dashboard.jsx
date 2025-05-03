"use client"

import { useState } from "react"
import { TaskList } from "@/components/task-list"
import { TaskForm } from "@/components/task-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useTask } from "@/context/task-context"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Toaster } from "@/components/ui/toaster"

export function TaskDashboard() {
  const { tasks } = useTask()
  const [isCreating, setIsCreating] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsCreating(true)
  }

  const handleCloseForm = () => {
    setIsCreating(false)
    setEditingTask(null)
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">TaskMaster</h1>
        <Sheet open={isCreating} onOpenChange={setIsCreating}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{editingTask ? "Edit Task" : "Create New Task"}</SheetTitle>
            </SheetHeader>
            <TaskForm existingTask={editingTask} onClose={handleCloseForm} />
          </SheetContent>
        </Sheet>
      </div>

      <TaskList onEditTask={handleEditTask} />
      <Toaster />
    </div>
  )
}
