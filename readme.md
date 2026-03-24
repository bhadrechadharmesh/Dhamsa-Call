# Zoom Clone Web Application

A full-stack video conferencing application built using the MERN stack (MongoDB, Express.js, React, Node.js) and WebRTC / Socket.io for real-time video and audio communication.

## Features

- **User Authentication**: Secure signup and login for users using bcrypt and JWT.
- **Video & Audio Conferencing**: Real-time peer-to-peer or multi-participant video and audio using WebRTC and Socket.io.
- **Protected Routes**: Users must be authenticated to join specific meetings or access their dashboard.
- **Meeting History**: Track previous meetings and call logs.
- **Guest Access**: Option for guests to join meetings via a shareable link.
- **Responsive UI**: Modern interface built with Material-UI (MUI) and Emotion.
- **Dark/Light Theme**: Built-in theme support.

## Tech Stack

### Frontend
- **React 19** (Vite)
- **React Router** for navigation
- **Material-UI (MUI)** for UI components
- **Socket.io-client** for real-time signaling

### Backend
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose** for the database
- **Socket.io** for real-time WebSockets
- **Bcrypt** for password hashing

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js
- MongoDB

### Installation

1. **Clone the repository** (if applicable)
   ```bash
   git clone <repository_url>
   cd Zoom
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory with your environment variables:
   ```env
   PORT=8000
   MONGO_URI=your_mongodb_connection_string
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```
   Start the Vite development server:
   ```bash
   npm run dev
   ```

## Folder Structure

```
Zoom/
├── backend/          # Express backend API & Socket.io server
│   ├── controllers/  # Route controllers and Socket manager
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API endpoints
│   └── app.js        # Entry point for backend
└── frontend/         # React + Vite frontend
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── contexts/   # Auth and Theme context providers
    │   ├── pages/      # Route pages (Landing, Auth, VideoMeet, etc.)
    │   └── App.jsx     # Main application component
    └── package.json
```

## License
ISC
