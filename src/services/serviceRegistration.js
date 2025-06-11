// Service Registration API Service
// This file will handle API calls for the service registration system

/**
 * Fetches all available services
 * @returns {Promise} Promise that resolves to an array of service objects
 */
export const getServices = async () => {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { 
          id: "ivf", 
          name: "Thụ tinh trong ống nghiệm (IVF)", 
          image: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
          description: "Phương pháp điều trị hiệu quả cao giúp các cặp vợ chồng hiếm muộn có cơ hội làm cha mẹ."
        },
        { 
          id: "icsi", 
          name: "Tiêm tinh trùng vào bào tương noãn (ICSI)", 
          image: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
          description: "Kỹ thuật hỗ trợ sinh sản tiên tiến dành cho các trường hợp vô sinh do yếu tố nam."
        },
        { 
          id: "iui", 
          name: "Bơm tinh trùng vào buồng tử cung (IUI)", 
          image: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
          description: "Phương pháp đơn giản, ít xâm lấn giúp tăng khả năng thụ thai tự nhiên."
        }
      ]);
    }, 500);
  });
};

/**
 * Fetches a single service by ID
 * @param {string} serviceId - The ID of the service to fetch
 * @returns {Promise} Promise that resolves to a service object
 */
export const getServiceById = async (serviceId) => {
  // TODO: Replace with actual API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const services = {
        ivf: { 
          id: "ivf", 
          name: "Thụ tinh trong ống nghiệm (IVF)", 
          image: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
          description: "Phương pháp điều trị hiệu quả cao giúp các cặp vợ chồng hiếm muộn có cơ hội làm cha mẹ.",
          detailedDescription: "Thụ tinh trong ống nghiệm (IVF) là phương pháp hỗ trợ sinh sản hiện đại, trong đó trứng được lấy từ buồng trứng của người phụ nữ và thụ tinh với tinh trùng trong phòng thí nghiệm. Sau khi thụ tinh thành công, phôi được nuôi cấy từ 3-5 ngày trước khi chuyển vào tử cung của người phụ nữ để phát triển thành thai nhi.",
          price: "150,000,000 VND",
          duration: "2-3 tháng",
          success_rate: "60-70%",
          indications: [
            "Vô sinh do tắc vòi trứng",
            "Vô sinh do yếu tố nam",
            "Vô sinh không rõ nguyên nhân",
            "Đã thất bại với các phương pháp điều trị khác"
          ],
          process_steps: [
            "Kích thích buồng trứng",
            "Thu thập trứng",
            "Thụ tinh và nuôi cấy phôi",
            "Chuyển phôi",
            "Hỗ trợ pha hoàng thể"
          ],
          faq: [
            {
              question: "IVF có đau không?",
              answer: "Thủ thuật lấy trứng trong IVF có thể gây khó chịu nhẹ, nhưng được thực hiện dưới gây mê nên bạn sẽ không cảm thấy đau đớn."
            },
            {
              question: "Tỷ lệ thành công của IVF là bao nhiêu?",
              answer: "Tỷ lệ thành công của IVF phụ thuộc vào nhiều yếu tố như tuổi, nguyên nhân vô sinh, chất lượng tinh trùng và trứng. Trung bình dao động từ 40-70%."
            },
            {
              question: "IVF có tác dụng phụ gì không?",
              answer: "Một số tác dụng phụ có thể gặp bao gồm: khó chịu từ thuốc kích thích buồng trứng, hội chứng quá kích buồng trứng (hiếm gặp), và tỷ lệ đa thai cao hơn."
            }
          ],
          doctors: [
            { id: "dr1", name: "Dr. Nguyễn Văn An", specialty: "IVF Specialist", photo: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png", experience: "15 năm kinh nghiệm" },
            { id: "dr3", name: "Dr. Lê Văn Cường", specialty: "ICSI Specialist", photo: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png", experience: "10 năm kinh nghiệm" },
            { id: "dr4", name: "Dr. Phạm Thu Dung", specialty: "Fertility Expert", photo: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png", experience: "18 năm kinh nghiệm" }
          ]
        },
        icsi: { 
          id: "icsi", 
          name: "Tiêm tinh trùng vào bào tương noãn (ICSI)", 
          image: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
          description: "Kỹ thuật hỗ trợ sinh sản tiên tiến dành cho các trường hợp vô sinh do yếu tố nam.",
          detailedDescription: "ICSI là một kỹ thuật thụ tinh trong ống nghiệm nâng cao, trong đó một tinh trùng duy nhất được chọn lọc và tiêm trực tiếp vào bào tương của trứng để thụ tinh. ICSI đặc biệt hiệu quả với các trường hợp vô sinh do yếu tố nam nghiêm trọng.",
          price: "170,000,000 VND",
          duration: "2-3 tháng",
          success_rate: "65-75%",
          indications: [
            "Số lượng tinh trùng thấp",
            "Độ di động của tinh trùng kém",
            "Hình thái tinh trùng bất thường",
            "Thất bại thụ tinh trong IVF truyền thống"
          ],
          process_steps: [
            "Kích thích buồng trứng",
            "Thu thập trứng và tinh trùng",
            "Tiêm tinh trùng vào trứng",
            "Nuôi cấy phôi",
            "Chuyển phôi vào tử cung"
          ],
          faq: [
            {
              question: "ICSI khác gì so với IVF truyền thống?",
              answer: "Trong IVF truyền thống, tinh trùng và trứng được đặt gần nhau để tự thụ tinh. Với ICSI, tinh trùng được chọn và tiêm trực tiếp vào trứng, tăng khả năng thụ tinh đặc biệt khi chất lượng tinh trùng kém."
            },
            {
              question: "ICSI có tỷ lệ thành công cao hơn IVF không?",
              answer: "ICSI có tỷ lệ thụ tinh cao hơn đối với các trường hợp yếu tố nam. Tuy nhiên, tỷ lệ thai kỳ thành công phụ thuộc vào nhiều yếu tố khác ngoài quá trình thụ tinh."
            },
            {
              question: "ICSI có làm tăng nguy cơ dị tật bẩm sinh không?",
              answer: "Có một số quan ngại về việc tăng nhẹ tỷ lệ dị tật bẩm sinh khi sử dụng ICSI, nhưng nguy cơ này rất nhỏ và phần lớn trẻ sinh ra từ ICSI hoàn toàn khỏe mạnh."
            }
          ],
          doctors: [
            { id: "dr1", name: "Dr. Nguyễn Văn An", specialty: "IVF Specialist", photo: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png", experience: "15 năm kinh nghiệm" },
            { id: "dr3", name: "Dr. Lê Văn Cường", specialty: "ICSI Specialist", photo: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png", experience: "10 năm kinh nghiệm" },
            { id: "dr4", name: "Dr. Phạm Thu Dung", specialty: "Fertility Expert", photo: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png", experience: "18 năm kinh nghiệm" }
          ]
        },
        iui: { 
          id: "iui", 
          name: "Bơm tinh trùng vào buồng tử cung (IUI)", 
          image: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
          description: "Phương pháp đơn giản, ít xâm lấn giúp tăng khả năng thụ thai tự nhiên.",
          detailedDescription: "IUI là phương pháp hỗ trợ sinh sản đơn giản, trong đó tinh trùng đã được xử lý và cô đặc được bơm trực tiếp vào buồng tử cung của người phụ nữ trong thời điểm rụng trứng. Phương pháp này nhằm rút ngắn quãng đường tinh trùng đi đến gặp trứng.",
          price: "30,000,000 VND",
          duration: "1-2 tháng mỗi chu kỳ",
          success_rate: "15-20% mỗi chu kỳ",
          indications: [
            "Vô sinh không rõ nguyên nhân",
            "Nhẹ đến trung bình do yếu tố nam",
            "Không có quan hệ tình dục do lý do vật lý hoặc tâm lý",
            "Sử dụng tinh trùng của người hiến tặng"
          ],
          process_steps: [
            "Kích thích buồng trứng nhẹ (tùy trường hợp)",
            "Theo dõi sự rụng trứng",
            "Thu thập và xử lý tinh trùng",
            "Bơm tinh trùng vào buồng tử cung"
          ],
          faq: [
            {
              question: "IUI có đau không?",
              answer: "IUI thường không gây đau đớn, nhiều phụ nữ mô tả cảm giác tương tự như khi làm xét nghiệm Pap smear. Một số người có thể cảm thấy khó chịu nhẹ hoặc chuột rút nhẹ."
            },
            {
              question: "Sau IUI nên nghỉ ngơi bao lâu?",
              answer: "Sau thủ thuật IUI, bạn có thể nghỉ ngơi khoảng 15-20 phút tại phòng khám, sau đó có thể trở lại các hoạt động bình thường. Không cần phải nằm nghỉ kéo dài."
            },
            {
              question: "Bao nhiêu chu kỳ IUI được khuyến nghị trước khi chuyển sang IVF?",
              answer: "Thông thường, các bác sĩ khuyến nghị thực hiện 3-4 chu kỳ IUI trước khi cân nhắc chuyển sang các phương pháp hỗ trợ sinh sản cao cấp hơn như IVF."
            }
          ],
          doctors: [
            { id: "dr2", name: "Dr. Trần Thị Bình", specialty: "IUI Expert", photo: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png", experience: "12 năm kinh nghiệm" },
            { id: "dr4", name: "Dr. Phạm Thu Dung", specialty: "Fertility Expert", photo: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png", experience: "18 năm kinh nghiệm" }
          ]
        }
      };
      
      if (services[serviceId]) {
        resolve(services[serviceId]);
      } else {
        reject(new Error("Service not found"));
      }
    }, 500);
  });
};

/**
 * Fetches all doctors available for a specific service
 * @param {string} serviceId - The ID of the service
 * @returns {Promise} Promise that resolves to an array of doctor objects
 */
export const getDoctorsByService = async (serviceId) => {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const allDoctors = [
        { id: "dr1", name: "Dr. Nguyễn Văn An", specialty: "IVF Specialist", services: ["ivf", "icsi"], photo: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png", experience: "15 năm kinh nghiệm" },
        { id: "dr2", name: "Dr. Trần Thị Bình", specialty: "IUI Expert", services: ["iui", "ivf"], photo: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png", experience: "12 năm kinh nghiệm" },
        { id: "dr3", name: "Dr. Lê Văn Cường", specialty: "ICSI Specialist", services: ["icsi", "ivf"], photo: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png", experience: "10 năm kinh nghiệm" },
        { id: "dr4", name: "Dr. Phạm Thu Dung", specialty: "Fertility Expert", services: ["ivf", "icsi", "iui"], photo: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png", experience: "18 năm kinh nghiệm" }
      ];
      
      const filteredDoctors = serviceId 
        ? allDoctors.filter(doctor => doctor.services.includes(serviceId))
        : allDoctors;
      
      resolve(filteredDoctors);
    }, 500);
  });
};

/**
 * Submits a service registration form
 * @param {Object} formData - The form data to submit
 * @returns {Promise} Promise that resolves to the result of the submission
 */
export const registerService = async (formData) => {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful registration
      const registrationId = "REG" + Math.floor(1000000 + Math.random() * 9000000);
      resolve({
        success: true,
        registrationId,
        message: "Đăng ký dịch vụ thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.",
        ...formData,
        status: "pending",
        submittedAt: new Date().toISOString()
      });
    }, 1500);
  });
};

