🏆 Kickoff – Football League Management System

Kickoff is a web-based platform designed to simplify the management of football leagues at college, club, and local levels. It replaces manual processes with a structured, secure, and centralized system for handling organization requests and league administration.

🚩 Problem Statement

Football leagues at college, club, and local levels lack a centralized digital system, leading to manual errors, scheduling conflicts, and poor transparency. A secure web-based platform is needed where organizations are verified by a support team and league management is handled in an accurate and organized manner.

🎯 Project Objectives

Provide a centralized system for managing football league organizations
Enable organizations to submit league requests digitally
Allow a verified support team to approve or reject organization requests
Ensure secure access using authentication and role-based authorization
Improve transparency and reduce manual errors

👥 User Roles

Kickoff Support Team

Secure login
View all organization requests
Approve or reject requests

Organization Admin

Submit organization registration requests
Await approval from Kickoff Support

Public Users

View leagues and information (future scope)

⚙️ Key Features (Implemented)

Secure Support Team Login (JWT-based authentication)
Role-based access control
Organization request submission

Approve / Reject workflow

Status-based filtering (Pending / Approved / Rejected)
Logout functionality
Backend validation and error handling

🧱 Tech Stack

Frontend

React.js (with JSX)
JavaScript (ES6+)
Axios

Backend

Node.js
Express.js
JWT Authentication
bcrypt password hashing

Database

MongoDB
Mongoose ODM

Architecture

MERN Stack (MongoDB, Express, React, Node)

🔐 Security Measures

Passwords are hashed using bcrypt
Authentication handled using JWT tokens
Protected routes for support team actions
Environment variables used for sensitive data
No credentials stored in frontend code

🚀 Getting Started (Local Setup)

Prerequisites

Node.js
MongoDB
npm

Backend Setup
cd backend
npm install
npm run dev

Frontend Setup
cd frontend
npm install
npm start

🛣️ Future Enhancements

Organization admin dashboard
Match scheduling and fixtures
League tables and rankings
Public league viewing pages
Email notifications
Deployment to cloud platforms (Render, Vercel)

👨‍💻 Author
Mohamed Arif