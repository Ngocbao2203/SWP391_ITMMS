import React, { memo } from "react";
import { Layout } from "antd";
import DoctorSidebar from "../components/doctor/DoctorSidebar";
import DoctorHeader from "../components/doctor/DoctorHeader";
import ErrorBoundary from "../components/shared/ErrorBoundary";
import "../styles/ManagerLayout.css";
const { Content } = Layout;
const DoctorContent = memo(({ sidebarCollapsed, children }) => {
  return (
    <Layout
      className="manager-main-layout"
      style={{
        marginLeft: sidebarCollapsed ? "70px" : "250px",
        marginTop: "64px", // Space for header
        width: sidebarCollapsed ? "calc(100% - 70px)" : "calc(100% - 250px)",
        transition: "margin-left 0.3s ease, width 0.3s ease",
      }}
    >
      <Content className="manager-content">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </Content>
    </Layout>
  );
});

export default function DoctorLayout({ children }) {
  // Fix cứng sidebar mở rộng (isCollapsed = false)
  // Không sử dụng toggleTimeoutRef và handleSidebarToggle nữa
  const sidebarCollapsed = false;

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <DoctorHeader />
        <DoctorSidebar isCollapsed={sidebarCollapsed} onToggle={null} />
        <DoctorContent sidebarCollapsed={sidebarCollapsed}>
          {children}
        </DoctorContent>
      </Layout>
    </>
  );
}
