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
import OrganizationLeagues from "./pages/OrganizationLeagues";
import OrganizationLogin from "./pages/OrganizationLogin";
import OrganizationCreateLeague from "./pages/OrganizationCreateLeague";
import OrganizationManageLeague from "./pages/OrganizationManageLeague";

import LeagueTeams from "./pages/LeagueTeams";
import LeagueCreateTeam from "./pages/LeagueCreateTeam";
import LeagueManageTeam from "./pages/LeagueManageTeam";

import LeagueFixtures from "./pages/LeagueFixtures";  
import LeagueStandings from "./pages/LeagueStandings";
import LeagueSettings from "./pages/LeagueSettings";
import ChangePassword from "./pages/ChangePassword";
import OrganizationDashboard from "./pages/OrganizationDashboard";

import PublicLeagues from "./pages/PublicLeagues";
import UserLeaguePage from "./pages/UserLeaguePage";
import UserHome from "./pages/UserHome";


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
        <Route path="/" element={<UserHome />} />
        <Route path="/leagues" element={<PublicLeagues />} />
        <Route path="/league/:leagueId" element={<UserLeaguePage />} />
        <Route path="/request-organization" element={<OrganizationRequest />} />

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
        <Route path="/org/leagues" element={<OrganizationLeagues />} />

        <Route
        path="/org/leagues/create"
        element={<OrganizationCreateLeague />}
        />

        <Route
        path="/org/leagues/:leagueId"
        element={<OrganizationManageLeague />}
        />
        
        <Route path="/org/leagues/:leagueId/teams" element={<LeagueTeams />} />
        <Route path="/org/leagues/:leagueId/fixtures" element={<LeagueFixtures />} />
        <Route path="/org/leagues/:leagueId/standings" element={<LeagueStandings />} />
        <Route path="/org/leagues/:leagueId/settings" element={<LeagueSettings />} />

        <Route path="/org/leagues/:leagueId/teams/create" element={<LeagueCreateTeam />}/>
        <Route path="/org/leagues/:leagueId/teams/:teamId" element={<LeagueManageTeam />}/>

        <Route path="/org/leagues/:leagueId/fixtures"element={<LeagueFixtures />}/>

        

      </Routes>
    </Router>
  );
}

export default App;