const fakeUser = {
  email: "user123@gmail.com",
  password: "123456",
  name: "User Test",
  token: "fake-jwt-token",
};

// Hàm đăng nhập giả lập
const login = async ({ email, password }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      // So sánh với dữ liệu lưu trong localStorage (ưu tiên)
      const checkUser = storedUser || fakeUser;

      if (email === checkUser.email && password === checkUser.password) {
        localStorage.setItem("user", JSON.stringify(checkUser));
        resolve({ success: true, message: "Đăng nhập thành công", user: checkUser });
      } else {
        resolve({ success: false, message: "Email hoặc mật khẩu không đúng" });
      }
    }, 500);
  });
};

// Trả về user hiện tại
const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Đăng xuất
const logout = () => {
  localStorage.removeItem("user");
};

// Tạo tài khoản mặc định nếu chưa có
const initializeDefaultUser = () => {
  const user = localStorage.getItem("user");
  if (!user) {
    localStorage.setItem("user", JSON.stringify(fakeUser));
  }
};

export default {
  login,
  getCurrentUser,
  logout,
  initializeDefaultUser, // <-- Xuất hàm này ra để dùng được ở ngoài
};
