import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isToday, isTomorrow, isYesterday } from "date-fns"

// Utility function to merge class names using clsx and tailwind-merge
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Function to format the given date
export function formatDate(date) {
  if (isToday(date)) {
    return "Today"
  } else if (isTomorrow(date)) {
    return "Tomorrow"
  } else if (isYesterday(date)) {
    return "Yesterday"
  } else {
    return format(date, "MMM d, yyyy")
  }
}
