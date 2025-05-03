# ✅ Task-Master

**Task-Master** is a full-stack to-do list application inspired by TickTick, designed to help users manage recurring tasks with ease. Built using **Next.js**, **Express.js**, **PostgreSQL**, **Tailwind CSS**, and **React Context API**, this app supports flexible recurrence options and a clean user interface.

---

## 🔧 Tech Stack

- **Frontend:** React.js with Next.js
- **Backend:** Express.js
- **Database:** PostgreSQL (via Prisma ORM)
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **Environment:** Cloud IDE (GitHub Codespaces recommended)
- **Language:** JavaScript + JSX

---

## ✨ Features

- 🔁 **Recurring Task Support**  
  - Daily / Weekly / Monthly / Yearly
  - Every X days/weeks/months/years
  - Specific weekdays (e.g., Mon/Wed/Fri)
  - Nth weekday of month (e.g., 2nd Tuesday)
  - Start and optional end date

- 📅 **Mini Calendar Preview** for recurrence
- ✅ **CRUD Operations** for tasks
- ⚙️ **Reusable Components** and clean modular architecture

---

## 📁 Project Structure

```
Task-Master/
├── app/                # Next.js app routes
├── components/         # UI components (TaskList, TaskItem, etc.)
├── context/            # React Context for task state
├── hooks/              # Custom hooks (e.g., useTasks)
├── lib/                # Utility and recurrence logic
├── prisma/             # Prisma DB config and schema
├── public/             # Static assets
├── styles/             # Global CSS and Tailwind config
├── types/              # JS Doc types (optional)
├── .next/              # Next.js build output
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/task-master.git
cd task-master
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup PostgreSQL and Prisma

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧠 Recurrence Logic

Recurring tasks are generated dynamically based on user input. Supported configurations include:

- Frequency (daily/weekly/monthly/yearly)
- Interval (e.g., every 3 days)
- Specific days of the week
- Nth weekday of the month
- Start date and optional end date

This logic is handled inside `/lib/recurrence.js`.

---

## 🧩 Key Components

- `TaskList.jsx` – Lists all tasks
- `TaskItem.jsx` – Single task component
- `TaskForm.jsx` – Add/Edit task form
- `RecurrenceForm.jsx` – Set up recurrence rules
- `MiniCalendar.jsx` – Calendar preview

---

## 🧠 Context API

Global state is managed via `context/TaskContext.jsx` using React's Context API to store and update tasks throughout the app.

---

## ✅ API Endpoints (Express Backend)

| Method | Endpoint         | Description      |
|--------|------------------|------------------|
| GET    | `/api/tasks`     | Get all tasks    |
| POST   | `/api/tasks`     | Create task      |
| PUT    | `/api/tasks/:id` | Update task      |
| DELETE | `/api/tasks/:id` | Delete task      |

The backend connects to PostgreSQL using Prisma for ORM.

---

## 📌 Sample Recurrence Object

```json
{
  "title": "Team Standup",
  "description": "Daily sync meeting",
  "recurrence": {
    "frequency": "WEEKLY",
    "interval": 1,
    "daysOfWeek": ["Monday", "Wednesday", "Friday"],
    "startDate": "2025-05-01",
    "endDate": "2025-07-01"
  }
}
```
