"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";

export default function CalendarView() {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    getWeekStart(new Date())
  );

  const weekStart = currentWeekStart.getTime();
  const weekEnd = new Date(currentWeekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const tasks = useQuery(api.scheduledTasks.getTasksInRange, {
    startTime: weekStart,
    endTime: weekEnd.getTime(),
  });

  const updateTaskStatus = useMutation(api.scheduledTasks.updateStatus);

  if (!tasks) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-400">Loading calendar...</div>
      </div>
    );
  }

  const weekDays = getWeekDays(currentWeekStart);

  const goToPreviousWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev);
  };

  const goToNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next);
  };

  const goToToday = () => {
    setCurrentWeekStart(getWeekStart(new Date()));
  };

  const handleStatusChange = async (
    taskId: Id<"scheduledTasks">,
    status: string
  ) => {
    await updateTaskStatus({ taskId, status });
  };

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Week of {currentWeekStart.toLocaleDateString()}
          </h2>
          <p className="text-sm text-zinc-400">
            {tasks.length} scheduled task{tasks.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={goToPreviousWeek}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            Today
          </button>
          <button
            onClick={goToNextWeek}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day) => {
          const dayTasks = tasks.filter((task) => {
            const taskDate = new Date(task.scheduledFor);
            return isSameDay(taskDate, day.date);
          });

          const isToday = isSameDay(day.date, new Date());

          return (
            <div
              key={day.dateString}
              className={`bg-zinc-900 border ${
                isToday ? "border-emerald-500" : "border-zinc-800"
              } rounded-lg p-4 min-h-[300px]`}
            >
              <div className="mb-4">
                <div
                  className={`text-sm font-medium ${
                    isToday ? "text-emerald-400" : "text-zinc-400"
                  }`}
                >
                  {day.dayName}
                </div>
                <div
                  className={`text-2xl font-bold ${
                    isToday ? "text-emerald-400" : "text-white"
                  }`}
                >
                  {day.date.getDate()}
                </div>
              </div>

              <div className="space-y-2">
                {dayTasks.length === 0 ? (
                  <div className="text-xs text-zinc-600 text-center py-4">
                    No tasks scheduled
                  </div>
                ) : (
                  dayTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Tasks List */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          📌 All Tasks This Week
        </h3>
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-zinc-400">
              No tasks scheduled for this week
            </div>
          ) : (
            tasks
              .sort((a, b) => a.scheduledFor - b.scheduledFor)
              .map((task) => (
                <TaskRow
                  key={task._id}
                  task={task}
                  onStatusChange={handleStatusChange}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
}

function TaskCard({
  task,
  onStatusChange,
}: {
  task: any;
  onStatusChange: (taskId: Id<"scheduledTasks">, status: string) => void;
}) {
  const time = new Date(task.scheduledFor).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const priorityColors = {
    high: "bg-red-500/20 text-red-400 border-red-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  return (
    <div
      className={`p-2 rounded-lg border text-xs ${
        task.status === "completed"
          ? "bg-zinc-800/50 border-zinc-700 opacity-60"
          : "bg-zinc-800 border-zinc-700 hover:border-zinc-600"
      } transition-colors`}
    >
      <div className="flex items-start justify-between mb-1">
        <span className="font-medium text-white">{time}</span>
        <button
          onClick={() =>
            onStatusChange(
              task._id,
              task.status === "completed" ? "pending" : "completed"
            )
          }
          className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
            task.status === "completed"
              ? "bg-green-500 border-green-500"
              : "border-zinc-600 hover:border-emerald-500"
          }`}
        >
          {task.status === "completed" && <span className="text-white">✓</span>}
        </button>
      </div>

      <div
        className={`font-medium mb-1 ${
          task.status === "completed"
            ? "text-zinc-500 line-through"
            : "text-zinc-200"
        }`}
      >
        {task.title}
      </div>

      <span
        className={`inline-block px-1.5 py-0.5 rounded text-[10px] border ${
          priorityColors[task.priority as keyof typeof priorityColors]
        }`}
      >
        {task.priority}
      </span>
    </div>
  );
}

function TaskRow({
  task,
  onStatusChange,
}: {
  task: any;
  onStatusChange: (taskId: Id<"scheduledTasks">, status: string) => void;
}) {
  const date = new Date(task.scheduledFor);

  const priorityColors = {
    high: "text-red-400",
    medium: "text-yellow-400",
    low: "text-blue-400",
  };

  return (
    <div
      className={`flex items-center gap-4 p-3 rounded-lg ${
        task.status === "completed"
          ? "bg-zinc-800/30"
          : "bg-zinc-800 hover:bg-zinc-700"
      } transition-colors`}
    >
      <button
        onClick={() =>
          onStatusChange(
            task._id,
            task.status === "completed" ? "pending" : "completed"
          )
        }
        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
          task.status === "completed"
            ? "bg-green-500 border-green-500"
            : "border-zinc-600 hover:border-emerald-500"
        }`}
      >
        {task.status === "completed" && (
          <span className="text-white text-sm">✓</span>
        )}
      </button>

      <div className="flex-1">
        <div
          className={`font-medium ${
            task.status === "completed"
              ? "text-zinc-500 line-through"
              : "text-white"
          }`}
        >
          {task.title}
        </div>
        <div className="text-xs text-zinc-400">{task.description}</div>
      </div>

      <div className="text-sm text-zinc-400 flex items-center gap-2">
        <span>
          {date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
        <span>
          {date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })}
        </span>
      </div>

      <span
        className={`text-sm font-medium ${
          priorityColors[task.priority as keyof typeof priorityColors]
        }`}
      >
        {task.priority}
      </span>
    </div>
  );
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // Sunday = 0
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDays(weekStart: Date) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    days.push({
      date,
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      dateString: date.toISOString().split("T")[0],
    });
  }
  return days;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
