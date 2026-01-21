📌 Project Name

Kickoff – Football League Management System

🎯 Current Purpose of the System

Kickoff is a centralized web platform that manages football leagues for colleges, clubs, and local organizations, with a controlled onboarding and approval process.

👥 Actors (CONFIRMED)

Kickoff Support Team

Reviews and approves organization requests

Organization Admin

Requests access to create leagues

User (Viewer)

Views leagues, fixtures, standings (future sprint)

🧱 Sprint 1 – Organization Onboarding (COMPLETED)
✔ Features

Organization request submission API

Strong backend validation

MongoDB persistence

Status tracking (pending, approved, rejected)

🧱 Sprint 2 – Support Team Approval Flow (COMPLETED)
✔ Backend APIs

GET organization requests (with status filtering)

Approve organization request

Reject organization request

Admin-key–protected sensitive routes

✔ Security

Master admin key via .env

Middleware-based authorization

✔ Data Handling

Review metadata (reviewedBy, reviewedAt)

Automatic timestamps

Mongoose versioning (__v) retained

🛠 Tech Stack
Backend

Node.js

Express

MongoDB Atlas (free tier)

Mongoose

Testing

Postman

Version Control

Git & GitHub

🚀 PROJECT STATUS
Module	Status
Organization Requests	✅ Complete
Approval Workflow	✅ Complete
Backend Security	✅ Complete
Support Team APIs	✅ Complete

⏭️ NEXT SPRINT OPTIONS 
Sprint 3 – Support Team UI (React Dashboard)

View requests visually

Approve / reject via buttons

Sprint 4 – Organization Admin Features

League creation

Team management

Fixture generation

Sprint 5 – Public User View

View leagues and standings (no login)