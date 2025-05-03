'use client'

import { useState } from "react"
import { useTask } from "@/context/task-context"
import { TaskItem } from "@/components/task-item"
import Task from "@/task"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { isToday, isAfter, parseISO, startOfDay } from "date-fns"

// ✅ Utility to safely parse a date
function safeParseDate(input) {
  if (!input) return null
  return typeof input === 'string' ? parseISO(input) : new Date(input)
}

// TaskList component definition
export function TaskList({ onEditTask }) {
  const { tasks } = useTask()
  const [searchQuery, setSearchQuery] = useState("")

  // 🔍 Helper: Check if a task matches the search input
  const matchesSearch = (task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase())

  // 🔁 Helper: Determine if a recurring task occurs today
  function isRecurringToday(task) {
    if (!task.recurrence) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const startDate = new Date(task.recurrence.startDate)
    startDate.setHours(0, 0, 0, 0)
    if (startDate.getTime() > today.getTime()) return false

    if (task.recurrence.endDate) {
      const endDate = new Date(task.recurrence.endDate)
      endDate.setHours(0, 0, 0, 0)
      if (endDate.getTime() < today.getTime()) return false
    }

    switch (task.recurrence.type) {
      case "daily":
        return true
      case "weekly":
        return task.recurrence.daysOfWeek?.includes(today.getDay()) ?? false
      case "monthly":
        return task.recurrence.dayOfMonth === today.getDate()
      case "yearly":
        return (
          task.recurrence.monthOfYear === today.getMonth() + 1 &&
          task.recurrence.dayOfMonth === today.getDate()
        )
    }

    return false
  }

  // 🔍 Apply search filter first
  const searchedTasks = tasks.filter(matchesSearch)

  // 📅 Sort all tasks by due date
  const allSortedTasks = [...searchedTasks].sort(
    (a, b) =>
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  )

  // 📌 Today tasks: Due today or recurring today and not completed
  const todayTasks = allSortedTasks.filter((task) => {
    if (task.completed) return false

    const dueDateRaw = safeParseDate(task.dueDate)
    if (!dueDateRaw) return isRecurringToday(task)

    const dueDate = startOfDay(dueDateRaw)
    const today = startOfDay(new Date())

    return dueDate.getTime() === today.getTime() || isRecurringToday(task)
  })

  // 📅 Upcoming tasks: Due after today or future recurrence, and not completed
  const upcomingTasks = allSortedTasks.filter((task) => {
    if (task.completed) return false

    const dueDateRaw = safeParseDate(task.dueDate)
    if (!dueDateRaw) return task.recurrence && !isRecurringToday(task)

    const dueDate = startOfDay(dueDateRaw)
    const today = startOfDay(new Date())

    return isAfter(dueDate, today) || (task.recurrence && !isRecurringToday(task))
  })

  // ✅ Completed tasks
  const completedTasks = allSortedTasks.filter((task) => task.completed)

  return (
    <div className="space-y-4">
      {/* 🔍 Search bar */}
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* 📌 Tabbed task views */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        {/* 🗂 All Tasks */}
        <TabsContent value="all" className="space-y-2">
          {allSortedTasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No tasks found</p>
          ) : (
            allSortedTasks.map((task) => (
              <TaskItem key={task.id} task={task} onEdit={() => onEditTask(task)} />
            ))
          )}
        </TabsContent>

        {/* 📅 Today Tasks */}
        <TabsContent value="today" className="space-y-2">
          {todayTasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No tasks for today</p>
          ) : (
            todayTasks.map((task) => (
              <TaskItem key={task.id} task={task} onEdit={() => onEditTask(task)} />
            ))
          )}
        </TabsContent>

        {/* 🔜 Upcoming Tasks */}
        <TabsContent value="upcoming" className="space-y-2">
          {upcomingTasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No upcoming tasks</p>
          ) : (
            upcomingTasks.map((task) => (
              <TaskItem key={task.id} task={task} onEdit={() => onEditTask(task)} />
            ))
          )}
        </TabsContent>

        {/* ✅ Completed Tasks */}
        <TabsContent value="completed" className="space-y-2">
          {completedTasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No completed tasks</p>
          ) : (
            completedTasks.map((task) => (
              <TaskItem key={task.id} task={task} onEdit={() => onEditTask(task)} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
