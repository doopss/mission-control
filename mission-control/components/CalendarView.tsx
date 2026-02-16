"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Id } from "@/convex/_generated/dataModel";
import CardDetailModal, { CardData } from "./CardDetailModal";

// Convert task data to CardData for the modal
function taskToCardData(task: any): CardData {
  return {
    id: task._id,
    type: "task",
    title: task.title,
    description: task.description || "",
    category: task.category,
    timestamp: task._creationTime || task.scheduledFor,
    status: task.status,
    priority: task.priority,
    relatedFiles: task.relatedFiles,
    tags: task.tags,
    scheduledFor: task.scheduledFor,
    metadata: task.metadata,
  };
}

export default function CalendarView() {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    getWeekStart(new Date())
  );
  const [selectedTask, setSelectedTask] = useState<CardData | null>(null);

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
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#00D4AA] border-t-transparent rounded-full animate-spin" />
          <div className="text-[#9CA3AF]">Loading calendar...</div>
        </div>
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
      {/* Detail Modal */}
      {selectedTask && (
        <CardDetailModal
          card={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {/* Header with Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">📅</span>
            Week of {currentWeekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </h2>
          <p className="text-sm text-[#9CA3AF] mt-1">
            {tasks.length} scheduled task{tasks.length !== 1 ? "s" : ""} this week
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={goToPreviousWeek}
            className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#2D2D2D] text-white rounded-lg transition-colors border border-[#2D2D2D]"
          >
            ← Prev
          </button>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-[#00D4AA] hover:bg-[#00B894] text-[#0D0D0D] rounded-lg transition-colors font-semibold"
          >
            Today
          </button>
          <button
            onClick={goToNextWeek}
            className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#2D2D2D] text-white rounded-lg transition-colors border border-[#2D2D2D]"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-3">
        {weekDays.map((day, index) => {
          const dayTasks = tasks.filter((task) => {
            const taskDate = new Date(task.scheduledFor);
            return isSameDay(taskDate, day.date);
          });

          const isToday = isSameDay(day.date, new Date());

          return (
            <motion.div
              key={day.dateString}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-[#1A1A1A] border rounded-xl p-4 min-h-[300px] ${
                isToday ? "border-[#00D4AA] shadow-lg shadow-[#00D4AA]/10" : "border-[#2D2D2D]"
              }`}
            >
              <div className="mb-4">
                <div
                  className={`text-xs font-medium uppercase tracking-wide ${
                    isToday ? "text-[#00D4AA]" : "text-[#6B7280]"
                  }`}
                >
                  {day.dayName}
                </div>
                <div
                  className={`text-2xl font-bold ${
                    isToday ? "text-[#00D4AA]" : "text-white"
                  }`}
                >
                  {day.date.getDate()}
                </div>
              </div>

              <div className="space-y-2">
                {dayTasks.length === 0 ? (
                  <div className="text-xs text-[#6B7280] text-center py-4 opacity-50">
                    No tasks
                  </div>
                ) : (
                  dayTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onClick={() => setSelectedTask(taskToCardData(task))}
                    />
                  ))
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Upcoming Tasks List */}
      <div className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          📌 All Tasks This Week
          <span className="ml-2 px-2 py-0.5 bg-[#00D4AA]/20 text-[#00D4AA] text-xs rounded-full">
            {tasks.length}
          </span>
        </h3>
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-[#6B7280]">
              <div className="text-4xl mb-2">📭</div>
              No tasks scheduled for this week
            </div>
          ) : (
            tasks
              .sort((a, b) => a.scheduledFor - b.scheduledFor)
              .map((task, index) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <TaskRow
                    task={task}
                    onStatusChange={handleStatusChange}
                    onClick={() => setSelectedTask(taskToCardData(task))}
                  />
                </motion.div>
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
  onClick,
}: {
  task: any;
  onStatusChange: (taskId: Id<"scheduledTasks">, status: string) => void;
  onClick: () => void;
}) {
  const time = new Date(task.scheduledFor).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const priorityColors = {
    high: "bg-[#FF6B4A]/20 text-[#FF6B4A]",
    medium: "bg-[#FFD93D]/20 text-[#FFD93D]",
    low: "bg-[#3B82F6]/20 text-[#3B82F6]",
  };

  return (
    <div
      onClick={onClick}
      className={`p-2 rounded-lg text-xs cursor-pointer transition-colors ${
        task.status === "completed"
          ? "bg-[#0D0D0D] border border-[#2D2D2D] opacity-60"
          : "bg-[#0D0D0D] border border-[#2D2D2D] hover:border-[#3D3D3D]"
      }`}
    >
      <div className="flex items-start justify-between mb-1">
        <span className="font-medium text-[#9CA3AF]">{time}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange(
              task._id,
              task.status === "completed" ? "pending" : "completed"
            );
          }}
          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
            task.status === "completed"
              ? "bg-[#4ADE80] border-[#4ADE80]"
              : "border-[#3D3D3D] hover:border-[#00D4AA]"
          }`}
        >
          {task.status === "completed" && <span className="text-white text-[10px]">✓</span>}
        </button>
      </div>

      <div
        className={`font-medium mb-1 leading-snug ${
          task.status === "completed"
            ? "text-[#6B7280] line-through"
            : "text-white"
        }`}
      >
        {task.title}
      </div>

      <span
        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${
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
  onClick,
}: {
  task: any;
  onStatusChange: (taskId: Id<"scheduledTasks">, status: string) => void;
  onClick: () => void;
}) {
  const date = new Date(task.scheduledFor);

  const priorityColors = {
    high: "text-[#FF6B4A]",
    medium: "text-[#FFD93D]",
    low: "text-[#3B82F6]",
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
        task.status === "completed"
          ? "bg-[#0D0D0D] opacity-60"
          : "bg-[#0D0D0D] hover:bg-[#2D2D2D]"
      }`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onStatusChange(
            task._id,
            task.status === "completed" ? "pending" : "completed"
          );
        }}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          task.status === "completed"
            ? "bg-[#4ADE80] border-[#4ADE80]"
            : "border-[#3D3D3D] hover:border-[#00D4AA]"
        }`}
      >
        {task.status === "completed" && (
          <span className="text-white text-sm">✓</span>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div
          className={`font-medium truncate ${
            task.status === "completed"
              ? "text-[#6B7280] line-through"
              : "text-white"
          }`}
        >
          {task.title}
        </div>
        <div className="text-xs text-[#6B7280] truncate">{task.description}</div>
      </div>

      <div className="text-sm text-[#9CA3AF] flex items-center gap-2 flex-shrink-0">
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
        className={`text-sm font-medium capitalize flex-shrink-0 ${
          priorityColors[task.priority as keyof typeof priorityColors]
        }`}
      >
        {task.priority}
      </span>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="text-xs text-[#00D4AA] hover:text-[#00B894] hover:underline flex-shrink-0"
      >
        Details →
      </button>
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
