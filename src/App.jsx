import { Routes, Route } from "react-router-dom";
import { WelcomeScreen } from "./pages/WelcomeScreen";
import { PageLayout } from "./layout/PageLayout";
import { Session } from "./pages/Session";
import { EndSession } from "./pages/EndSession";

function App() {
  return (
    <>
      <Routes>
        <Route element={<PageLayout />}>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/session" element={<Session />} />
          <Route path="/end-session" element={<EndSession />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
