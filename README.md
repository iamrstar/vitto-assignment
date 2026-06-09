# Vitto Loan Application Portal

## Easy Setup Guide

Follow these simple steps to run the project locally.

### 1. Database Setup
1. Create a free PostgreSQL database on [Neon.tech](https://neon.tech).
2. Copy your connection string (it looks like `postgresql://user:password@host...`).

### 2. Backend
Open your terminal and run:
```bash
cd backend
npm install
cp .env.example .env
```
*Open the new `backend/.env` file and paste your Neon connection string into `DATABASE_URL`.*

Then run:
```bash
npm run migrate   # Sets up your database tables
npm start         # Starts the backend server
```

### 3. Frontend
Open a **new** terminal and run:
```bash
cd frontend
npm install
npm run dev
```

That's it! Open your browser to `http://localhost:5173` to see the app.
