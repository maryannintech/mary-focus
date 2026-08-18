import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormModal } from "../components/FormModal";

export function WelcomeScreen() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative text-white text-center flex flex-col gap-5 items-center justify-center h-dvh">
      <p className="text-3xl animate-float-1">
        planning to do something that requires focus?
      </p>

      <p className="text-2xl animate-float-2">
        let's make some progress together, mary
      </p>

      <div className="text-(--violet) text-2xl mt-4 animate-bunny-float font-mono leading-tight whitespace-pre">
        <p> /)/)</p>
        <p> ( ᴗ͈ ᴗ͈)</p>
        <p> c( づ★‧₊˚⋆</p>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="bg-(--violet)/30 text-white py-2 px-6 rounded-lg cursor-pointer hover:bg-(--violet)/40 transition-all animate-float-3 font-medium"
      >
        get started
      </button>

      <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
