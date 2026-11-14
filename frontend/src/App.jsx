import "./App.css";
import StudentLogin from "./Pages/StudentLogin";
import StudentDashboard from "./Pages/StudentDashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SubmitComplaint from "./Pages/Student/SubmitComplaint";
function App() {
  return (
    <div className="app-content">
      <BrowserRouter>
        <Routes>
          <Route path="/studentLogin" element={<StudentLogin />} />
          {/* <Route element={<ProtectedRoutes />}> */}
          <Route path="/studentDashboard" element={<StudentDashboard />} />
          <Route path="/submitComplaint" element={<SubmitComplaint />} />
          {/* </Route> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
