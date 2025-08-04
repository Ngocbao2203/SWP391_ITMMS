import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/DoctorSidebar.css";
import {
  FaHome,
  FaCalendarAlt,
  FaPrescriptionBottleAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { authService, doctorService, guestService } from "../../services";

const DoctorSidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/doctor/dashboard", name: "Tổng quan", icon: <FaHome /> },
    { path: "/doctor/appointments", name: "Lịch hẹn", icon: <FaCalendarAlt /> },
    {
      path: "/doctor/treatment-plans",
      name: "Kế hoạch điều trị",
      icon: <FaPrescriptionBottleAlt />,
    },
  ];

  const [avatarUrl, setAvatarUrl] = useState("/default-avatar.png"); // Default avatar
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);
  const currentUser = authService.getCurrentUser();
  const doctor = currentUser?.doctor;

  const doctorName = currentUser?.fullName || "Bác sĩ";
  const doctorSpecialty = doctor?.specialization || "Chuyên khoa";

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser || !doctor) {
        navigate("/login");
        return;
      }

      setIsLoadingAvatar(true);

      try {
        const response = await guestService.getUserProfile();

        // Dựa vào API response structure: avatarUrl nằm trực tiếp trong response
        // Kiểm tra nhiều cấu trúc có thể có
        let newAvatarUrl = null;

        if (response.avatarUrl) {
          // Trường hợp avatarUrl nằm trực tiếp trong response
          newAvatarUrl = response.avatarUrl;
        } else if (response.data?.avatarUrl) {
          // Trường hợp avatarUrl nằm trong response.data
          newAvatarUrl = response.data.avatarUrl;
        } else if (response.data?.doctor?.avatarUrl) {
          // Trường hợp avatarUrl nằm trong response.data.doctor
          newAvatarUrl = response.data.doctor.avatarUrl;
        }

        if (
          newAvatarUrl &&
          newAvatarUrl !== "null" &&
          newAvatarUrl.trim() !== ""
        ) {
          setAvatarUrl(newAvatarUrl);

          // Cập nhật localStorage với avatarUrl từ server
          const updatedUser = {
            ...currentUser,
            doctor: { ...currentUser.doctor, avatarUrl: newAvatarUrl },
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } else {
          console.warn(
            "avatarUrl not found or empty in response, using localStorage fallback"
          );
          const localAvatar = currentUser.doctor?.avatarUrl;
          if (localAvatar && localAvatar !== "null") {
            setAvatarUrl(localAvatar);
          }
          // Nếu không có local avatar, sử dụng default đã set ở useState
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin profile:", error);

        // Fallback đến avatar từ localStorage nếu API thất bại
        const localAvatar = currentUser.doctor?.avatarUrl;
        if (localAvatar && localAvatar !== "null") {
          setAvatarUrl(localAvatar);
        }
        // Nếu không có local avatar, giữ nguyên default avatar
      } finally {
        setIsLoadingAvatar(false);
      }
    };

    fetchUserProfile();
  }, [currentUser, doctor, navigate]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validImageTypes.includes(file.type)) {
      alert("Vui lòng chọn file ảnh (JPEG, PNG, GIF hoặc WebP).");
      return;
    }

    // Kiểm tra kích thước file (ví dụ: tối đa 5MB)
    const maxSizeInMB = 5;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      alert(`File quá lớn. Vui lòng chọn file nhỏ hơn ${maxSizeInMB}MB.`);
      return;
    }

    try {
      const doctorId = doctor?.id;
      if (!doctorId) {
        alert("Không tìm thấy ID bác sĩ.");
        return;
      }

      setIsLoadingAvatar(true);

      const response = await doctorService.uploadDoctorAvatar(doctorId, file);

      // Lấy avatarUrl từ response của server
      let newAvatarUrl = null;
      if (response.avatarUrl) {
        newAvatarUrl = response.avatarUrl;
      } else if (response.data?.avatarUrl) {
        newAvatarUrl = response.data.avatarUrl;
      }

      if (newAvatarUrl) {
        setAvatarUrl(newAvatarUrl);

        // Cập nhật localStorage với avatarUrl từ server
        const updatedUser = {
          ...currentUser,
          doctor: { ...currentUser.doctor, avatarUrl: newAvatarUrl },
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        console.warn(
          "No avatarUrl in upload response, retrying with getUserProfile"
        );

        // Đồng bộ lại dữ liệu từ server sau upload
        setTimeout(async () => {
          try {
            const profileResponse = await guestService.getUserProfile();
            let updatedAvatarUrl = null;

            if (profileResponse.avatarUrl) {
              updatedAvatarUrl = profileResponse.avatarUrl;
            } else if (profileResponse.data?.avatarUrl) {
              updatedAvatarUrl = profileResponse.data.avatarUrl;
            } else if (profileResponse.data?.doctor?.avatarUrl) {
              updatedAvatarUrl = profileResponse.data.doctor.avatarUrl;
            }

            if (updatedAvatarUrl) {
              setAvatarUrl(updatedAvatarUrl);
              const updatedUser = {
                ...currentUser,
                doctor: { ...currentUser.doctor, avatarUrl: updatedAvatarUrl },
              };
              localStorage.setItem("user", JSON.stringify(updatedUser));
            }
          } catch (error) {
            console.error("Error refreshing profile after upload:", error);
          }
        }, 1000); // Đợi 1 giây để server xử lý xong
      }

      alert("Cập nhật ảnh đại diện thành công!");
    } catch (error) {
      console.error("Lỗi khi upload avatar:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.["file"]?.[0] ||
        error.message ||
        "Không thể tải ảnh lên. Vui lòng thử lại.";
      alert(errorMessage);
    } finally {
      setIsLoadingAvatar(false);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    authService.logout();
    navigate("/login");
  };

  if (!currentUser || !doctor) {
    return null;
  }

  return (
    <div className={`doctor-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <img
            src="/path/to/logo.png"
            alt="Logo"
            className="logo"
            onError={(e) => (e.target.style.display = "none")}
          />
          {!isCollapsed && <h2>Trung tâm Hỗ trợ Sinh sản</h2>}
        </div>
      </div>

      <div className="doctor-info">
        {!isCollapsed ? (
          <label htmlFor="avatar-upload" style={{ position: "relative" }}>
            <img
              src={avatarUrl}
              alt="Doctor"
              className={`doctor-avatar doctor-avatar-glow ${
                isLoadingAvatar ? "loading" : ""
              }`}
              style={{
                cursor: "pointer",
                opacity: isLoadingAvatar ? 0.7 : 1,
                transition: "opacity 0.3s ease",
              }}
              title="Click để cập nhật ảnh"
              onError={(e) => {
                if (e.target.src !== "/default-avatar.png") {
                  e.target.src = "/default-avatar.png";
                }
              }}
            />
            {isLoadingAvatar && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "12px",
                  color: "#666",
                }}
              >
                Loading...
              </div>
            )}
          </label>
        ) : (
          <label htmlFor="avatar-upload" style={{ position: "relative" }}>
            <img
              src={avatarUrl}
              alt="Doctor"
              className={`doctor-avatar-small ${
                isLoadingAvatar ? "loading" : ""
              }`}
              style={{
                cursor: "pointer",
                opacity: isLoadingAvatar ? 0.7 : 1,
                transition: "opacity 0.3s ease",
              }}
              title="Click để cập nhật ảnh"
              onError={(e) => {
                console.error(
                  "Image load failed, falling back to default. URL:",
                  e.target.src
                );
                if (e.target.src !== "/default-avatar.png") {
                  e.target.src = "/default-avatar.png";
                }
              }}
            />
          </label>
        )}
        <input
          type="file"
          id="avatar-upload"
          accept="image/jpeg,image/png,image/gif,image/webp"
          style={{ display: "none" }}
          onChange={handleAvatarUpload}
          disabled={isLoadingAvatar}
        />
        <div className="doctor-details">
          <h3 className="doctor-name">{doctorName}</h3>
          <p className="doctor-specialty">{doctorSpecialty}</p>
        </div>
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
        <a href="#logout" className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          {!isCollapsed && <span>Đăng xuất</span>}
        </a>
      </div>
    </div>
  );
};

export default DoctorSidebar;
