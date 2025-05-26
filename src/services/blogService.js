// Blog service for handling blog operations
// eslint-disable-next-line no-unused-vars
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Mock data for development
const mockBlogs = [
  {
    id: '1',
    title: 'Hành trình điều trị IVF thành công',
    summary: 'Chia sẻ từ một cặp vợ chồng sau 5 năm điều trị',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    author: 'Nguyễn Văn A',
    category: 'IVF',
    coverImage: 'https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png',
    status: 'published',
    createdAt: '2023-05-15',
  },
  {
    id: '2',
    title: 'Những điều cần biết về IUI',
    summary: 'Các bước chuẩn bị và thực hiện IUI hiệu quả',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    author: 'Trần Thị B',
    category: 'IUI',
    coverImage: 'https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png',
    status: 'draft',
    createdAt: '2023-05-10',
  },
  {
    id: '3',
    title: '5 lời khuyên dinh dưỡng cho phụ nữ hiếm muộn',
    summary: 'Những thực phẩm tốt cho khả năng sinh sản',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    author: 'Lê Văn C',
    category: 'Nutrition',
    coverImage: 'https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png',
    status: 'published',
    createdAt: '2023-05-05',
  },
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
    const blog = mockBlogs.find(blog => blog.id === id);
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
