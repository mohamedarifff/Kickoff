import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";

import OrganizationRequest from "./pages/OrganizationRequest";

import SupportLogin from "./pages/SupportLogin";
import SupportDashboard from "./pages/SupportDashboard";

import OrganizationLogin from "./pages/OrganizationLogin";
import ChangePassword from "./pages/ChangePassword";
import OrganizationDashboard from "./pages/OrganizationDashboard";

function App() {
  // Support login state
  const [supportLoggedIn, setSupportLoggedIn] = useState(
    !!localStorage.getItem("supportToken")
  );

  // Organization login state
  const [orgLoggedIn, setOrgLoggedIn] = useState(
    !!localStorage.getItem("orgToken")
  );

  return (
    <Router>
      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<OrganizationRequest />} />

        {/* ================= SUPPORT ================= */}
        <Route
          path="/support/login"
          element={<SupportLogin setIsLoggedIn={setSupportLoggedIn} />}
        />

        <Route
          path="/support/dashboard"
          element={
            supportLoggedIn ? (
              <SupportDashboard />
            ) : (
              <Navigate to="/support/login" />
            )
          }
        />

        {/* ================= ORGANIZATION ================= */}
        <Route
          path="/org/login"
          element={<OrganizationLogin setOrgLoggedIn={setOrgLoggedIn} />}
        />

        <Route
          path="/org/change-password"
          element={
            orgLoggedIn ? (
              <ChangePassword />
            ) : (
              <Navigate to="/org/login" />
            )
          }
        />

        <Route
          path="/org/dashboard"
          element={
            orgLoggedIn ? (
              <OrganizationDashboard />
            ) : (
              <Navigate to="/org/login" />
            )
          }
        />

      </Routes>
    </Router>
  );
}

export default App;