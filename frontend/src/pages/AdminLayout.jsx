import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(true);

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
