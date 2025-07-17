// Blog service for handling blog operations
// eslint-disable-next-line no-unused-vars

// Mock data for development
const mockBlogs = [
  {
    id: '1',
    title: 'Hành trình điều trị IVF thành công',
    summary: 'Chia sẻ từ một cặp vợ chồng sau 5 năm điều trị',
    content: `Sau 5 năm chạy chữa hiếm muộn, vợ chồng tôi đã may mắn có được con đầu lòng nhờ phương pháp thụ tinh trong ống nghiệm (IVF). 

Chúng tôi đã trải qua nhiều khó khăn, thử thách và đôi khi tưởng chừng như muốn từ bỏ. Nhưng với sự hỗ trợ tận tâm của bác sĩ Nguyễn Văn A và đội ngũ y tế tại Phòng khám, chúng tôi đã kiên trì thực hiện điều trị.

Hành trình IVF không dễ dàng với những mũi tiêm hàng ngày, những lần thăm khám định kỳ, và cảm giác lo lắng chờ đợi. Nhưng khi nhìn thấy hình ảnh siêu âm đầu tiên của con, mọi khó khăn đều tan biến.

Chúng tôi mong rằng chia sẻ này sẽ tiếp thêm hy vọng cho những cặp vợ chồng đang gặp khó khăn tương tự. Đừng bỏ cuộc, hãy tìm đến các chuyên gia và tin tưởng vào hành trình của mình.`,
    author: 'Nguyễn Văn A',
    category: 'IVF',
    coverImage: 'https://res.cloudinary.com/dqnq00784/image/upload/v1752731688/hmue4lmoyxoppz5qcseb.jpg',
    status: 'published',
    createdAt: '2023-05-15',
  },
  {
    id: '2',
    title: 'Những điều cần biết về IUI',
    summary: 'Các bước chuẩn bị và thực hiện IUI hiệu quả',
    content: `Bơm tinh trùng vào buồng tử cung (IUI) là một phương pháp hỗ trợ sinh sản phổ biến và ít xâm lấn. Bài viết này sẽ giúp bạn hiểu rõ về quy trình, thời điểm thực hiện và cách chuẩn bị tốt nhất.

**Quy trình IUI bao gồm:**
1. Theo dõi chu kỳ rụng trứng
2. Chuẩn bị tinh trùng (rửa và tách tinh trùng khỏe mạnh)
3. Bơm tinh trùng vào buồng tử cung vào thời điểm rụng trứng
4. Theo dõi sau thủ thuật

**Ai phù hợp với IUI?**
- Couples with unexplained infertility
- Phụ nữ có vấn đề về cổ tử cung
- Vô sinh nhẹ ở nam giới
- Nữ giới có rối loạn rụng trứng đã được điều trị

**Tỷ lệ thành công:**
Tỷ lệ thành công của IUI dao động từ 10-20% mỗi chu kỳ, tùy thuộc vào nhiều yếu tố như tuổi, nguyên nhân vô sinh và số lượng chu kỳ đã thực hiện.

**Lời khuyên:**
- Duy trì lối sống lành mạnh
- Uống đầy đủ acid folic
- Tránh căng thẳng
- Tuân thủ hướng dẫn của bác sĩ`,
    author: 'Trần Thị B',
    category: 'IUI',
    coverImage: 'https://res.cloudinary.com/dqnq00784/image/upload/v1752738968/lkjvgwblx7suspabpzd6.jpg',
    status: 'published',
    createdAt: '2023-05-10',
  },
//   {
//     id: '3',
//     title: '5 lời khuyên dinh dưỡng cho phụ nữ hiếm muộn',
//     summary: 'Những thực phẩm tốt cho khả năng sinh sản',
//     content: `Dinh dưỡng đóng vai trò quan trọng trong việc cải thiện khả năng sinh sản. Dưới đây là 5 lời khuyên dinh dưỡng dành cho phụ nữ hiếm muộn:

// **1. Bổ sung axit folic và vitamin B**
// Axit folic không chỉ quan trọng trong quá trình mang thai mà còn giúp cải thiện chất lượng trứng. Có thể tìm thấy trong rau lá xanh đậm, đậu lăng, bơ và các loại hạt.

// **2. Tăng cường thực phẩm giàu chất chống oxy hóa**
// Vitamin C, E và các chất chống oxy hóa giúp bảo vệ trứng khỏi tổn thương do gốc tự do. Nên ăn nhiều trái cây tươi, rau quả nhiều màu sắc.

// **3. Cân bằng hormone với các thực phẩm giàu omega-3**
// Cá hồi, cá thu, hạt lanh, hạt chia chứa nhiều omega-3 giúp giảm viêm và cân bằng hormone.

// **4. Kiểm soát lượng đường**
// Lượng đường cao có thể gây rối loạn nội tiết tố và ảnh hưởng đến quá trình rụng trứng. Hạn chế thực phẩm chế biến sẵn và đồ ngọt.

// **5. Cung cấp đủ protein chất lượng cao**
// Protein đóng vai trò quan trọng trong quá trình tạo hormone và phát triển nang trứng. Nên ăn đa dạng nguồn protein từ động vật và thực vật.

// Nhớ rằng, không có chế độ ăn uống nào đảm bảo khả năng thụ thai, nhưng một chế độ dinh dưỡng cân bằng và lành mạnh sẽ tạo điều kiện tốt nhất cho cơ thể của bạn.`,
//     author: 'Lê Văn C',
//     category: 'Nutrition',
//     coverImage: 'https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png',
//     status: 'published',
//     createdAt: '2023-05-05',
//   },
//   {
//     id: '4',
//     title: 'ICSI - Giải pháp cho yếu tố vô sinh nam',
//     summary: 'Phương pháp tiêm tinh trùng hiện đại cho nam giới có chất lượng tinh trùng thấp',
//     content: `ICSI (Intracytoplasmic Sperm Injection) - Tiêm tinh trùng vào bào tương noãn là một kỹ thuật hỗ trợ sinh sản tiên tiến giúp điều trị vô sinh do yếu tố nam. 

// **Khi nào cần áp dụng ICSI?**
// - Số lượng tinh trùng thấp
// - Khả năng di động của tinh trùng kém
// - Hình dạng tinh trùng bất thường
// - Đã thụ tinh trong ống nghiệm thông thường (IVF) nhưng thất bại
// - Trường hợp lấy tinh trùng từ mào tinh hoặc tinh hoàn

// **Quy trình ICSI:**
// 1. Kích thích buồng trứng và thu nhận trứng (giống như IVF)
// 2. Lấy mẫu tinh trùng hoặc sinh thiết tinh hoàn nếu cần
// 3. Dưới kính hiển vi, các nhà phôi học chọn một tinh trùng khỏe mạnh
// 4. Sử dụng kim vi phẫu tiêm trực tiếp tinh trùng vào bào tương của trứng
// 5. Theo dõi quá trình thụ tinh và phát triển phôi
// 6. Chuyển phôi vào tử cung

// **Tỷ lệ thành công:**
// ICSI có tỷ lệ thụ tinh cao, khoảng 70-85% các trứng được tiêm có thể được thụ tinh thành công.

// **Ưu điểm của ICSI:**
// - Chỉ cần một tinh trùng khỏe mạnh cho mỗi trứng
// - Giải pháp cho nhiều trường hợp vô sinh nam nghiêm trọng
// - Tăng tỷ lệ thụ tinh ở nhóm bệnh nhân đặc biệt

// Nếu bạn đang gặp vấn đề về chất lượng tinh trùng, hãy tham khảo ý kiến bác sĩ để xem ICSI có phải là lựa chọn phù hợp cho bạn hay không.`,
//     author: 'Phạm Thị D',
//     category: 'ICSI',
//     coverImage: 'https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png',
//     status: 'published',
//     createdAt: '2023-06-02',
//   },
//   {
//     id: '5',
//     title: 'Tâm lý học trong điều trị vô sinh',
//     summary: 'Chăm sóc tinh thần - Yếu tố không thể bỏ qua trong hành trình điều trị hiếm muộn',
//     content: `Quá trình điều trị vô sinh không chỉ là thách thức về mặt thể chất mà còn là áp lực tâm lý lớn. Nhiều nghiên cứu chỉ ra rằng stress và lo âu có thể ảnh hưởng tiêu cực đến kết quả điều trị.

// **Những thách thức tâm lý phổ biến:**
// - Cảm giác mất kiểm soát
// - Lo lắng về kết quả điều trị
// - Áp lực từ gia đình và xã hội
// - Tác động đến mối quan hệ vợ chồng
// - Cảm giác cô đơn và bị hiểu lầm

// **Các chiến lược hỗ trợ tâm lý:**
// 1. **Tìm kiếm hỗ trợ chuyên nghiệp:** Tham vấn tâm lý hoặc tư vấn với chuyên gia sức khỏe tâm thần

// 2. **Tham gia nhóm hỗ trợ:** Chia sẻ với những người có trải nghiệm tương tự

// 3. **Kỹ thuật thư giãn:** Yoga, thiền, hít thở sâu có thể giúp giảm căng thẳng

// 4. **Giao tiếp cởi mở:** Chia sẻ cảm xúc với bạn đời và người thân

// 5. **Đặt ranh giới:** Học cách từ chối hoặc hạn chế tham gia các sự kiện gây căng thẳng

// 6. **Tự chăm sóc bản thân:** Duy trì các hoạt động mang lại niềm vui và sự thoải mái

// Nếu bạn đang trong hành trình điều trị hiếm muộn, hãy nhớ rằng chăm sóc sức khỏe tinh thần cũng quan trọng không kém chăm sóc sức khỏe thể chất. Đừng ngần ngại tìm kiếm sự hỗ trợ khi cần thiết.`,
//     author: 'Hoàng Thị E',
//     category: 'Psychology',
//     coverImage: 'https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png',
//     status: 'published',
//     createdAt: '2023-06-10',
//   },
];

