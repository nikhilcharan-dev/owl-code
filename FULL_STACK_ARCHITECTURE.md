
# 🚀 FULL STACK TEST ARCHITECTURE (BACKEND + FRONTEND)
### For Anti‑Gravity Code Generation & Local Testing

This document defines the **complete backend + frontend testing architecture**  
so that the system can be generated, run, and validated end‑to‑end.

---

# 🧱 TECH STACK

## Backend
- Node.js (ES Modules)
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (File Uploads)
- Helmet, CORS, Morgan

## Frontend (Testing UI)
- React (Vite)
- Plain CSS
- Vanilla JS
- GSAP (minor animations)
- Axios

---

# 👥 USER ROLES

| Role | Access |
|----|----|
| Admin | Full CRUD access |
| Trainer | View batches, schedules |
| Trainee | View tasks, submit progress |

---

# 📁 PROJECT STRUCTURE

```
project-root/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── uploads/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── CourseManager.jsx
│   │   │   ├── BatchManager.jsx
│   │   │   └── TraineeManager.jsx
│   │   ├── components/
│   │   ├── services/api.js
│   │   └── styles/
│   └── main.jsx
│
└── README.md
```

---

# 👤 USER MODEL

```js
User {
  name,
  collegeEmail,
  workEmail,
  password,
  role,
  codingHandles,
  resume,
  assignedBatch,
  createdAt
}
```

---

# 🧑‍💼 ADMIN MODEL

```js
Admin {
  name,
  email,
  password,
  role: "admin" | "trainer",
  createdAt
}
```

---

# 📘 COURSE MODEL

```js
Course {
  title,
  description,
  durationInDays,
  excludedDays,
  customHolidays,
  createdBy
}
```

✔ Reusable  
✔ Independent of batches  

---

# 🧑‍🏫 BATCH MODEL

```js
Batch {
  name,
  course,
  trainer,
  trainees,
  startDate,
  endDate
}
```

---

# 📅 SCHEDULE MODEL

```js
Schedule {
  batch,
  date,
  dayNumber,
  mentorNotes,
  assignments
}
```

---

# 📊 TRAINEE PROGRESS

```js
TraineeProgress {
  trainee,
  batch,
  date,
  completedAssignments,
  notes
}
```

---

# 🏆 CHALLENGE MODEL

```js
Challenge {
  title,
  duration,
  questions
}

ChallengeParticipation {
  user,
  challenge,
  streak,
  completedDays
}
```

---

# 🔐 AUTH ROUTES

```
POST /api/auth/login
POST /api/auth/register-admin
```

---

# 🧑‍💼 ADMIN ROUTES

```
POST   /api/admin/course
GET    /api/admin/course
PUT    /api/admin/course/:id
DELETE /api/admin/course/:id

POST   /api/admin/batch
GET    /api/admin/batch
POST   /api/admin/assign-trainee
POST   /api/admin/generate-schedule
```

---

# 👨‍🎓 TRAINEE ROUTES

```
POST /api/trainee/setup-profile
POST /api/trainee/upload-resume
GET  /api/trainee/dashboard
```

---

# 🧠 CORE BUSINESS LOGIC

## Schedule Generator
✔ Skips Sundays  
✔ Skips custom holidays  
✔ Auto increments day number  
✔ Generates assignments  

## Course Reuse
✔ One course → many batches  
✔ No duplication  

## Security
✔ JWT Auth  
✔ Role Guards  
✔ Protected routes  

---

# 🧪 FRONTEND TESTING REQUIREMENTS

### Admin Dashboard (React + Vite)
- Login page
- Create Course
- View Courses
- Create Batch
- Assign Trainees
- Generate Schedule
- View Schedule

### Animations (GSAP)
- Page transitions
- Modal open/close
- Button hover animation

### API Integration
- Axios instance
- JWT in headers
- Error handling

---

# 🧪 TESTING FLOW

1. Admin logs in
2. Creates course
3. Creates batch
4. Assigns trainee
5. Generates schedule
6. Trainee logs in
7. Views tasks
8. Uploads resume
9. Submits progress

---

# 📈 FUTURE ENHANCEMENTS

- Admin analytics dashboard
- AI mentor suggestions
- Redis caching
- WebSocket updates
- Leaderboards

---

# ✅ FINAL CONFIRMATION

✔ Backend ready  
✔ Frontend test-ready  
✔ Clean separation  
✔ Scalable architecture  
✔ Anti‑gravity compatible  

---

🔥 **THIS FILE CAN BE USED DIRECTLY AS README.md**
