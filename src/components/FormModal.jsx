import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function FormModal({ isOpen, onClose }) {
  const [category, setCategory] = useState("");
  const [task, setTask] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const startTime = new Date()
      .toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase()
      .replace(/\s+/g, "");

    navigate("/session", { state: { category, task, startTime } });
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#18181b] border border-white/10 rounded-2xl p-6 w-full max-w-md text-left shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white text-xl cursor-pointer transition-colors"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          what are you focusing on today?
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-white/70">category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-(--violet) transition-colors cursor-pointer"
            >
              <option value="" disabled className="bg-[#18181b] text-white/50">
                select a category
              </option>
              <option value="work" className="bg-[#18181b]">
                Work & Projects
              </option>
              <option value="study" className="bg-[#18181b]">
                Study & Learning
              </option>
              <option value="personal" className="bg-[#18181b]">
                Personal Goals
              </option>
              <option value="creative" className="bg-[#18181b]">
                Creative Writing / Design
              </option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-white/70">task</label>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g., finish chapter 3 draft..."
              required
              className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-(--violet) transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 bg-(--violet)/40 hover:bg-(--violet)/60 text-white font-medium py-3 px-4 rounded-lg cursor-pointer transition-all text-center flex items-center justify-center gap-2 group"
          >
            <span>let's focus</span>
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
