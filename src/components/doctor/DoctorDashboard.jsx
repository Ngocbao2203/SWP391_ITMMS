import { useState } from "react";
import "../../styles/DoctorDashboard.css"; // Import your CSS styles

const menuItems = [
  "Tổng quan",
  "Hồ sơ bệnh nhân",
  "Phác đồ điều trị",
  "Kết quả xét nghiệm",
  "Lịch khám",
  "Giao tiếp nội bộ",
  "Ghi chú chuyên môn",
  "Tài khoản cá nhân",
];

const content = {
  "Tổng quan":
    "Thống kê tổng quan các bệnh nhân, lịch hẹn, và thông báo nội bộ.",
  "Hồ sơ bệnh nhân":
    "Quản lý thông tin bệnh nhân, xem lịch sử khám, xét nghiệm, siêu âm.",
  "Phác đồ điều trị":
    "Lập, sửa đổi, và theo dõi phác đồ IVF/IUI theo từng bệnh nhân.",
  "Kết quả xét nghiệm": "Xem và đánh giá kết quả xét nghiệm từ lab.",
  "Lịch khám": "Lịch khám, chọc trứng, chuyển phôi, lịch làm việc của bác sĩ.",
  "Giao tiếp nội bộ": "Trao đổi nhanh với điều dưỡng, lab, hoặc bộ phận khác.",
  "Ghi chú chuyên môn": "Ghi chú cá nhân, đánh dấu hồ sơ cần theo dõi sát.",
  "Tài khoản cá nhân": "Thông tin tài khoản, đổi mật khẩu, nhật ký hoạt động.",
};

export default function DoctorDashboard() {
  const [selected, setSelected] = useState("Tổng quan");

  return (
    <div className="dashboard-container">
      {/* Sidebar nằm bên trái */}
      <div className="sidebar">
        <h2>Menu Bác sĩ</h2>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item}
              className={selected === item ? "active" : ""}
              onClick={() => setSelected(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Nội dung chính */}
      <div className="main-content">
        <h1>{selected}</h1>
        <p>{content[selected]}</p>
      </div>
    </div>
  );
}
