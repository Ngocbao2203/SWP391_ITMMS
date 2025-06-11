import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/UserService.css";
import MainLayout from "../../layouts/MainLayout";

export default function UserService() {
  const navigate = useNavigate();

  const showRegistrationForm = (service) => {
    // Điều hướng đến trang đăng ký dịch vụ mới với ID dịch vụ
    navigate(`/service-register/${service.id}`);
  };

  const dataServices = [
    {
      id: "ivf", // 👈 PHẢI THÊM id TƯƠNG ỨNG VỚI `useParams()` Ở ServiceDetail
      img: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
      title: "Thụ tinh trong ống nghiệm (IVF)",
      desc: "Phương pháp điều trị hiệu quả cao giúp các cặp vợ chồng hiếm muộn có cơ hội làm cha mẹ.",
      type: "IVF"
    },
    {
      id: "icsi",
      img: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
      title: "Tiêm tinh trùng vào bào tương noãn (ICSI)",
      desc: "Kỹ thuật hỗ trợ sinh sản tiên tiến dành cho các trường hợp vô sinh do yếu tố nam.",
      type: "ICSI"
    },
    {
      id: "iui",
      img: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
      title: "Bơm tinh trùng vào buồng tử cung (IUI)",
      desc: "Phương pháp đơn giản, ít xâm lấn giúp tăng khả năng thụ thai tự nhiên.",
      type: "IUI"
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
            <div className="fertility-service-card" key={DS.id}>
              <div className="service-image">
                <img src={DS.img} alt={DS.img} />
              </div>
              <h3 className="service-title">{DS.title}</h3>
              <p className="service-description">{DS.desc}</p>
              <div className="service-buttons">
                <button className="btn btn-more" onClick={() => navigate(`/services/${DS.id}`)}>
                  Tìm hiểu thêm
                </button>
                <button className="btn btn-register" onClick={() => showRegistrationForm(DS)}>
                  Đặt lịch
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cta-container">
          <h3 className="cta-title">Hãy để chúng tôi đồng hành cùng bạn</h3>
          <p className="cta-description">
            Đội ngũ bác sĩ giàu kinh nghiệm và thiết bị hiện đại sẵn sàng hỗ trợ giấc mơ làm cha mẹ của bạn
          </p>
          <button 
            className="cta-button"
            onClick={() => showRegistrationForm({ title: "Tư vấn miễn phí", type: "CONSULT" })}>
            Tư vấn miễn phí
          </button>
        </div>
      </section>
    </MainLayout>
  );
}
