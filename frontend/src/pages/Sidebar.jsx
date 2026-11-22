import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ role, isOpen, onToggle }) => {
  const navigate = useNavigate();

  const studentLinks = [
    {
      name: "Dashboard",
      path: "/studentDashboard",
      icon: "fa-solid fa-house",
    },
    {
      name: "Submit Complaint",
      path: "/submitComplaint",
      icon: "fa-solid fa-circle-plus",
    },
    {
      name: "My Complaints",
      path: "/myComplaints",
      icon: "fa-solid fa-clipboard-list",
    },
    {
      name: "Profile",
      path: "/student/profile",
      icon: "fa-solid fa-user",
    },
  ];

const adminLinks = [
  {
    name: "Dashboard",
    path: "/adminDashboard",
    icon: "fa-solid fa-house",
  },
  {
    name: "View Complaints",
    path: "/admin/complaints",
    icon: "fa-solid fa-file-lines",
  },
  {
    name: "My Profile",
    path: "/admin/profile",
    icon: "fa-solid fa-user",
  },
];

  const links = role === "student" ? studentLinks : adminLinks;

  const handleLogout = () => {
    sessionStorage.removeItem(role);

    navigate("/", { replace: true });
  };

  return (
    <aside className={`sidebar ${isOpen ? "expanded" : "collapsed"}`}>
      {/* HAMBURGER - ABOVE LOGO */}
      <div className="sidebar-top">
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      </div>

      {/* LOGO AND BRANDING */}
      <div className="sidebar-logo">
        <div className="sidebar-brand">
          {/* <div className="mendit-logo">
            <img src="/MendItLogoTransparent.png" alt="MendIt Logo" />
          </div> */}

          {isOpen && (
            <div className="sidebar-brand-text">
              <h2>MendIt</h2>
              <p>Campus Complaint Management</p>
            </div>
          )}
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="sidebar-menu">
        {isOpen && <p className="sidebar-heading">MAIN MENU</p>}

        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            title={!isOpen ? link.name : ""}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <i className={link.icon}></i>
            {isOpen && <span>{link.name}</span>}
          </NavLink>
        ))}
      </div>

      {/* LOGOUT */}
      <div className="sidebar-bottom">
        <button
          className="sidebar-logout"
          onClick={handleLogout}
          title={!isOpen ? "Logout" : ""}
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
