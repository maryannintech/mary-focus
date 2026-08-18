import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();
  const [time, setTime] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  );
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      setGreeting("good morning");
    } else if (currentHour < 18) {
      setGreeting("good afternoon");
    } else {
      setGreeting("good evening");
    }
  }, [time]);

  return (
    <header className="text-white flex flex-col sm:flex-row justify-between items-center p-10">
      <p className="text-2xl cursor-pointer" onClick={() => navigate("/")}>
        mary.focus
      </p>
      <p>
        {greeting} | {time}
      </p>
    </header>
  );
}
