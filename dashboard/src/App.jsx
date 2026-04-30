import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import InternDashboard from "./pages/InternDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import InternList from "./pages/InternList";
import TaskList from "./pages/TaskList";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interns"
          element={
            <ProtectedRoute allowedRole="admin">
              <InternList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute allowedRole="admin">
              <TaskList />
            </ProtectedRoute>
          }
        />

        {/* Intern Routes */}
        <Route
          path="/intern"
          element={
            <ProtectedRoute allowedRole="intern">
              <InternDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;