// Get all blogs
export const getAllBlogs = async () => {
  try {
    // When API is ready, uncomment the following
    // const response = await fetch(`${API_URL}/blogs`);
    // const data = await response.json();
    // return data;
    
    // For development, return mock data
    return Promise.resolve(mockBlogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
};

// Get published blogs only
export const getPublishedBlogs = async () => {
  try {
    // When API is ready, uncomment the following
    // const response = await fetch(`${API_URL}/blogs?status=published`);
    // const data = await response.json();
    // return data;
    
    // For development, return mock data
    return Promise.resolve(mockBlogs.filter(blog => blog.status === 'published'));
  } catch (error) {
    console.error('Error fetching published blogs:', error);
    return [];
  }
};

// Get blog by ID
export const getBlogById = async (id) => {
  try {
    // When API is ready, uncomment the following
    // const response = await fetch(`${API_URL}/blogs/${id}`);
    // const data = await response.json();
    // return data;
    
    // For development, return mock data
    // Convert id to string to ensure consistent comparison
    const blogId = String(id);
    console.log(`Fetching blog with ID: ${blogId}`);
    const blog = mockBlogs.find(blog => String(blog.id) === blogId);
    
    if (!blog) {
      console.warn(`No blog found with ID: ${blogId}`);
    }
    
    return Promise.resolve(blog);
  } catch (error) {
    console.error(`Error fetching blog ${id}:`, error);
    return null;
  }
};

// Create a new blog
export const createBlog = async (blogData) => {
  try {
    // When API is ready, uncomment the following
    // const response = await fetch(`${API_URL}/blogs`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(blogData),
    // });
    // const data = await response.json();
    // return data;
    
    // For development, return mock data
    const newBlog = {
      id: Date.now().toString(),
      ...blogData,
      createdAt: new Date().toISOString().split('T')[0],
    };
    mockBlogs.push(newBlog);
    return Promise.resolve(newBlog);
  } catch (error) {
    console.error('Error creating blog:', error);
    return null;
  }
};

// Update a blog
export const updateBlog = async (id, blogData) => {
  try {
    // When API is ready, uncomment the following
    // const response = await fetch(`${API_URL}/blogs/${id}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(blogData),
    // });
    // const data = await response.json();
    // return data;
    
    // For development, return mock data
    const index = mockBlogs.findIndex(blog => blog.id === id);
    if (index !== -1) {
      mockBlogs[index] = { ...mockBlogs[index], ...blogData };
      return Promise.resolve(mockBlogs[index]);
    }
    return Promise.reject(new Error(`Blog with ID ${id} not found`));
  } catch (error) {
    console.error(`Error updating blog ${id}:`, error);
    return null;
  }
};

// Delete a blog
export const deleteBlog = async (id) => {
  try {
    // When API is ready, uncomment the following
    // await fetch(`${API_URL}/blogs/${id}`, {
    //   method: 'DELETE',
    // });
    
    // For development, return mock data
    const index = mockBlogs.findIndex(blog => blog.id === id);
    if (index !== -1) {
      mockBlogs.splice(index, 1);
      return Promise.resolve({ success: true });
    }
    return Promise.reject(new Error(`Blog with ID ${id} not found`));
  } catch (error) {
    console.error(`Error deleting blog ${id}:`, error);
    return { success: false };
  }
};

const blogService = {
  getAllBlogs,
  getPublishedBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};

export default blogService;


// import apiService from './api';
// import { API_ENDPOINTS } from './apiConstants';

// class BlogService {
//   // Lấy tất cả bài viết blog
//   async getAllBlogs() {
//     try {
//       const response = await apiService.get(API_ENDPOINTS.BLOG.GET_ALL);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching all blogs:', error);
//       throw error;
//     }
//   }

//   // Lấy chi tiết blog theo ID
//   async getBlogById(id) {
//     try {
//       const response = await apiService.get(API_ENDPOINTS.BLOG.GET_BY_ID(id));
//       return response.data;
//     } catch (error) {
//       console.error(`Error fetching blog with ID ${id}:`, error);
//       throw error;
//     }
//   }

//   // Tạo blog mới
//   async createBlog(blogData) {
//     try {
//       const response = await apiService.post(API_ENDPOINTS.BLOG.CREATE, blogData);
//       return response.data;
//     } catch (error) {
//       console.error('Error creating blog:', error);
//       throw error;
//     }
//   }

//   // Cập nhật blog theo ID
//   async updateBlog(id, blogData) {
//     try {
//       const response = await apiService.put(API_ENDPOINTS.BLOG.UPDATE(id), blogData);
//       return response.data;
//     } catch (error) {
//       console.error(`Error updating blog with ID ${id}:`, error);
//       throw error;
//     }
//   }

//   // Xoá blog theo ID
//   async deleteBlog(id) {
//     try {
//       const response = await apiService.delete(API_ENDPOINTS.BLOG.DELETE(id));
//       return response.data;
//     } catch (error) {
//       console.error(`Error deleting blog with ID ${id}:`, error);
//       throw error;
//     }
//   }
// }

// const blogService = new BlogService();
// export default blogService;
