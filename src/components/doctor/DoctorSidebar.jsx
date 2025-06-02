import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/DoctorSidebar.css";
import {
  FaHome,
  FaCalendarAlt,
  FaUserInjured,
  FaClipboardList,
  FaPrescriptionBottleAlt,
  FaFlask,
  FaChartLine,
  FaUsers,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const DoctorSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { path: "/doctor/dashboard", name: "Trang chủ", icon: <FaHome /> },
    { path: "/doctor/appointments", name: "Lịch hẹn", icon: <FaCalendarAlt /> },

    {
      path: "/doctor/treatmentsprogress",
      name: "Tiến trình điều trị",
      icon: <FaFlask />,
    },
    {
      path: "/doctor/medical-records",
      name: "Hồ sơ bệnh nhân",
      icon: <FaClipboardList />,
    },

    {
      path: "/doctor/treatment-results",
      name: "Kết quả điều trị",
      icon: <FaChartLine />,
    },

    { path: "/doctor/settings", name: "Cài đặt", icon: <FaCog /> },
  ];

  return (
    <div className={`doctor-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <img src="/logo.png" alt="Logo" className="logo" />
          {!isCollapsed && <h2>Trung tâm Hỗ trợ Sinh sản</h2>}
        </div>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? ">" : "<"}
        </button>
      </div>

      <div className="doctor-info">
        {!isCollapsed && (
          <>
            <img
              src="/doctor-avatar.png"
              alt="Doctor"
              className="doctor-avatar"
            />
            <div className="doctor-details">
              <h3>Bác sĩ Nguyễn Văn A</h3>
              <p>Chuyên khoa Hiếm muộn</p>
            </div>
          </>
        )}
        {isCollapsed && (
          <img
            src="/doctor-avatar.png"
            alt="Doctor"
            className="doctor-avatar-small"
          />
        )}
      </div>

      <nav className="menu">
        <ul>
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={location.pathname === item.path ? "active" : ""}
            >
              <Link to={item.path}>
                <span className="icon">{item.icon}</span>
                {!isCollapsed && <span className="text">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <Link to="/logout" className="logout-btn">
          <FaSignOutAlt />
          {!isCollapsed && <span>Đăng xuất</span>}
        </Link>
      </div>
    </div>
  );
};

export default DoctorSidebar;
