import "./App.css";
import SubmitComplaint from "./pages/student/SubmitComplaint";
import AllComplaints from "./pages/Admin/AllComplaints";
import ComplaintDetails from "./pages/Admin/ComplaintDetails";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";

import MyComplaints from "./pages/student/MyComplaints";
import StudentProfile from "./pages/student/StudentProfile";

import ProtectedRoutes from "./ProtectedRoutes";

import Register from "./pages/Register";
import AdminLayout from "./pages/AdminLayout";
import StudentLayout from "./pages/StudentLayout";
function App() {
  return (
    <div className="app-content">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Student Pages */}
          <Route element={<ProtectedRoutes allowedRole="student" />}>
            <Route element={<StudentLayout />}>
              <Route path="/studentDashboard" element={<StudentDashboard />} />
              <Route path="/submitComplaint" element={<SubmitComplaint />} />
              <Route path="/myComplaints" element={<MyComplaints />} />
              <Route path="/student/profile" element={<StudentProfile />} />
            </Route>
          </Route>
          {/* Admin Pages */}
          <Route element={<ProtectedRoutes allowedRole="admin" />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/complaints" element={<AllComplaints />} />
              <Route
                path="/admin/complaints/:id"
                element={<ComplaintDetails />}
              />
              <Route path="/adminDashboard" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
