import React from "react";
import { Layout } from "antd";
import DoctorSidebar from "../components/doctor/DoctorSidebar";
const { Content } = Layout;
export default function DoctorLayout({ children }) {
  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <DoctorSidebar />
        <Layout className="manager-main-layout">
          <Content className="manager-content">{children}</Content>
        </Layout>
      </Layout>
    </>
  );
}
