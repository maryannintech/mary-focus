import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ConfirmModal } from "../components/ConfirmModal";
import { DistractionCamera } from "../components/DistractionCamera";
import breakWaitingAudio from ".././assets/break_waiting_audio.ogg";
import focusEndAudio from ".././assets/focus_end_audio.ogg";
import breakEndAudio from ".././assets/break_end_audio.ogg";

const FOCUS_END_CHIME = focusEndAudio;
const BREAK_END_CHIME = breakEndAudio;
const BREAK_BGM_SOUND = breakWaitingAudio;

export function Session() {
  const location = useLocation();
  const navigate = useNavigate();
  const { category, task, startTime } = location.state || {};

  const FOCUS_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(true);
  const [isBreak, setIsBreak] = useState(false);
  const [isWaitingForBreak, setIsWaitingForBreak] = useState(false); 
  const [isWaitingForFocus, setIsWaitingForFocus] = useState(false); 
  const [isMuted, setIsMuted] = useState(false);
  const [distractions, setDistractions] = useState(0);
  const [focusStreak, setFocusStreak] = useState(0); 
  const [currentSession, setCurrentSession] = useState(1);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const totalSessions = 4;

  // background & alarm audio refs
  const breakAudioRef = useRef(null);
  const focusEndAudioRef = useRef(null);
  const breakEndAudioRef = useRef(null);

  // initialize and clean up break audio, focus-end alarm, and break-end alarm
  useEffect(() => {
    breakAudioRef.current = new Audio(BREAK_BGM_SOUND);
    breakAudioRef.current.loop = true;

    focusEndAudioRef.current = new Audio(FOCUS_END_CHIME);
    focusEndAudioRef.current.loop = true;

    breakEndAudioRef.current = new Audio(BREAK_END_CHIME);
    breakEndAudioRef.current.loop = true;

    return () => {
      if (breakAudioRef.current) {
        breakAudioRef.current.pause();
        breakAudioRef.current = null;
      }
      if (focusEndAudioRef.current) {
        focusEndAudioRef.current.pause();
        focusEndAudioRef.current = null;
      }
      if (breakEndAudioRef.current) {
        breakEndAudioRef.current.pause();
        breakEndAudioRef.current = null;
      }
    };
  }, []);

  // handle focus end looping alarm
  useEffect(() => {
    if (!focusEndAudioRef.current) return;

    focusEndAudioRef.current.muted = isMuted;

    if (isWaitingForBreak && !isMuted) {
      focusEndAudioRef.current
        .play()
        .catch((err) => console.error("Focus end alarm error:", err));
    } else {
      focusEndAudioRef.current.pause();
      focusEndAudioRef.current.currentTime = 0;
    }
  }, [isWaitingForBreak, isMuted]);

  // handle break end looping alarm
  useEffect(() => {
    if (!breakEndAudioRef.current) return;

    breakEndAudioRef.current.muted = isMuted;

    if (isWaitingForFocus && !isMuted) {
      breakEndAudioRef.current
        .play()
        .catch((err) => console.error("Break end alarm error:", err));
    } else {
      breakEndAudioRef.current.pause();
      breakEndAudioRef.current.currentTime = 0;
    }
  }, [isWaitingForFocus, isMuted]);

  // handle break BGM playback
  useEffect(() => {
    if (!breakAudioRef.current) return;

    breakAudioRef.current.muted = isMuted;

    if (isBreak && isActive && !isMuted) {
      breakAudioRef.current
        .play()
        .catch((err) => console.error("Break Audio error:", err));
    } else {
      breakAudioRef.current.pause();
    }
  }, [isBreak, isActive, isMuted]);

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (!isBreak && !isWaitingForBreak && !isWaitingForFocus) {
        setIsActive(false);
        setIsWaitingForBreak(true);

        if (currentSession === totalSessions) {
          setFocusStreak((prev) => prev + 1);
        }
      } else if (isBreak && !isWaitingForFocus) {
        setIsActive(false);
        setIsBreak(false);
        setIsWaitingForFocus(true);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isActive,
    timeLeft,
    isBreak,
    isWaitingForBreak,
    isWaitingForFocus,
    currentSession,
    isMuted,
  ]);

  const startBreakManually = () => {
    if (focusEndAudioRef.current) {
      focusEndAudioRef.current.pause();
      focusEndAudioRef.current.currentTime = 0;
    }
    setIsWaitingForBreak(false);
    setIsBreak(true);
    setTimeLeft(BREAK_TIME);
    setIsActive(true);
  };

  const startFocusManually = () => {
    if (breakEndAudioRef.current) {
      breakEndAudioRef.current.pause();
      breakEndAudioRef.current.currentTime = 0;
    }
    setIsWaitingForFocus(false);
    setCurrentSession((prev) => (prev < totalSessions ? prev + 1 : 1));
    setTimeLeft(FOCUS_TIME);
    setIsActive(true);
  };

  const toggleTimer = () => {
    setIsActive((prev) => !prev);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleDistraction = () => {
    if (isActive && !isBreak && !isWaitingForBreak && !isWaitingForFocus) {
      setDistractions((prev) => prev + 1);
    }
  };

  const handleEndSession = () => {
    if (focusEndAudioRef.current) {
      focusEndAudioRef.current.pause();
      focusEndAudioRef.current.currentTime = 0;
    }
    if (breakEndAudioRef.current) {
      breakEndAudioRef.current.pause();
      breakEndAudioRef.current.currentTime = 0;
    }
    if (breakAudioRef.current) {
      breakAudioRef.current.pause();
      breakAudioRef.current.currentTime = 0;
    }

    const completedFocusSeconds = (currentSession - 1) * FOCUS_TIME;
    const currentSessionFocusSeconds = isBreak
      ? FOCUS_TIME
      : FOCUS_TIME - timeLeft;
    const totalFocusSeconds =
      completedFocusSeconds + currentSessionFocusSeconds;

    const formatTotalDuration = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    const calculatedScore = Math.max(0, 100 - distractions * 5);

    const now = new Date();
    const currentHour = now.getHours();
    const timeGreeting =
      currentHour < 12
        ? "good morning"
        : currentHour < 18
          ? "good afternoon"
          : "good evening";
    const formattedLiveTime = now
      .toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();

    setIsEndModalOpen(false);
    navigate("/end-session", {
      state: {
        category,
        task,
        duration: formatTotalDuration(totalFocusSeconds),
        started: startTime || "8:00pm",
        distractions: String(distractions),
        focusScore: `${calculatedScore}%`,
        date: now
          .toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
          .toLowerCase(),
        greeting: `${timeGreeting} | ${formattedLiveTime}`,
      },
    });
  };

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const star = `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣀⣀⣟⣦⣤⡄⠀⠀⠀⠀⠀⠀⣶⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣰⡿⠻⢧⠀⠀⠀⠀⠀⢐⠃⢭⠀⠀⠀⠀⠀⠀⠀⢀⠤⠤⠤⢄⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡲⠀⠀⣹⠀⠀⠀⠀⠀⠀⡴⠃⠀⣀⣀⡀⠙⢆⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠴⠁⠀⠀⠀⠇⠀⠀⠀⠀⠀⡎⠀⢰⠃⣀⣸⠀⠀⡇⠀⠀⠀⠀⠀⠀
⠐⣶⠒⠒⠴⠴⠴⠴⠶⠋⠁⠀⠀⠀⠀⠘⣖⠄⠀⠀⢸⠀⠀⠳⣄⣀⣀⡠⠇⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠳⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⠈⠢⡑⠄⢌⢦⡀⠀⠀⠀⠀⢠⠖⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠙⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠢⣌⠂⠫⡉⠑⠚⠁⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠠⡷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⡀⡀⣀⣄⠤⠴⠟⠘⠃⠀⠀⠀⠸⡆⣀⣤⠀⠀⠀
⠀⠀⢀⣴⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⢘⡏⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⣿⣿⠁⠀⠀⠀
⢀⣴⠟⠀⠀⠀⠀⡠⢄⣖⣒⢦⠀⠀⠀⠀⠀⠗⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣄⠀⠘⠃⠘⠂⠀⠀⠀
⠛⠛⠛⠉⠉⠉⠉⠉⠁⠀⠀⠀⠓⣄⠀⠀⠌⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⡟⢩⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣀⠤⠤⠤⠤⡄⠀⠀⠀⠀⠀⠀⠀⠙⠦⡨⡇⠀⠀⠀⠀⠀⠀⠀⠀⠠⡏⠀⠸⡄⠀⠀⠀⠀⠀
⠀⡜⠁⠀⡤⠤⢤⠙⡆⠀⠀⢀⡀⠀⠀⠀⠀⢹⠛⠀⠀⠀⠀⠐⢖⡒⠊⠉⠀⠀⠀⠀⠁⠐⢒⠞⠃
⠀⡇⠀⠀⢇⣉⣉⡜⠁⠀⠀⡞⠱⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⡦⠀⠀⠀⠀⠀⠀⢸⠁⠀
⠀⠳⣄⠀⠀⠀⠀⠀⢀⡠⠤⠇⠀⠉⠉⢩⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⢀⠇⠀⡤⠞⠣⢀⠀⠇⠀⠀
⠀⠀⠀⠉⠉⠉⠁⠀⠀⠈⡇⢀⠖⠢⣀⠸⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠯⠊⠁⠀⠀⠀⠀⠈⠪⠆⠀⠀
  `.trim();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      {!location.state ? (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <pre className="whitespace-pre leading-tight select-none text-sm text-(--violet)">
            {star}
          </pre>
          <p className="text-xl text-white">
            no session data found. please go back and start a session
          </p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-16">
          <div className="flex flex-col items-center justify-center gap-6">
            <DistractionCamera
              isActive={isActive}
              isBreak={isBreak}
              isWaiting={isWaitingForBreak || isWaitingForFocus}
              isMuted={isMuted}
              onDistractionDetected={handleDistraction}
            />

            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <p className="text-2xl font-bold">one step at a time</p>
              <p className="text-(--violet) font-semibold">task: {task}</p>
              <button
                type="button"
                onClick={() => setIsEndModalOpen(true)}
                className="bg-(--violet)/30 text-(--violet) font-semibold py-2 px-6 rounded-lg cursor-pointer hover:bg-(--violet)/40 transition-all text-lg mt-2"
              >
                end session
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6 min-w-[340px]">
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <p className="text-(--violet) font-mono text-md font-bold tracking-wider lowercase">
                  {isBreak
                    ? "take a break"
                    : isWaitingForBreak
                      ? "session complete"
                      : isWaitingForFocus
                        ? "break complete"
                        : "focus"}
                </p>
                <button
                  type="button"
                  onClick={toggleMute}
                  className="bg-(--violet)/20 hover:bg-(--violet)/30 text-(--violet) font-mono text-xs px-3 py-1 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 border border-(--violet)/30"
                >
                  {isMuted ? "🔇" : "🔊"}
                </button>
              </div>

              <p className="text-2xl font-mono font-bold mt-1">
                {isBreak
                  ? "break time 𑣲₍ ᐢ. .ᐢ₎"
                  : isWaitingForBreak
                    ? "ready for break? ⊹ ˖ Ი𐑼"
                    : isWaitingForFocus
                      ? "ready to focus? ₍ᐢ.  ̫  .ᐢ₎"
                      : `category: ${category} **°.*`}
              </p>
            </div>

            <div className="flex items-center justify-between gap-8 mt-2 text-center">
              <div className="flex flex-col">
                <span className="text-6xl font-bold font-mono tracking-wider">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-(--violet) font-mono text-sm mt-1">
                  {isBreak
                    ? "rest & hydrate"
                    : isWaitingForBreak
                      ? "time for a break"
                      : isWaitingForFocus
                        ? "break over"
                        : `session ${currentSession}/${totalSessions}`}
                </span>
              </div>

              {isWaitingForBreak ? (
                <button
                  type="button"
                  onClick={startBreakManually}
                  className="bg-(--violet) text-white font-mono font-semibold px-6 py-2 rounded-xl cursor-pointer hover:bg-(--violet)/80 transition-all text-base self-center"
                >
                  start break
                </button>
              ) : isWaitingForFocus ? (
                <button
                  type="button"
                  onClick={startFocusManually}
                  className="bg-(--violet) text-white font-mono font-semibold px-6 py-2 rounded-xl cursor-pointer hover:bg-(--violet)/80 transition-all text-base self-center"
                >
                  start session
                </button>
              ) : (
                <button
                  type="button"
                  onClick={toggleTimer}
                  className="bg-(--violet)/30 text-(--violet) font-mono font-semibold px-6 py-2 rounded-xl cursor-pointer hover:bg-(--violet)/40 transition-all text-base self-center"
                >
                  {isActive ? "pause" : "resume"}
                </button>
              )}
            </div>

            <hr className="border-white/20 w-full my-2" />

            <div className="flex items-center justify-between text-center font-mono pb-20">
              <div className="flex flex-col gap-1">
                <p className="text-xs text-(--violet) lowercase tracking-wider">
                  distractions
                </p>
                <p className="text-2xl font-bold">{distractions}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-(--violet) lowercase tracking-wider">
                  focus streak
                </p>
                <p className="text-2xl font-bold">{focusStreak}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-(--violet) lowercase tracking-wider">
                  started
                </p>
                <p className="text-2xl font-bold">{startTime || "0:00"}</p>
              </div>
            </div>
          </div>

          <ConfirmModal
            isOpen={isEndModalOpen}
            onClose={() => setIsEndModalOpen(false)}
            onConfirm={handleEndSession}
          />
        </div>
      )}
    </div>
  );
}