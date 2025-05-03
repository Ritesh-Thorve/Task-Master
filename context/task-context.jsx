'use client'

import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"

// Create context for managing tasks
const TaskContext = createContext(undefined)

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([])

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch (error) {
        console.error("Failed to parse saved tasks:", error)
      }
    } else {
      // Set some example tasks if none exist
      const exampleTasks = [
        {
          id: "1",
          title: "Complete project proposal",
          description: "Finish the draft and send it to the team for review",
          dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
          completed: false,
        },
        {
          id: "2",
          title: "Weekly team meeting",
          description: "Discuss project progress and next steps",
          dueDate: new Date(),
          completed: false,
          recurrence: {
            type: "weekly",
            daysOfWeek: [1], // Monday
            startDate: new Date(),
          },
        },
        {
          id: "3",
          title: "Pay rent",
          description: "Transfer money to landlord",
          dueDate: new Date(new Date().setDate(1)), // 1st of current month
          completed: true,
          recurrence: {
            type: "monthly",
            dayOfMonth: 1,
            startDate: new Date(new Date().setDate(1)),
          },
        },
      ]
      setTasks(exampleTasks)
      localStorage.setItem("tasks", JSON.stringify(exampleTasks))
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      completed: false,
    }
    setTasks((prevTasks) => [...prevTasks, newTask])

    toast({
      title: "Task created",
      description: `"${task.title}" has been added to your tasks.`,
    })
  }

  const updateTask = (updatedTask) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))

    toast({
      title: "Task updated",
      description: `"${updatedTask.title}" has been updated.`,
    })
  }

  const deleteTask = (id) => {
    const taskToDelete = tasks.find((task) => task.id === id)
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))

    if (taskToDelete) {
      toast({
        title: "Task deleted",
        description: `"${taskToDelete.title}" has been removed.`,
        variant: "destructive",
      })
    }
  }

  return <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>{children}</TaskContext.Provider>
}

// Custom hook to use TaskContext
export function useTask() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider")
  }
  return context
}
