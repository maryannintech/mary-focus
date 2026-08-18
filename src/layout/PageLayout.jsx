import { Header } from "../components/Header.jsx";
import { Outlet } from "react-router-dom";

export function PageLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <footer className="bg-(--violet) text-white text-center p-2">
        made by{" "}
        <a
          href="https://github.com/maryannintech"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-white/80"
        >
          maryannintech
        </a>{" "}
        ✦ computer vision powered by teachable machine{" "}
      </footer>
    </>
  );
}
