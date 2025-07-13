import React from "react";
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

const DoctorSidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation(); // Sidebar toggle functionality đã bị vô hiệu hóa
  const toggleSidebar = () => {
    // Không làm gì cả vì chúng ta đã fix sidebar luôn ở trạng thái mở rộng
    return;
  };

  const menuItems = [
    { path: "/doctor/dashboard", name: "Tổng quan", icon: <FaHome /> },
    { path: "/doctor/appointments", name: "Lịch hẹn", icon: <FaCalendarAlt /> },
    {
      path: "/doctor/treatment-plans",
      name: "Kế hoạch điều trị",
      icon: <FaPrescriptionBottleAlt />,
    },
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
  ];
  return (
    <div className={`doctor-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <img src="" alt="Logo" className="logo" />
          {!isCollapsed && <h2>Trung tâm Hỗ trợ Sinh sản</h2>}
        </div>{" "}
        {/* Nút toggle đã bị ẩn để ngăn người dùng tương tác với nó */}
      </div>
      <div className="doctor-info">
        {!isCollapsed && (
          <>
            <img
              src="https://scontent.fsgn2-10.fna.fbcdn.net/v/t39.30808-1/329377304_1332268933985538_6362045284190608584_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=109&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeFwPy56WChkZBE9WflmyFrfOBYOAEJEwxA4Fg4AQkTDEGRbSCyc9ZZDJ4Js0UVRx-Wsxf3cy3Y-9MrhTOc4uaH3&_nc_ohc=C3YhRYc7UMUQ7kNvwEGmfqX&_nc_oc=AdkQ41KGGZrplfAZpdYzBX4nURiFEA6IPERW_mc18U1XJGhMdlEOfGYGSNZwMpxGAaQ&_nc_zt=24&_nc_ht=scontent.fsgn2-10.fna&_nc_gid=JLHQOIBRb_jZmbmn9sPw8w&oh=00_AfLQwYE4cQjjfOrz19acuMGlhhPWrxsjcddYFmuaGsUhVg&oe=6843416A"
              alt="Doctor"
              className="doctor-avatar"
            />
            <div className="doctor-details">
              <h3>Bác sĩ Lâm Phi Long</h3>
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
              {" "}
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
      </div>{" "}
    </div>
  );
};

export default DoctorSidebar;
