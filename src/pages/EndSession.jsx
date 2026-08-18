import { useState } from "react";
import { useLocation } from "react-router-dom";
import { FormModal } from "../components/FormModal"; // Adjust path as needed

export function EndSession() {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    category = "reviewing",
    task = "review quiz",
    duration = "24:58",
    distractions = "0",
    focusScore = "95%",
    started = "8:00pm",
    date = "july 26, 2026",
    greeting = "good evening | 9:17pm",
  } = location.state || {};

  return (
    <div className="relative min-h-screen bg-[#05081c] text-white flex flex-col justify-between font-mono select-none">
      {/* Main Content Card */}
      <div className="flex flex-col items-center justify-center -mt-6">
        <div className="w-full max-w-xl px-6">
          {/* Subtitle / Header */}
          <div className="mb-6">
            <p className="text-[#8b8cb5] text-sm tracking-wider mb-1 lowercase">
              {date}
            </p>
            <h1 className="text-3xl font-bold text-white tracking-wide">
              nice work, mary ⋆⭒˚.⋆
            </h1>
          </div>

          {/* Time & Category / Task Block */}
          <div className="flex items-center justify-between my-8">
            <div>
              <span className="text-6xl font-bold tracking-wider">
                {duration}
              </span>
              <p className="text-white/70 text-sm mt-1">deep focus</p>
            </div>
            <div className="text-left text-sm flex flex-col gap-1 text-white/90">
              <p>category: {category}</p>
              <p>task: {task}</p>
            </div>
          </div>

          <hr className="border-t border-white/20 my-6" />

          <div className="grid grid-cols-3 text-center mb-10">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-[#8b8cb5] tracking-wider">
                distractions
              </span>
              <span className="text-2xl font-bold">{distractions}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-[#8b8cb5] tracking-wider">
                focus score
              </span>
              <span className="text-2xl font-bold">{focusScore}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-[#8b8cb5] tracking-wider">
                started
              </span>
              <span className="text-2xl font-bold">{started}</span>
            </div>
          </div>

          {/* Action Button & ASCII Bunny */}
          <div className="flex flex-col items-center gap-6 mt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#242442] hover:bg-[#2e2e54] text-[#8b8cb5] hover:text-white transition-all text-lg font-bold py-3.5 px-8 rounded-2xl cursor-pointer tracking-wider"
            >
              ready for another session?
            </button>

            <div className="text-white/60 text-xs font-mono leading-snug whitespace-pre text-center">
              <p> /)/)</p>
              <p>( . .)</p>
              <p>( づ♡</p>
            </div>
          </div>
        </div>
      </div>

      {/* FormModal to start a new session */}
      <FormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
