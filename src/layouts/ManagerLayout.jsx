import React from "react";
import { Layout } from "antd";
import ManagerSidebar from "../components/manager/ManagerSidebar";
import "../styles/ManagerLayout.css";

const { Content } = Layout;

const ManagerLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <ManagerSidebar />
      <Layout className="manager-main-layout">
        <Content className="manager-content">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManagerLayout;
