// File: src/pages/UserService.jsx

import React from "react";
import "../../styles/UserService.css";
import MainLayout from "../../layouts/MainLayout";
import ServiceCard from "../../components/public/ServiceCard";

export default function UserService() {
  const dataServices = [
    {
      img: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
      title: "Thụ tinh trong ống nghiệm (IVF)",
      desc: "Phương pháp điều trị hiệu quả cao giúp các cặp vợ chồng hiếm muộn có cơ hội làm cha mẹ.",
      serviceId: "ivf", // Thêm id cho mỗi dịch vụ
    },
    {
      img: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
      title: "Tiêm tinh trùng vào bào tương noãn (ICSI)",
      desc: "Kỹ thuật hỗ trợ sinh sản tiên tiến dành cho các trường hợp vô sinh do yếu tố nam.",
      serviceId: "icsi", // Thêm id cho mỗi dịch vụ
    },
    {
      img: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
      title: "Bơm tinh trùng vào buồng tử cung (IUI)",
      desc: "Phương pháp đơn giản, ít xâm lấn giúp tăng khả năng thụ thai tự nhiên.",
      serviceId: "iui", // Thêm id cho mỗi dịch vụ
    },
  ];

  return (
    <MainLayout>
      <section className="fertility-services-container">
        <div className="services-header">
          <h2 className="section-title">Dịch vụ điều trị hiếm muộn</h2>
          <p className="section-description">
            Chúng tôi cung cấp các giải pháp y tế hiện đại và toàn diện để hỗ trợ hành trình làm cha mẹ của bạn
          </p>
        </div>
        <div className="fertility-services-grid">
          {dataServices.map((DS) => (
            <ServiceCard
              key={DS.serviceId} // Sử dụng serviceId làm key
              img={DS.img}
              title={DS.title}
              desc={DS.desc}
              serviceId={DS.serviceId} // Truyền serviceId vào
            />
          ))}
        </div>
        <div className="cta-container">
          <h3 className="cta-title">Hãy để chúng tôi đồng hành cùng bạn</h3>
          <p className="cta-description">
            Đội ngũ bác sĩ giàu kinh nghiệm và thiết bị hiện đại sẵn sàng hỗ trợ giấc mơ làm cha mẹ của bạn
          </p>
          <a href="#contact" className="cta-button">
            Tư vấn miễn phí
          </a>
        </div>
      </section>
    </MainLayout>
  );
}
