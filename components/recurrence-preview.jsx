"use client"

import { format, addDays, addWeeks, addMonths, addYears, isSameDay } from "date-fns"
import { Calendar } from "@/components/ui/calendar"

export function RecurrencePreview({ recurrence }) {
  const getRecurrenceText = () => {
    switch (recurrence.type) {
      case "daily":
        return "Every day"
      case "weekly":
        if (recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
          const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
          return `Weekly on ${recurrence.daysOfWeek.map((d) => days[d]).join(", ")}`
        }
        return "Weekly"
      case "monthly":
        if (recurrence.dayOfMonth) {
          return `Monthly on day ${recurrence.dayOfMonth}`
        }
        if (recurrence.weekOfMonth && recurrence.dayOfWeek !== undefined) {
          const weeks = ["first", "second", "third", "fourth", "last"]
          const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
          return `Monthly on the ${weeks[recurrence.weekOfMonth - 1]} ${days[recurrence.dayOfWeek]}`
        }
        return "Monthly"
      case "yearly":
        if (recurrence.monthOfYear && recurrence.dayOfMonth) {
          const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ]
          return `Yearly on ${months[recurrence.monthOfYear - 1]} ${recurrence.dayOfMonth}`
        }
        return "Yearly"
      case "custom":
        if (recurrence.interval && recurrence.intervalUnit) {
          return `Every ${recurrence.interval} ${recurrence.intervalUnit}${recurrence.interval > 1 ? "s" : ""}`
        }
        return "Custom"
      default:
        return "Unknown recurrence pattern"
    }
  }

  const getPreviewDates = () => {
    const dates = []
    const startDate = new Date(recurrence.startDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const previewStart = new Date(Math.max(startDate.getTime(), today.getTime()))
    const maxPreviewDate = addMonths(previewStart, 3)

    switch (recurrence.type) {
      case "daily":
        for (let i = 0; i < 10; i++) {
          const date = addDays(previewStart, i)
          if (date > maxPreviewDate) break
          dates.push(date)
        }
        break

      case "weekly":
        if (recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
          let currentDate = new Date(previewStart)
          while (dates.length < 10) {
            if (recurrence.daysOfWeek.includes(currentDate.getDay())) {
              dates.push(new Date(currentDate))
            }
            currentDate = addDays(currentDate, 1)
            if (currentDate > maxPreviewDate) break
          }
        } else {
          const dayOfWeek = startDate.getDay()
          let currentDate = new Date(previewStart)
          while (currentDate.getDay() !== dayOfWeek) {
            currentDate = addDays(currentDate, 1)
          }
          for (let i = 0; i < 10; i++) {
            if (currentDate > maxPreviewDate) break
            dates.push(new Date(currentDate))
            currentDate = addWeeks(currentDate, 1)
          }
        }
        break

      case "monthly":
        if (recurrence.dayOfMonth) {
          let currentMonth = previewStart.getMonth()
          let currentYear = previewStart.getFullYear()

          for (let i = 0; i < 10; i++) {
            const date = new Date(currentYear, currentMonth, recurrence.dayOfMonth)
            if (date < previewStart) {
              currentMonth++
              if (currentMonth > 11) {
                currentMonth = 0
                currentYear++
              }
              continue
            }
            if (date > maxPreviewDate) break
            dates.push(date)
            currentMonth++
            if (currentMonth > 11) {
              currentMonth = 0
              currentYear++
            }
          }
        } else if (recurrence.weekOfMonth && recurrence.dayOfWeek !== undefined) {
          let currentMonth = previewStart.getMonth()
          let currentYear = previewStart.getFullYear()

          for (let i = 0; i < 10; i++) {
            const date = findNthDayOfMonth(currentYear, currentMonth, recurrence.dayOfWeek, recurrence.weekOfMonth)
            if (date < previewStart) {
              currentMonth++
              if (currentMonth > 11) {
                currentMonth = 0
                currentYear++
              }
              continue
            }
            if (date > maxPreviewDate) break
            dates.push(date)
            currentMonth++
            if (currentMonth > 11) {
              currentMonth = 0
              currentYear++
            }
          }
        }
        break

      case "yearly":
        if (recurrence.monthOfYear && recurrence.dayOfMonth) {
          let currentYear = previewStart.getFullYear()
          for (let i = 0; i < 10; i++) {
            const date = new Date(currentYear, recurrence.monthOfYear - 1, recurrence.dayOfMonth)
            if (date < previewStart) {
              currentYear++
              continue
            }
            if (date > maxPreviewDate) break
            dates.push(date)
            currentYear++
          }
        }
        break

      case "custom":
        if (recurrence.interval && recurrence.intervalUnit) {
          let currentDate = new Date(previewStart)
          for (let i = 0; i < 10; i++) {
            if (i > 0) {
              switch (recurrence.intervalUnit) {
                case "day":
                  currentDate = addDays(currentDate, recurrence.interval)
                  break
                case "week":
                  currentDate = addWeeks(currentDate, recurrence.interval)
                  break
                case "month":
                  currentDate = addMonths(currentDate, recurrence.interval)
                  break
                case "year":
                  currentDate = addYears(currentDate, recurrence.interval)
                  break
              }
            }
            if (currentDate > maxPreviewDate) break
            dates.push(new Date(currentDate))
          }
        }
        break
    }

    return dates
  }

  const findNthDayOfMonth = (year, month, dayOfWeek, n) => {
    const firstDay = new Date(year, month, 1)
    let dayOffset = dayOfWeek - firstDay.getDay()
    if (dayOffset < 0) dayOffset += 7

    if (n === 5) {
      const lastDay = new Date(year, month + 1, 0)
      let day = lastDay.getDate()
      while (new Date(year, month, day).getDay() !== dayOfWeek) {
        day--
      }
      return new Date(year, month, day)
    }

    const day = 1 + dayOffset + (n - 1) * 7
    return new Date(year, month, day)
  }

  const previewDates = getPreviewDates()

  return (
    <div className="space-y-3">
      <p className="text-sm">{getRecurrenceText()}</p>
      <div className="text-xs text-muted-foreground">
        <p>Starts: {format(new Date(recurrence.startDate), "PPP")}</p>
        {recurrence.endDate && <p>Ends: {format(new Date(recurrence.endDate), "PPP")}</p>}
      </div>
      <div className="border rounded-md overflow-hidden">
        <Calendar
          mode="default"
          selected={previewDates}
          disabled={(date) => {
            const startDate = new Date(recurrence.startDate)
            startDate.setHours(0, 0, 0, 0)

            if (date < startDate) return true

            if (recurrence.endDate) {
              const endDate = new Date(recurrence.endDate)
              endDate.setHours(23, 59, 59, 999)
              if (date > endDate) return true
            }

            return !previewDates.some((d) => isSameDay(d, date))
          }}
          className="rounded-md"
        />
      </div>
    </div>
  )
}