/**
 * Gets available appointment dates for a specific doctor
 * @param {string} doctorId - The ID of the doctor
 * @returns {Promise} Promise that resolves to an array of available dates
 */
export const getAvailableDates = async (doctorId) => {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const today = new Date();
      const availableDates = [];
      
      // Generate available dates for the next 30 days
      for (let i = 1; i <= 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        // Skip weekends
        if (date.getDay() !== 0 && date.getDay() !== 6) {
          availableDates.push(date.toISOString().split('T')[0]);
        }
      }
      
      resolve(availableDates);
    }, 500);
  });
};

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

// Lấy lịch sử đăng ký dịch vụ của người dùng
export const getUserServiceRegistrations = (userId) => {
  return new Promise((resolve) => {
    // Mô phỏng API call
    setTimeout(() => {
      resolve([
        {
          id: 'reg123',
          userId: userId,
          serviceId: 'ivf',
          serviceName: 'Thụ tinh trong ống nghiệm (IVF)',
          doctorId: 'dr1',
          doctorName: 'Dr. Nguyễn Văn An',
          appointmentDate: '2025-06-15',
          appointmentTime: '09:00',
          registrationDate: '2025-06-01',
          status: 'confirmed'
        },
        {
          id: 'reg456',
          userId: userId,
          serviceId: 'iui',
          serviceName: 'Bơm tinh trùng vào buồng tử cung (IUI)',
          doctorId: 'dr2',
          doctorName: 'Dr. Trần Thị Bình',
          appointmentDate: '2025-06-22',
          appointmentTime: '14:00',
          registrationDate: '2025-06-05',
          status: 'pending'
        }
      ]);
    }, 500);
  });
};