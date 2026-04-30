# InternFlow

InternFlow is a full-stack, modern web application designed for efficient intern management and task tracking. It features a premium, glassmorphism-inspired dark UI powered by Tailwind CSS and a robust Express/MongoDB backend.

## 🚀 Features

### **Admin Capabilities**
- **Dashboard:** View overall statistics, a 6-month task completion chart, and real-time status distributions.
- **Intern Management:** Add, edit, remove, and view interns with a full CRUD interface.
- **Task Management:** Assign tasks to specific interns, set deadlines, define priorities, and easily approve or reject submitted work.
- **Global Search:** Search through all tasks and interns instantly via the Navbar search bar.

### **Intern Capabilities**
- **Personal Dashboard:** View all tasks assigned specifically to you.
- **Task Submission:** Easily submit work links for assigned tasks.
- **Real-time Feedback:** Instantly see if a task is pending admin review, approved, or rejected (with an option to resubmit).

### **UI & Design System**
- **Premium Dark Theme:** Built entirely with Tailwind CSS using a sleek, glassmorphism aesthetic.
- **Responsive Layout:** fully functional on desktop and mobile devices.
- **Interactive Elements:** Features animated gradient backgrounds, smooth hover transitions, and customized tooltips.

---

## 🛠️ Tech Stack

**Frontend:**
- **Framework:** React.js + Vite
- **Styling:** Tailwind CSS (Custom Design System)
- **Routing:** React Router DOM (Role-based Protected Routes)
- **Icons:** Lucide React
- **Charts:** Recharts
- **HTTP Client:** Axios
- **Auth Utils:** jwt-decode

**Backend:**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JWT (JSON Web Tokens)
- **Middleware:** CORS

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB running locally (default: `mongodb://localhost:27017/internflow`)

### 1. Clone the repository
```bash
git clone https://github.com/bilal98739/Intern-flow.git
cd Intern-flow
```

### 2. Backend Setup
```bash
cd backend
npm install
# Seed the database with initial users (admin/intern)
node seed.js
# Start the backend server
node server.js
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd dashboard
npm install
# Start the Vite development server
npm run dev
```

---

## 🔑 Default Login Credentials
*(If you ran the `seed.js` script)*

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@internflow.com` | `admin123` |
| **Intern** | `intern@internflow.com` | `intern123` |

---

## 📂 Project Structure

```text
Intern-flow/
├── backend/
│   ├── config/          # MongoDB Connection
│   ├── controllers/     # API logic (auth, interns, tasks)
│   ├── middleware/      # JWT verification middleware
│   ├── models/          # Mongoose Schemas (User, Task)
│   ├── routes/          # Express Routers
│   ├── seed.js          # DB seeder script
│   └── server.js        # Entry point
└── dashboard/
    ├── public/          # Static assets & Favicon
    ├── src/
    │   ├── assets/      # Logos and images
    │   ├── components/  # Layout, Navbar, Sidebar
    │   ├── pages/       # Dashboards, Auth, Lists
    │   ├── routes/      # ProtectedRoute logic
    │   ├── services/    # Axios configuration
    │   ├── App.jsx      # Route definitions
    │   └── index.css    # Global Tailwind styles
    ├── tailwind.config.js
    └── vite.config.js
```
