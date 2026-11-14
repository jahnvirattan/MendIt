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

import Register from "./pages/Register";
function App() {
  return (
    <div className="app-content">
      <BrowserRouter>
        <Routes>
          {/* Student Pages */}

          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route element={<ProtectedRoutes />}> */}
          <Route path="/studentDashboard" element={<StudentDashboard />} />
          <Route path="/submitComplaint" element={<SubmitComplaint />} />
          <Route path="/myComplaints" element={<MyComplaints />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          {/* Admin Pages */}
          <Route path="/admin/complaints" element={<AllComplaints />} />
          <Route path="/admin/complaints/:id" element={<ComplaintDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
