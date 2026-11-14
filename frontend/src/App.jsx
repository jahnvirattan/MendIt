
import "./App.css";
import StudentLogin from "./Pages/StudentLogin";
import StudentDashboard from "./Pages/StudentDashboard";
import SubmitComplaint from "./Pages/Student/SubmitComplaint";
import AllComplaints from "./Pages/Admin/AllComplaints";

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

          {/* Admin Pages */}
          <Route
            path="/admin/complaints"
            element={<AllComplaints />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
