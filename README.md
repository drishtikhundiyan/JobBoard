# JobBoard

A full-stack job board platform built with the **MERN stack** (MongoDB, Express, React, Node.js) that connects employers with job seekers.

---

## What Can You Do?

**As a Job Seeker**

- Browse and search jobs by keyword, location, and job type
- Apply for jobs with a cover letter and resume (PDF or Word)
- Track your application status in your personal dashboard

**As an Employer**

- Post and delete job listings
- View all applicants for each job
- Update application status (Pending → Reviewed → Shortlisted → Accepted / Rejected)

---

## Tech Stack

| Layer       | Technology                              |
| ----------- | --------------------------------------- |
| Frontend    | React 19, Tailwind CSS, React Router v7 |
| Backend     | Node.js, Express 5                      |
| Database    | MongoDB with Mongoose                   |
| Auth        | JWT (JSON Web Tokens) + bcryptjs        |
| File Upload | Multer                                  |
| HTTP Client | Axios                                   |

---

## Getting Started

### Prerequisites

Make sure you have these installed on your computer:

- [Node.js v18+](https://nodejs.org/)
- [Git](https://git-scm.com/)
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) account

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/drishtikhundiyan/JobBoard.git
cd JobBoard
```

---

### Step 2 — Set Up Environment Variables

Go into the `server` folder and create a file called `.env`:

```bash
cd server
```

Create a new file named `.env` and paste this inside:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=any_random_secret_key_here
NODE_ENV=development
```

> **Where to get these values:**
>
> - `MONGO_URI` → Go to [MongoDB Atlas](https://www.mongodb.com/atlas), create a free cluster, click **Connect**, and copy the connection string. Replace `<password>` with your database password.
> - `JWT_SECRET` → Type any random string you want, e.g. `mysecretkey123`

---

### Step 3 — Install All Dependencies

Go back to the root folder and run one command to install everything:

```bash
cd ..
npm run install-all
```

This will install dependencies for the root, server, and client folders all at once.

---

### Step 4 — Run the App

From the root folder, run:

```bash
npm run dev
```

This starts both the frontend and backend at the same time.

| Service  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:5000 |

Open your browser and go to **http://localhost:3000**

---

## Available Commands

Run these from the **root folder**:

| Command               | Description                                          |
| --------------------- | ---------------------------------------------------- |
| `npm run dev`         | Start both frontend and backend together             |
| `npm run server`      | Start backend only                                   |
| `npm run client`      | Start frontend only                                  |
| `npm run install-all` | Install all dependencies for root, server and client |

---

## Project Structure

```
JobBoard/
├── package.json              # Root - runs both servers together
│
├── client/                   # React Frontend
│   └── src/
│       ├── components/       # Navbar, JobCard, Spinner
│       ├── context/          # Auth state (login/logout)
│       ├── pages/            # All pages (Home, Login, Dashboard...)
│       └── utils/            # Axios setup
│
└── server/                   # Node.js + Express Backend
    ├── config/               # MongoDB connection
    ├── controllers/          # Business logic
    ├── middleware/           # Auth check, file upload
    ├── models/               # Database schemas (User, Job, Application)
    ├── routes/               # API routes
    └── uploads/              # Uploaded resumes are saved here
```

---

## API Endpoints

| Method | Endpoint                           | Who Can Access  | Description                 |
| ------ | ---------------------------------- | --------------- | --------------------------- |
| POST   | `/api/auth/register`               | Public          | Create a new account        |
| POST   | `/api/auth/login`                  | Public          | Login to your account       |
| GET    | `/api/auth/profile`                | Logged In       | Get your profile            |
| PUT    | `/api/auth/profile`                | Logged In       | Update your profile         |
| GET    | `/api/jobs`                        | Public          | Get all jobs (with filters) |
| GET    | `/api/jobs/:id`                    | Public          | Get a single job            |
| POST   | `/api/jobs`                        | Employer only   | Post a new job              |
| PUT    | `/api/jobs/:id`                    | Employer only   | Update a job                |
| DELETE | `/api/jobs/:id`                    | Employer only   | Delete a job                |
| GET    | `/api/jobs/employer/myjobs`        | Employer only   | Get your posted jobs        |
| POST   | `/api/applications/:jobId`         | Job Seeker only | Apply for a job             |
| GET    | `/api/applications/myapplications` | Job Seeker only | See your applications       |
| GET    | `/api/applications/job/:jobId`     | Employer only   | See applicants for a job    |
| PUT    | `/api/applications/:id/status`     | Employer only   | Update application status   |

---

## Environment Variables

| Variable     | Description                          | Example             |
| ------------ | ------------------------------------ | ------------------- |
| `PORT`       | Port the backend runs on             | `5000`              |
| `MONGO_URI`  | Your MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key used to sign tokens       | `mysecretkey123`    |
| `NODE_ENV`   | Environment mode                     | `development`       |

---

## Deployment

| Part     | Platform      |
| -------- | ------------- |
| Frontend | Vercel        |
| Backend  | Render        |
| Database | MongoDB Atlas |

---
