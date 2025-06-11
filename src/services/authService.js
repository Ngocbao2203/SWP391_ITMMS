// Authentication Service

// Hàm đăng ký người dùng mới
export const register = (userData) => {
  try {
    // Lấy danh sách người dùng từ localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      return { success: false, message: 'Email đã được sử dụng' };
    }
    
    // Tạo người dùng mới với id ngẫu nhiên
    const newUser = {
      ...userData,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    // Thêm người dùng mới vào danh sách và lưu lại
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Trả về thông báo thành công
    return { success: true, message: 'Đăng ký thành công' };
    
  } catch (error) {
    console.error('Error during registration:', error);
    return { success: false, message: 'Có lỗi xảy ra khi đăng ký' };
  }
};

// Hàm đăng nhập
export const login = (credentials) => {
  try {
    // Lấy danh sách người dùng từ localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Tìm người dùng với email và mật khẩu phù hợp
    const user = users.find(
      user => user.email === credentials.email && user.password === credentials.password
    );
    
    // Nếu không tìm thấy người dùng
    if (!user) {
      return { success: false, message: 'Email hoặc mật khẩu không chính xác' };
    }
    
    // Tạo bản sao người dùng để loại bỏ mật khẩu
    const { password, ...userWithoutPassword } = user;
    
    // Lưu thông tin người dùng vào localStorage
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    
    // Trả về thông báo thành công và thông tin người dùng
    return { 
      success: true, 
      message: 'Đăng nhập thành công', 
      user: userWithoutPassword 
    };
    
  } catch (error) {
    console.error('Error during login:', error);
    return { success: false, message: 'Có lỗi xảy ra khi đăng nhập' };
  }
};

// Hàm đăng xuất
export const logout = () => {
  // Xóa thông tin người dùng khỏi localStorage
  localStorage.removeItem('currentUser');
  return { success: true, message: 'Đăng xuất thành công' };
};

// Hàm lấy thông tin người dùng hiện tại
export const getCurrentUser = () => {
  try {
    // Lấy thông tin người dùng từ localStorage
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) return null;
    
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Hàm cập nhật thông tin người dùng
export const updateUserProfile = (userId, updatedData) => {
  try {
    // Lấy danh sách người dùng từ localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Tìm vị trí người dùng cần cập nhật
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return { success: false, message: 'Không tìm thấy người dùng' };
    }
    
    // Cập nhật thông tin người dùng
    const updatedUser = { ...users[userIndex], ...updatedData };
    users[userIndex] = updatedUser;
    
    // Lưu lại danh sách người dùng đã cập nhật
    localStorage.setItem('users', JSON.stringify(users));
    
    // Nếu người dùng được cập nhật đang đăng nhập, cập nhật thông tin trong localStorage
    if (currentUser && currentUser.id === userId) {
      const { password, ...userWithoutPassword } = updatedUser;
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    }
    
    // Trả về thông báo thành công
    return { success: true, message: 'Cập nhật thông tin thành công' };
    
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, message: 'Có lỗi xảy ra khi cập nhật thông tin' };
  }
};

// Khởi tạo người dùng mặc định nếu chưa có
export const initializeDefaultUser = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  if (users.length === 0) {
    const defaultUser = {
      id: 'user_default',
      email: 'user@example.com',
      password: 'password123',
      firstName: 'Nguyễn Văn',
      lastName: 'A',
      phone: '0123456789',
      address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
      dateOfBirth: '1990-05-15',
      gender: 'Nam',
      bloodType: 'O+',
      weight: 70,
      height: 175,
      emergencyContact: '0987654321',
      insurance: 'BHYT123456789',
      allergies: 'Không có',
      avatar: 'https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png',
      createdAt: new Date().toISOString()
    };
    
    users.push(defaultUser);
    localStorage.setItem('users', JSON.stringify(users));
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  updateUserProfile,
  initializeDefaultUser
};

export default authService;