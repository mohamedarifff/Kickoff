const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();

const PORT =
  process.env.PORT || 5000;

/* =========================================
   CORS
========================================= */

app.use(
  cors({
    origin: [
      "http://localhost:3000",

      "https://kickoff-007.vercel.app",

      "https://kickoff-007-c9cejd8yx-mdariff011-1560s-projects.vercel.app",
    ],

    credentials: true,
  })
);

/* =========================================
   MIDDLEWARE
========================================= */

app.use(express.json());

/* =========================================
   MONGODB CONNECTION
========================================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {

    console.log(
      "MongoDB connected"
    );

  })
  .catch((error) => {

    console.error(
      "MongoDB connection error:",
      error
    );

  });

/* =========================================
   ROUTES
========================================= */

/* SUPPORT AUTH */

const supportAuthRoutes =
  require(
    "./routes/supportAuthRoutes"
  );

app.use(
  "/api/support",
  supportAuthRoutes
);

/* ORGANIZATION REQUESTS */

const organizationRequestRoutes =
  require(
    "./routes/organizationRequestRoutes"
  );

app.use(
  "/api/organization-requests",
  organizationRequestRoutes
);

/* ORGANIZATION AUTH */

const organizationAuthRoutes =
  require(
    "./routes/organizationAuthRoutes"
  );

app.use(
  "/api/org",
  organizationAuthRoutes
);

/* LEAGUES */

const leagueRoutes =
  require("./routes/leagueRoutes");

app.use(
  "/api/leagues",
  leagueRoutes
);

/* TEAMS */

const teamRoutes =
  require("./routes/teamRoutes");

app.use(
  "/api/teams",
  teamRoutes
);

/* MATCHES */

const matchRoutes =
  require("./routes/matchRoutes");

app.use(
  "/api/matches",
  matchRoutes
);

/* PUBLIC */

const publicRoutes =
  require("./routes/publicRoutes");

app.use(
  "/api/public",
  publicRoutes
);

/* TEST ROUTE */

app.get("/", (req, res) => {

  res.send(
    "Kickoff Backend is running"
  );

});

/* =========================================
   START SERVER
========================================= */

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});