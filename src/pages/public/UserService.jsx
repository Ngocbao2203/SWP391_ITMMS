import React from "react";
import "../../styles/UserService.css"; // Import your CSS file for styling
import MainLayout from "../../layouts/MainLayout";
export default function UserService() {
  const dataServices = [
    {
      img: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
      title: "Thụ tinh trong ống nghiệm (IVF)",
      desc: "Phương pháp điều trị hiệu quả cao giúp các cặp vợ chồng hiếm muộn có cơ hội làm cha mẹ.",
    },
    {
      img: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
      title: "Tiêm tinh trùng vào bào tương noãn (ICSI)",
      desc: "Kỹ thuật hỗ trợ sinh sản tiên tiến dành cho các trường hợp vô sinh do yếu tố nam.",
    },
    {
      img: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
      title: "Bơm tinh trùng vào buồng tử cung (IUI)",
      desc: "Phương pháp đơn giản, ít xâm lấn giúp tăng khả năng thụ thai tự nhiên.",
    },
  ];
  return (
    <>
      <MainLayout>
        {/* Service Section */}
        <section className="fertility-services-container">
          <div className="services-header">
            <h2 className="section-title">Dịch vụ điều trị hiếm muộn</h2>
            <p className="section-description">
              Chúng tôi cung cấp các giải pháp y tế hiện đại và toàn diện để hỗ
              trợ hành trình làm cha mẹ của bạn
            </p>
          </div>
          <div className="fertility-services-grid">
            {/* Service Card 1 */}
            {dataServices.map((DS) => (
              <div className="fertility-service-card">
                <div className="service-image">
                  <img src={DS.img} alt={DS.img} />
                </div>
                <h3 className="service-title">{DS.title}</h3>
                <p className="service-description">{DS.desc}</p>
                <div className="service-buttons">
                  <a href="#" className="btn btn-more">
                    Tìm hiểu thêm
                  </a>
                  <a href="#" className="btn btn-register">
                    Đăng ký
                  </a>
                </div>
              </div>
            ))}
          </div>
          {/* Call to action */}
          <div className="cta-container">
            <h3 className="cta-title">Hãy để chúng tôi đồng hành cùng bạn</h3>
            <p className="cta-description">
              Đội ngũ bác sĩ giàu kinh nghiệm và thiết bị hiện đại sẵn sàng hỗ
              trợ giấc mơ làm cha mẹ của bạn
            </p>
            <a href="#contact" className="cta-button">
              Tư vấn miễn phí
            </a>
          </div>
        </section>
      </MainLayout>
    </>
  );
}
