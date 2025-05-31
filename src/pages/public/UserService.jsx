import React, { useState } from "react";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom"; // ⬅️ THÊM DÒNG NÀY
import "../../styles/UserService.css";
=======
import "../../styles/UserService.css"; // Import your CSS file for styling
>>>>>>> 5c2be8a878ec250aff1e1c0f4fa0878f385d54f8
import MainLayout from "../../layouts/MainLayout";
import ServiceRegistrationForm from "../../components/public/ServiceRegistrationForm";

export default function UserService() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
<<<<<<< HEAD
  const navigate = useNavigate(); // ⬅️ THÊM DÒNG NÀY

=======
  
>>>>>>> 5c2be8a878ec250aff1e1c0f4fa0878f385d54f8
  const showRegistrationForm = (service) => {
    setSelectedService(service);
    setIsModalVisible(true);
  };
<<<<<<< HEAD

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

=======
  
  const handleModalClose = () => {
    setIsModalVisible(false);
  };
  
>>>>>>> 5c2be8a878ec250aff1e1c0f4fa0878f385d54f8
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
<<<<<<< HEAD
    <MainLayout>
      <ServiceRegistrationForm
        visible={isModalVisible}
        onClose={handleModalClose}
        service={selectedService}
      />
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
                  Đăng ký
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
=======
    <>      <MainLayout>
        {/* Form đăng ký dịch vụ */}
        <ServiceRegistrationForm 
          visible={isModalVisible}
          onClose={handleModalClose}
          service={selectedService}
        />
        
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
                <p className="service-description">{DS.desc}</p>                <div className="service-buttons">
                  <button className="btn btn-more">
                    Tìm hiểu thêm
                  </button>
                  <button className="btn btn-register" onClick={() => showRegistrationForm(DS)}>
                    Đăng ký
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Call to action */}          <div className="cta-container">
            <h3 className="cta-title">Hãy để chúng tôi đồng hành cùng bạn</h3>
            <p className="cta-description">
              Đội ngũ bác sĩ giàu kinh nghiệm và thiết bị hiện đại sẵn sàng hỗ
              trợ giấc mơ làm cha mẹ của bạn
            </p>            <button 
               className="cta-button"
               onClick={() => showRegistrationForm({title: "Tư vấn miễn phí", type: "CONSULT"})}>
              Tư vấn miễn phí
            </button>
          </div>
        </section>
      </MainLayout>
    </>
>>>>>>> 5c2be8a878ec250aff1e1c0f4fa0878f385d54f8
  );
}
