"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RecurrencePreview } from "@/components/recurrence-preview";

/**
 * @typedef {Object} RecurrenceFormProps
 * @property {import('@/types/task').RecurrencePattern | null} initialRecurrence
 * @property {(recurrence: import('@/types/task').RecurrencePattern | null) => void} onSave
 * @property {() => void} onCancel
 */

/**
 * Recurrence form component
 * @param {RecurrenceFormProps} props
 */
export function RecurrenceForm({ initialRecurrence, onSave, onCancel }) {
  const [recurrenceType, setRecurrenceType] = useState("none");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState();
  const [interval, setInterval] = useState(1);
  const [intervalUnit, setIntervalUnit] = useState("day");
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [weekOfMonth, setWeekOfMonth] = useState(1);
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [monthOfYear, setMonthOfYear] = useState(1);
  const [previewRecurrence, setPreviewRecurrence] = useState(null);

  useEffect(() => {
    if (initialRecurrence) {
      setRecurrenceType(initialRecurrence.type);
      setStartDate(new Date(initialRecurrence.startDate));
      setEndDate(initialRecurrence.endDate ? new Date(initialRecurrence.endDate) : undefined);

      if (initialRecurrence.interval) setInterval(initialRecurrence.interval);
      if (initialRecurrence.intervalUnit) setIntervalUnit(initialRecurrence.intervalUnit);
      if (initialRecurrence.daysOfWeek) setDaysOfWeek(initialRecurrence.daysOfWeek);
      if (initialRecurrence.dayOfMonth) setDayOfMonth(initialRecurrence.dayOfMonth);
      if (initialRecurrence.weekOfMonth) setWeekOfMonth(initialRecurrence.weekOfMonth);
      if (initialRecurrence.dayOfWeek !== undefined) setDayOfWeek(initialRecurrence.dayOfWeek);
      if (initialRecurrence.monthOfYear) setMonthOfYear(initialRecurrence.monthOfYear);
    } else {
      setRecurrenceType("none");
      setStartDate(new Date());
      setEndDate(undefined);
      setInterval(1);
      setIntervalUnit("day");
      setDaysOfWeek([]);
      setDayOfMonth(1);
      setWeekOfMonth(1);
      setDayOfWeek(1);
      setMonthOfYear(1);
    }
  }, [initialRecurrence]);

  useEffect(() => {
    updatePreview();
  }, [
    recurrenceType,
    startDate,
    endDate,
    interval,
    intervalUnit,
    daysOfWeek,
    dayOfMonth,
    weekOfMonth,
    dayOfWeek,
    monthOfYear,
  ]);

  const updatePreview = () => {
    if (recurrenceType === "none") {
      setPreviewRecurrence(null);
      return;
    }

    const newRecurrence = {
      type: recurrenceType,
      startDate: startDate || new Date(),
      endDate: endDate,
    };

    if (recurrenceType === "custom") {
      newRecurrence.interval = interval;
      newRecurrence.intervalUnit = intervalUnit;
    }

    if (recurrenceType === "weekly") {
      newRecurrence.daysOfWeek = daysOfWeek.length ? daysOfWeek : [new Date().getDay()];
    }

    if (recurrenceType === "monthly") {
      if (dayOfMonth) {
        newRecurrence.dayOfMonth = dayOfMonth;
      } else {
        newRecurrence.weekOfMonth = weekOfMonth;
        newRecurrence.dayOfWeek = dayOfWeek;
      }
    }

    if (recurrenceType === "yearly") {
      newRecurrence.monthOfYear = monthOfYear;
      newRecurrence.dayOfMonth = dayOfMonth;
    }

    setPreviewRecurrence(newRecurrence);
  };

  const handleSave = () => {
    onSave(previewRecurrence);
  };

  const handleToggleDay = (day) => {
    setDaysOfWeek((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()));
  };

  return (
    <div className="space-y-4 border rounded-md p-4">
      <div className="space-y-2">
        <Label htmlFor="recurrenceType">Repeat</Label>
        <Select value={recurrenceType} onValueChange={setRecurrenceType}>
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Don't repeat</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {recurrenceType !== "none" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "No end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <div className="p-2">
                    <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => setEndDate(undefined)}>
                      No end date
                    </Button>
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => date < (startDate || new Date())}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {recurrenceType === "custom" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="interval">Repeat every</Label>
                <div className="flex gap-2">
                  <Input
                    id="interval"
                    type="number"
                    min={1}
                    value={interval}
                    onChange={(e) => setInterval(Number.parseInt(e.target.value) || 1)}
                    className="w-20"
                  />
                  <Select value={intervalUnit} onValueChange={setIntervalUnit}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day(s)</SelectItem>
                      <SelectItem value="week">Week(s)</SelectItem>
                      <SelectItem value="month">Month(s)</SelectItem>
                      <SelectItem value="year">Year(s)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {recurrenceType === "weekly" && (
            <div className="space-y-2">
              <Label>Repeat on</Label>
              <div className="flex flex-wrap gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${index}`}
                      checked={daysOfWeek.includes(index)}
                      onCheckedChange={() => handleToggleDay(index)}
                    />
                    <label
                      htmlFor={`day-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {day}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recurrenceType === "monthly" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Repeat by</Label>
                <Select
                  value={dayOfMonth ? "day" : "week"}
                  onValueChange={(value) => {
                    if (value === "day") {
                      setDayOfMonth(new Date().getDate());
                    } else {
                      setDayOfMonth(0);
                      setWeekOfMonth(Math.ceil(new Date().getDate() / 7));
                      setDayOfWeek(new Date().getDay());
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day of month</SelectItem>
                    <SelectItem value="week">Day of week</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {dayOfMonth > 0 ? (
                <div className="space-y-2">
                  <Label htmlFor="dayOfMonth">Day of month</Label>
                  <Select
                    value={dayOfMonth.toString()}
                    onValueChange={(value) => setDayOfMonth(Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weekOfMonth">Week of month</Label>
                    <Select
                      value={weekOfMonth.toString()}
                      onValueChange={(value) => setWeekOfMonth(Number.parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">First</SelectItem>
                        <SelectItem value="2">Second</SelectItem>
                        <SelectItem value="3">Third</SelectItem>
                        <SelectItem value="4">Fourth</SelectItem>
                        <SelectItem value="5">Last</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dayOfWeek">Day of week</Label>
                    <Select
                      value={dayOfWeek.toString()}
                      onValueChange={(value) => setDayOfWeek(Number.parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Sunday</SelectItem>
                        <SelectItem value="1">Monday</SelectItem>
                        <SelectItem value="2">Tuesday</SelectItem>
                        <SelectItem value="3">Wednesday</SelectItem>
                        <SelectItem value="4">Thursday</SelectItem>
                        <SelectItem value="5">Friday</SelectItem>
                        <SelectItem value="6">Saturday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          )}

          {recurrenceType === "yearly" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthOfYear">Month</Label>
                <Select
                  value={monthOfYear.toString()}
                  onValueChange={(value) => setMonthOfYear(Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">January</SelectItem>
                    <SelectItem value="2">February</SelectItem>
                    <SelectItem value="3">March</SelectItem>
                    <SelectItem value="4">April</SelectItem>
                    <SelectItem value="5">May</SelectItem>
                    <SelectItem value="6">June</SelectItem>
                    <SelectItem value="7">July</SelectItem>
                    <SelectItem value="8">August</SelectItem>
                    <SelectItem value="9">September</SelectItem>
                    <SelectItem value="10">October</SelectItem>
                    <SelectItem value="11">November</SelectItem>
                    <SelectItem value="12">December</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dayOfMonth">Day</Label>
                <Select value={dayOfMonth.toString()} onValueChange={(value) => setDayOfMonth(Number.parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {previewRecurrence && (
            <div className="border rounded-md p-3 bg-muted/50">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <RecurrencePreview recurrence={previewRecurrence} />
            </div>
          )}
        </>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSave}>
          {initialRecurrence ? "Update" : "Add"} Recurrence
        </Button>
      </div>
    </div>
  );
}