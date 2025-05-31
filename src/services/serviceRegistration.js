// Các hàm xử lý liên quan đến đăng ký dịch vụ

// Lưu thông tin đăng ký dịch vụ
export const saveServiceRegistration = (data) => {
  return new Promise((resolve, reject) => {
    try {
      // Mô phỏng gửi dữ liệu lên server
      setTimeout(() => {
        // Lưu thành công
        resolve({ success: true, message: 'Đăng ký dịch vụ thành công' });
      }, 1000);
    } catch (error) {
      reject({ success: false, message: 'Đăng ký dịch vụ thất bại', error });
    }
  });
};

// Lấy danh sách dịch vụ từ API
export const getServices = () => {
  return new Promise((resolve) => {
    // Mô phỏng API call
    setTimeout(() => {
      resolve([
        {
          id: 1,
          img: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
          title: "Thụ tinh trong ống nghiệm (IVF)",
          desc: "Phương pháp điều trị hiệu quả cao giúp các cặp vợ chồng hiếm muộn có cơ hội làm cha mẹ.",
          type: "IVF"
        },
        {
          id: 2,
          img: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
          title: "Tiêm tinh trùng vào bào tương noãn (ICSI)",
          desc: "Kỹ thuật hỗ trợ sinh sản tiên tiến dành cho các trường hợp vô sinh do yếu tố nam.",
          type: "ICSI"
        },
        {
          id: 3,
          img: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
          title: "Bơm tinh trùng vào buồng tử cung (IUI)",
          desc: "Phương pháp đơn giản, ít xâm lấn giúp tăng khả năng thụ thai tự nhiên.",
          type: "IUI"
        }
      ]);
    }, 500);
  });
};

// Lấy lịch sử đăng ký dịch vụ của người dùng
export const getUserServiceRegistrations = (userId) => {
  return new Promise((resolve) => {
    // Mô phỏng API call
    setTimeout(() => {
      resolve([
        {
          id: 'reg-001',
          serviceType: 'IVF',
          registrationDate: '2023-05-15',
          appointmentDate: '2023-05-25',
          status: 'confirmed'
        },
        {
          id: 'reg-002',
          serviceType: 'CONSULT',
          registrationDate: '2023-04-10',
          appointmentDate: '2023-04-15',
          status: 'completed'
        }
      ]);
    }, 800);
  });
};

// Hủy đăng ký dịch vụ
export const cancelServiceRegistration = (registrationId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Hủy đăng ký thành công' });
    }, 1000);
  });
};

// Lấy thông tin chi tiết của một lần đăng ký
export const getServiceRegistrationDetail = (registrationId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: registrationId,
        serviceType: 'IVF',
        registrationDate: '2023-05-15',
        appointmentDate: '2023-05-25',
        status: 'confirmed',
        fullName: 'Nguyễn Văn A',
        phoneNumber: '0912345678',
        email: 'nguyenvana@example.com',
        gender: 'male',
        dateOfBirth: '1990-01-01',
        address: '123 Đường ABC, Quận 1, TP. Hồ Chí Minh',
        medicalHistory: 'Không có bệnh lý nền'
      });
    }, 800);
  });
};
