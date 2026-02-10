import { useState } from "react";
import SupportLogin from "./pages/SupportLogin";
import SupportDashboard from "./pages/SupportDashboard";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("supportToken")
  );

  return loggedIn ? (
    <SupportDashboard />
  ) : (
    <SupportLogin onLogin={() => setLoggedIn(true)} />
  );
}

export default App;
