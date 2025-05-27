// File: src/components/ServiceCard.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // Đảm bảo đã cài React Router

const ServiceCard = ({ img, title, desc, serviceId }) => {
  return (
    <div className="fertility-service-card">
      <div className="service-image">
        <img src={img} alt={title} />
      </div>
      <h3 className="service-title">{title}</h3>
      <p className="service-description">{desc}</p>
      <div className="service-buttons">
        {/* Liên kết "Tìm hiểu thêm" */}
        <Link to={`/services/${serviceId}`} className="btn btn-more">
          Tìm hiểu thêm
        </Link>
        {/* Liên kết "Đăng ký" */}
        <Link to={`/register/${serviceId}`} className="btn btn-register">
          Đăng ký
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
