import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useEffect, useState } from "react";

/* ================= PUBLIC ================= */

import UserHome from "./pages/UserHome";
import PublicLeagues from "./pages/PublicLeagues";
import PublicLeague from "./pages/PublicLeague";
import OrganizationRequest from "./pages/OrganizationRequest";

/* ================= SUPPORT ================= */

import SupportLogin from "./pages/SupportLogin";
import SupportDashboard from "./pages/SupportDashboard";

/* ================= ORGANIZATION ================= */

import OrganizationLogin from "./pages/OrganizationLogin";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import ChangePassword from "./pages/ChangePassword";

import OrganizationLeagues from "./pages/OrganizationLeagues";
import OrganizationCreateLeague from "./pages/OrganizationCreateLeague";
import OrganizationManageLeague from "./pages/OrganizationManageLeague";

import LeagueTeams from "./pages/LeagueTeams";
import LeagueCreateTeam from "./pages/LeagueCreateTeam";
import LeagueManageTeam from "./pages/LeagueManageTeam";

import LeagueFixtures from "./pages/LeagueFixtures";
import LeagueMatches from "./pages/LeagueMatches";
import LeagueStandings from "./pages/LeagueStandings";
import LeagueSettings from "./pages/LeagueSettings";

import MatchControl from "./pages/MatchControl";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

/* =========================================
   PROTECTED ROUTE
========================================= */

const ProtectedOrgRoute = ({
  children,
}) => {

  const token =
    localStorage.getItem(
      "orgToken"
    );

  return token
    ? children
    : <Navigate to="/org/login" />;
};

const ProtectedSupportRoute = ({
  children,
}) => {

  const token =
    localStorage.getItem(
      "supportToken"
    );

  return token
    ? children
    : (
      <Navigate to="/support/login" />
    );
};

function App() {

  const [
    supportLoggedIn,
    setSupportLoggedIn,
  ] = useState(false);

  const [
    orgLoggedIn,
    setOrgLoggedIn,
  ] = useState(false);

  useEffect(() => {

    setSupportLoggedIn(
      !!localStorage.getItem(
        "supportToken"
      )
    );

    setOrgLoggedIn(
      !!localStorage.getItem(
        "orgToken"
      )
    );

  }, []);

  return (

    <Router>

      <Routes>

        {/* =====================================
            PUBLIC ROUTES
        ===================================== */}

        <Route
          path="/"
          element={<UserHome />}
        />

        <Route
          path="/leagues"
          element={<PublicLeagues />}
        />

<Route
  path="/league/:leagueId"
  element={<PublicLeague />}
/>

        <Route
          path="/request-organization"
          element={<OrganizationRequest />}
        />

        {/* =====================================
            SUPPORT
        ===================================== */}

        <Route
          path="/support/login"
          element={
            <SupportLogin
              setIsLoggedIn={
                setSupportLoggedIn
              }
            />
          }
        />

        <Route
          path="/support/dashboard"
          element={
            <ProtectedSupportRoute>

              <SupportDashboard />

            </ProtectedSupportRoute>
          }
        />

        {/* =====================================
            ORGANIZATION AUTH
        ===================================== */}

        <Route
          path="/org/login"
          element={
            <OrganizationLogin
              setOrgLoggedIn={
                setOrgLoggedIn
              }
            />
          }
        />

        <Route
          path="/org/forgot-password"
          element={
            <ForgotPassword />
          }
        />

        <Route
          path="/org/reset-password"
          element={
            <ResetPassword />
          }
        />

        {/* =====================================
            ORGANIZATION
        ===================================== */}

        <Route
          path="/org/dashboard"
          element={
            <ProtectedOrgRoute>

              <OrganizationDashboard />

            </ProtectedOrgRoute>
          }
        />

        <Route
          path="/org/change-password"
          element={
            <ProtectedOrgRoute>

              <ChangePassword />

            </ProtectedOrgRoute>
          }
        />

        {/* =====================================
            LEAGUES
        ===================================== */}

        <Route
          path="/org/leagues"
          element={
            <ProtectedOrgRoute>

              <OrganizationLeagues />

            </ProtectedOrgRoute>
          }
        />

        <Route
          path="/org/leagues/create"
          element={
            <ProtectedOrgRoute>

              <OrganizationCreateLeague />

            </ProtectedOrgRoute>
          }
        />

        <Route
          path="/org/leagues/:leagueId"
          element={
            <ProtectedOrgRoute>

              <OrganizationManageLeague />

            </ProtectedOrgRoute>
          }
        />

        {/* =====================================
            TEAMS
        ===================================== */}

        <Route
          path="/org/leagues/:leagueId/teams"
          element={
            <ProtectedOrgRoute>

              <LeagueTeams />

            </ProtectedOrgRoute>
          }
        />

        <Route
          path="/org/leagues/:leagueId/teams/create"
          element={
            <ProtectedOrgRoute>

              <LeagueCreateTeam />

            </ProtectedOrgRoute>
          }
        />

        <Route
          path="/org/leagues/:leagueId/teams/:teamId"
          element={
            <ProtectedOrgRoute>

              <LeagueManageTeam />

            </ProtectedOrgRoute>
          }
        />

        {/* =====================================
            FIXTURES
        ===================================== */}

        <Route
          path="/org/leagues/:leagueId/fixtures"
          element={
            <ProtectedOrgRoute>

              <LeagueFixtures />

            </ProtectedOrgRoute>
          }
        />

        {/* =====================================
            MATCHES
        ===================================== */}

        <Route
          path="/org/leagues/:leagueId/matches"
          element={
            <ProtectedOrgRoute>

              <LeagueMatches />

            </ProtectedOrgRoute>
          }
        />

        <Route
          path="/org/matches/:matchId"
          element={
            <ProtectedOrgRoute>

              <MatchControl />

            </ProtectedOrgRoute>
          }
        />

        {/* =====================================
            STANDINGS
        ===================================== */}

        <Route
          path="/org/leagues/:leagueId/standings"
          element={
            <ProtectedOrgRoute>

              <LeagueStandings />

            </ProtectedOrgRoute>
          }
        />

        {/* =====================================
            SETTINGS
        ===================================== */}

        <Route
          path="/org/leagues/:leagueId/settings"
          element={
            <ProtectedOrgRoute>

              <LeagueSettings />

            </ProtectedOrgRoute>
          }
        />

      </Routes>

    </Router>
  );
}

export default App;