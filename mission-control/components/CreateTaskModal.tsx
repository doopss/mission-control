"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { id: "development", label: "Development", color: "#00D4AA" },
  { id: "research", label: "Research", color: "#A855F7" },
  { id: "communication", label: "Communication", color: "#4ADE80" },
  { id: "analysis", label: "Analysis", color: "#FFD93D" },
  { id: "documentation", label: "Documentation", color: "#EC4899" },
  { id: "planning", label: "Planning", color: "#3B82F6" },
  { id: "design", label: "Design", color: "#F97316" },
  { id: "testing", label: "Testing", color: "#EF4444" },
];

const priorities = [
  { id: "high", label: "High", color: "#FF6B4A" },
  { id: "medium", label: "Medium", color: "#FFD93D" },
  { id: "low", label: "Low", color: "#3B82F6" },
];

const columns = [
  { id: "backlog", label: "Backlog" },
  { id: "blocked", label: "Blocked" },
  { id: "now", label: "In Progress" },
  { id: "done", label: "Completed" },
];

export default function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("development");
  const [priority, setPriority] = useState("medium");
  const [column, setColumn] = useState("backlog");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createTask = useMutation(api.kanban.createTask);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        column: column as "backlog" | "blocked" | "now" | "next" | "done",
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setCategory("development");
      setPriority("medium");
      setColumn("backlog");
      onClose();
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
          >
            <div className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D2D2D]">
                <h2 className="text-lg font-semibold text-white">Create New Task</h2>
                <button
                  onClick={onClose}
                  className="text-[#9CA3AF] hover:text-white transition-colors p-1 hover:bg-[#2D2D2D] rounded"
                >
                  ✕
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title..."
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2D2D2D] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:border-[#00D4AA] transition-colors"
                    autoFocus
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description..."
                    rows={3}
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2D2D2D] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:border-[#00D4AA] transition-colors resize-none"
                  />
                </div>

                {/* Category & Priority Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2D2D2D] rounded-lg text-white focus:outline-none focus:border-[#00D4AA] transition-colors appearance-none cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                      Priority
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2D2D2D] rounded-lg text-white focus:outline-none focus:border-[#00D4AA] transition-colors appearance-none cursor-pointer"
                    >
                      {priorities.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Column */}
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                    Column
                  </label>
                  <select
                    value={column}
                    onChange={(e) => setColumn(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2D2D2D] rounded-lg text-white focus:outline-none focus:border-[#00D4AA] transition-colors appearance-none cursor-pointer"
                  >
                    {columns.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 text-[#9CA3AF] hover:text-white bg-[#2D2D2D] hover:bg-[#3D3D3D] rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !title.trim()}
                    className="px-5 py-2.5 bg-[#00D4AA] hover:bg-[#00B894] text-[#0D0D0D] rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Creating..." : "Create Task"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
