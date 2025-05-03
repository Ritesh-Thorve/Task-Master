"use client"

import { useState } from "react"
import { useTask } from "@/context/task-context"
import { formatDate } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Calendar, RefreshCw } from "lucide-react"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"

export function TaskItem({ task, onEdit }) {
  const { updateTask, deleteTask } = useTask()
  const [isDeleting, setIsDeleting] = useState(false)
  const [useConfirmation, setUseConfirmation] = useState(false)

  const handleToggleComplete = () => {
    const newStatus = !task.completed
    updateTask({ ...task, completed: newStatus })
    toast({
      title: newStatus ? "Task completed" : "Task reopened",
      description: newStatus
        ? `"${task.title}" has been marked as completed.`
        : `"${task.title}" has been reopened.`,
    })
  }

  const handleDelete = () => {
    deleteTask(task.id)
    setIsDeleting(false)
  }

  const handleDeleteClick = () => {
    if (useConfirmation) {
      setIsDeleting(true)
    } else {
      deleteTask(task.id)
    }
  }

  const getRecurrenceText = (task) => {
    if (!task.recurrence) return null
    switch (task.recurrence.type) {
      case "daily":
        return "Every day"
      case "weekly":
        if (task.recurrence.daysOfWeek?.length > 0) {
          const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
          return `Weekly on ${task.recurrence.daysOfWeek.map((d) => days[d]).join(", ")}`
        }
        return "Weekly"
      case "monthly":
        if (task.recurrence.dayOfMonth) {
          return `Monthly on day ${task.recurrence.dayOfMonth}`
        }
        if (task.recurrence.weekOfMonth && task.recurrence.dayOfWeek !== undefined) {
          const weeks = ["first", "second", "third", "fourth", "last"]
          const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
          return `Monthly on the ${weeks[task.recurrence.weekOfMonth - 1]} ${days[task.recurrence.dayOfWeek]}`
        }
        return "Monthly"
      case "yearly":
        if (task.recurrence.monthOfYear && task.recurrence.dayOfMonth) {
          const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ]
          return `Yearly on ${months[task.recurrence.monthOfYear - 1]} ${task.recurrence.dayOfMonth}`
        }
        return "Yearly"
      case "custom":
        if (task.recurrence.interval && task.recurrence.intervalUnit) {
          return `Every ${task.recurrence.interval} ${task.recurrence.intervalUnit}${task.recurrence.interval > 1 ? "s" : ""}`
        }
        return "Custom"
      default:
        return null
    }
  }

  const recurrenceText = getRecurrenceText(task)

  return (
    <Card className={`${task.completed ? "opacity-70" : ""}`}>
      <CardContent className="p-4 flex items-start gap-3">
        <Checkbox checked={task.completed} onCheckedChange={handleToggleComplete} className="mt-1" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="ghost icon" onClick={onEdit}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit task</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {useConfirmation ? (
                <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
                  <AlertDialogTrigger asChild>
                    <Button className="ghost icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Task</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this task? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className="icon" onClick={handleDeleteClick}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete task</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>

          {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}

          <div className="flex flex-wrap gap-2 mt-2">
            {task.dueDate && (
              <Badge className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(new Date(task.dueDate))}
              </Badge>
            )}
            {recurrenceText && (
              <Badge className="flex items-center gap-1">
                <RefreshCw className="h-3 w-3" />
                {recurrenceText}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
