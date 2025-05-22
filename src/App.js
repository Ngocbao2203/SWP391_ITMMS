import { useEffect } from 'react' // Thêm useEffect
import AppRouter from './router/AppRouter' // Import AppRouter
// import { ThemeProvider } from './context/ThemeContext' // Import ThemeProvider
import AOS from 'aos' 
import 'aos/dist/aos.css' 
// import './styles/ThemeToggle.css' // Import CSS của bạn
import { BrowserRouter } from "react-router-dom";

function App() {
  // Khởi tạo AOS khi component được mount
  useEffect(() => {
    AOS.init({
      duration: 1000, // Thời gian hiệu ứng (ms)
      once: true, // Hiệu ứng chỉ chạy một lần
    })
  }, [])

  return (
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
  );
}

export default App