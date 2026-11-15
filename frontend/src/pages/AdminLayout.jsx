import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(() => {
    return localStorage.getItem("adminSidebar") !== "false";
  });

  useEffect(() => {
    localStorage.setItem("adminSidebar", isOpen);
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((previous) => !previous);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" isOpen={isOpen} onToggle={handleToggle} />
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
