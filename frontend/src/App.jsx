import "./App.css";
import StudentLogin from "./pages/StudentLogin";
import StudentDashboard from "./pages/StudentDashboard";
import SubmitComplaint from "./pages/student/SubmitComplaint";
import AllComplaints from "./pages/Admin/AllComplaints";
import ComplaintDetails from "./pages/Admin/ComplaintDetails";
import AdminDashboard from "./pages/Admin/AdminDashboard";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app-content">
      <BrowserRouter>
        <Routes>
          {/* Student Pages */}
          <Route path="/studentLogin" element={<StudentLogin />} />
          <Route path="/studentDashboard" element={<StudentDashboard />} />
          <Route path="/submitComplaint" element={<SubmitComplaint />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />

          {/* Admin Pages */}
          <Route
            path="/admin/complaints"
            element={<AllComplaints />}
          />
          <Route
  path="/admin/complaints/:id"
  element={<ComplaintDetails />}
/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
