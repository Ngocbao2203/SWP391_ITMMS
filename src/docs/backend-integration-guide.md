# Hướng dẫn tích hợp backend cho ứng dụng ITMMS

Tài liệu này cung cấp hướng dẫn về các điểm cần thay đổi trong mã nguồn frontend khi tích hợp với backend thực tế. Hiện tại, ứng dụng đang sử dụng dữ liệu mẫu và lưu trữ trong localStorage.

## Tổng quan

Quá trình tích hợp sẽ bao gồm:
1. Thay thế các cuộc gọi từ `authService` bằng API calls đến backend
2. Thay thế dữ liệu mẫu bằng dữ liệu thực từ API
3. Cập nhật xử lý lỗi và các trạng thái loading

## Các services cần cập nhật

### Authentication Service (`authService.js`)

- **Đăng ký**: `register()` → `POST /api/auth/register`
- **Đăng nhập**: `login()` → `POST /api/auth/login`
- **Đăng xuất**: `logout()` → `POST /api/auth/logout`
- **Lấy thông tin người dùng**: `getCurrentUser()` → `GET /api/users/current`
- **Cập nhật thông tin người dùng**: `updateUserProfile()` → `PUT /api/users/:id`

### Blog Service (`blogService.js`)

- **Lấy tất cả bài viết**: `getAllBlogs()` → `GET /api/blogs`
- **Lấy bài viết đã xuất bản**: `getPublishedBlogs()` → `GET /api/blogs?status=published`
- **Lấy bài viết theo ID**: `getBlogById()` → `GET /api/blogs/:id`
- **Tạo bài viết**: `createBlog()` → `POST /api/blogs`
- **Cập nhật bài viết**: `updateBlog()` → `PUT /api/blogs/:id`
- **Xóa bài viết**: `deleteBlog()` → `DELETE /api/blogs/:id`

## Hướng dẫn tích hợp cho từng page

### Trang User Profile (`UserProfile.jsx`)

#### 1. Lấy thông tin người dùng

```javascript
// Thay thế:
const currentUser = authService.getCurrentUser();

// Bằng:
const response = await axios.get('/api/users/current');
const currentUser = response.data;
```

#### 2. Cập nhật thông tin người dùng

```javascript
// Thay thế:
const result = await authService.updateUserProfile(userInfo.id, updatedData);

// Bằng:
const response = await axios.put(`/api/users/${userInfo.id}`, updatedData);
const result = response.data;
```

#### 3. Tải lên avatar

```javascript
// Thay thế:
const result = await authService.updateUserProfile(userInfo.id, { avatar: imageUrl });

// Bằng:
const formData = new FormData();
formData.append('avatar', info.file.originFileObj);
const response = await axios.post(`/api/users/${userInfo.id}/avatar`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
const result = response.data;
```

#### 4. Lấy lịch sử y tế

```javascript
// Thay thế dữ liệu mẫu:
setMedicalHistory([...]);

// Bằng:
const response = await axios.get(`/api/patients/${userInfo.id}/medical-history`);
setMedicalHistory(response.data);
```

#### 5. Lấy lịch điều trị

```javascript
// Thay thế dữ liệu mẫu:
setTreatmentSchedule([...]);

// Bằng:
const response = await axios.get(`/api/patients/${userInfo.id}/treatment-schedules`);
setTreatmentSchedule(response.data);
```

#### 6. Lấy tài liệu y tế

```javascript
// Thay thế dữ liệu mẫu:
setDocuments([...]);

// Bằng:
const response = await axios.get(`/api/patients/${userInfo.id}/documents`);
setDocuments(response.data);
```

#### 7. Lấy bài viết

```javascript
// Thay thế:
const data = await getPublishedBlogs();

// Bằng:
const response = await axios.get('/api/blogs/published');
const data = response.data;
```

## Xử lý JWT Token

Khi tích hợp với backend thực tế, bạn nên sử dụng JWT token để xác thực. Đây là cách triển khai:

1. **Lưu trữ token**: Sau khi đăng nhập, lưu JWT token vào localStorage

```javascript
const handleLogin = async (credentials) => {
  const response = await axios.post('/api/auth/login', credentials);
  const { token, user } = response.data;
  
  // Lưu token
  localStorage.setItem('token', token);
  
  // Lưu thông tin user
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  return { success: true, user };
};
```

2. **Tự động gửi token với mỗi request**:

```javascript
import axios from 'axios';

// Tạo instance axios với baseURL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
});

// Thêm interceptor để tự động gửi token với mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Thêm interceptor để xử lý lỗi 401 (Unauthorized)
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    // Xóa token và thông tin user
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    
    // Chuyển người dùng về trang đăng nhập
    window.location.href = '/login';
  }
  
  return Promise.reject(error);
});

export default api;
```

## Quản lý trạng thái loading và xử lý lỗi

Khi tích hợp với backend, hãy đảm bảo xử lý trạng thái loading và các lỗi một cách nhất quán:

```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const fetchData = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await api.get('/endpoint');
    setData(response.data);
  } catch (err) {
    setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau');
    message.error(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau');
  } finally {
    setLoading(false);
  }
};
```

## Tổng kết

Khi tích hợp với backend, cần:
1. Thay thế tất cả các cuộc gọi đến các services hiện tại bằng API calls
2. Cập nhật xử lý token để xác thực
3. Xử lý loading state và thông báo lỗi một cách nhất quán
4. Cập nhật các URLs trong ứng dụng để trỏ đến endpoints đúng

Việc này sẽ giúp chuyển đổi từ ứng dụng sử dụng localStorage sang ứng dụng với backend thực tế một cách suôn sẻ.
