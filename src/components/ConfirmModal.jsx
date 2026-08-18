export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "end session?",
  description = "are you sure you want to end this session? your current progress will be lost.",
  confirmText = "yes, end session",
  cancelText = "cancel",
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#18181b] border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl relative flex flex-col gap-4 font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="text-sm text-white/60 font-sans leading-relaxed">
          {description}
        </p>

        <div className="flex gap-3 mt-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-white/10 hover:bg-white/5 text-white/80 text-sm font-semibold transition-all cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-semibold transition-all cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
