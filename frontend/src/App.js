import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import OrganizationRequest from "./pages/OrganizationRequest";
import SupportLogin from "./pages/SupportLogin";
import SupportDashboard from "./pages/SupportDashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("supportToken")
  );

  return (
    <Router>
      <Routes>

        <Route path="/" element={<OrganizationRequest />} />

        <Route
          path="/support/login"
          element={<SupportLogin setIsLoggedIn={setIsLoggedIn} />}
        />

        <Route
          path="/support/dashboard"
          element={
            isLoggedIn ? (
              <SupportDashboard />
            ) : (
              <Navigate to="/support/login" />
            )
          }
        />

      </Routes>
    </Router>
  );
}

export default App;