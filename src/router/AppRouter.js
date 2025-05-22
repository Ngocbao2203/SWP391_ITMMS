// src/router/AppRouter.js
import { Routes, Route, useLocation } from "react-router-dom";
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import Home from '../pages/public/Home';


const AppRouter = () => {
  const location = useLocation();

  return (
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>

  );
 
};

export default AppRouter;