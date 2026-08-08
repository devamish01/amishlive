# YouTube Comment Tracking Admin Dashboard

A modern, fast, and responsive SaaS-style admin dashboard built for tracking YouTube videos, analyzing comments, and managing users. 

This is **Frontend Only (Module 1)** built with dummy data that mimics the real YouTube Data API, making it completely ready for backend integration later.

## 🚀 Technologies Used
- **React 19** (UI Library)
- **TypeScript** (Static Typing)
- **Vite** (Next Generation Frontend Tooling)
- **Redux Toolkit** (State management)
- **redux-persist** (Persistent UI state)
- **Tailwind CSS** (Utility-first CSS framework for styling)
- **Recharts** (Declarative charts)
- **Lucide React** (Beautiful modern icons)
- **React Router** (Client-side routing)

## ✨ Features
- **📊 Analytics Dashboard**: High-level statistics, comments collected over time (charts), and recent video sync status.
- **📹 YouTube Videos Page**: Manage videos, view fetched comment counts vs total YouTube comments, and simulate fetching. Includes specific tabs (Today, Week, Month, All).
- **🎬 Video Details Page**: Deep dive into a specific video, seeing its progress, total fetched comments, and unique users who commented.
- **👥 Users Master List**: A comprehensive list of all unique users aggregated from fetched comments. Features a modern "Recent Users Joined" UI card layout.
- **👤 User Details Page**: View a specific user's profile, their total comments, which videos they commented on, and their exact comment history.
- **🌙 Dark Mode UI**: Clean, modern dark SaaS aesthetic.

---

## 🛠️ How to Run Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your computer (version 16 or higher is recommended).

### 1. Download or Clone the Project
If you downloaded this project as a `.zip` file, extract it to a folder on your computer.

### 2. Open the Terminal
Open your terminal or command prompt, and navigate to the project folder:
```bash
cd path/to/your/extracted/folder
```

### 3. Install Dependencies
Run the following command to download all required packages (React, Tailwind, etc.):
```bash
npm install
```

### 4. Start the Development Server
Once installation is complete, start the local Vite development server:
```bash
npm run dev
```

### 5. View in Browser
Open your web browser and go to the URL provided in the terminal, usually:
```text
http://localhost:5173
```

---

## 📦 Building for Production

When you are ready to deploy the frontend to a server (like Vercel, Netlify, or your own hosting), run:
```bash
npm run build
```
This will create a `dist` folder containing the compiled and minified static files ready for deployment.

---

## 📂 Folder Structure Overview

```text
├── src/
│   ├── store.ts          # Redux store setup and typed hooks
│   ├── components/       # Reusable UI components (Sidebar, Layout, Cards, Tables)
│   ├── data/             # Dummy data and mock response helpers
│   ├── features/         # Feature state and Redux slices
│   ├── hooks/            # Custom hooks and hook exports
│   ├── pages/            # Route pages for app views
│   │   ├── DashboardPage.tsx
│   │   ├── UsersPage.tsx
│   │   ├── UserDetailPage.tsx
│   │   └── videos/
│   │       ├── VideoList.tsx    # Video list page
│   │       └── VideoDetails.tsx # Video detail page
│   ├── services/         # API service layer and mock endpoints
│   ├── types/            # Shared TypeScript domain models
│   ├── utils/            # Shared helpers for formatting and storage
│   ├── App.tsx           # Main application router
│   └── main.tsx          # React entry point with Redux provider
├── README.md
├── RUNNING.md
├── PROJECT_STRUCTURE.md
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🔌 API Integration Note (For Future Backend)
All dummy data is located in `src/data/dummyData.ts`. It has been specifically structured to mirror typical YouTube Data API v3 responses (e.g., `videoId`, `publishedAt`, `viewCount`, `commentCount`). When you build your real backend Node.js/Python server, you can simply replace the dummy imports with real `fetch()` or `axios` calls to your API endpoints!

## 📘 Additional Guides
- `RUNNING.md` — Quick run and build instructions.
- `PROJECT_STRUCTURE.md` — Current folder organization and project layout.
