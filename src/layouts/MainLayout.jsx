import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import Header from "../components/public/Header";
import Footer from "../components/public/Footer"; 
import authService from '../services/authService';

const MainLayout = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  // Khởi tạo người dùng mặc định và kiểm tra người dùng đã đăng nhập
  useEffect(() => {
    // Khởi tạo người dùng mặc định
    authService.initializeDefaultUser();
    
    // Kiểm tra xem có người dùng đã đăng nhập không
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    
    // Set up storage event listener to update user when localStorage changes
    const handleStorageChange = () => {
      const updatedUser = authService.getCurrentUser();
      if (updatedUser) {
        setUser(updatedUser);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for directly updating the user in the same window
    const handleUserUpdate = () => {
      const updatedUser = authService.getCurrentUser();
      if (updatedUser) {
        setUser(updatedUser);
      }
    };
    
    window.addEventListener('userDataUpdated', handleUserUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataUpdated', handleUserUpdate);
    };
  }, []);
  
  // Xử lý đăng xuất
  const handleLogout = () => {
    authService.logout();
    setUser(null);
    message.success('Đăng xuất thành công');
    navigate('/');
  };

  return (
    <div className="layout-container">
      <Header user={user} onLogout={handleLogout} />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;