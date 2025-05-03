"use client"

import { useState, useEffect } from "react"
import { useTask } from "@/context/task-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { RecurrenceForm } from "@/components/recurrence-form"
import { RecurrencePreview } from "@/components/recurrence-preview"

export function TaskForm({ existingTask, onClose }) {
  const { addTask, updateTask } = useTask()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState(undefined)
  const [recurrence, setRecurrence] = useState(null)
  const [showRecurrenceForm, setShowRecurrenceForm] = useState(false)

  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title)
      setDescription(existingTask.description || "")
      setDueDate(existingTask.dueDate ? new Date(existingTask.dueDate) : undefined)
      setRecurrence(existingTask.recurrence)
    } else {
      resetForm()
    }
  }, [existingTask])

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setDueDate(undefined)
    setRecurrence(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    const taskData = {
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate,
      recurrence,
    }

    if (existingTask) {
      updateTask({
        ...existingTask,
        ...taskData,
      })
    } else {
      addTask(taskData)
    }

    resetForm()
    onClose()
  }

  const handleRecurrenceChange = (newRecurrence) => {
    setRecurrence(newRecurrence)
    setShowRecurrenceForm(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details about your task"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : "Select a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Recurrence</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowRecurrenceForm(!showRecurrenceForm)}
          >
            {recurrence ? "Edit Recurrence" : "Add Recurrence"}
          </Button>
        </div>

        {recurrence && !showRecurrenceForm && (
          <div className="p-3 border rounded-md">
            <RecurrencePreview recurrence={recurrence} />
          </div>
        )}

        {showRecurrenceForm && (
          <RecurrenceForm
            initialRecurrence={recurrence}
            onSave={handleRecurrenceChange}
            onCancel={() => setShowRecurrenceForm(false)}
          />
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">{existingTask ? "Update Task" : "Create Task"}</Button>
      </div>
    </form>
  )
}
