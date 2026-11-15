// import React, { useState } from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from "./Sidebar";

// const StudentLayout = () => {
//   const [isOpen, setIsOpen] = useState(true);

//   const handleToggle = () => {
//     setIsOpen((previous) => !previous);
//   };

//   return (
//     <div className="dashboard-layout">
//       <Sidebar role="student" isOpen={isOpen} onToggle={handleToggle} />

//       <main className="dashboard-content">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default StudentLayout;
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const StudentLayout = () => {
  const [isOpen, setIsOpen] = useState(() => {
    return localStorage.getItem("studentSidebar") !== "false";
  });

  useEffect(() => {
    localStorage.setItem("studentSidebar", isOpen);
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((previous) => !previous);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="student" isOpen={isOpen} onToggle={handleToggle} />
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
