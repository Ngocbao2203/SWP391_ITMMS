import Header from "../components/public/Header";
import Footer from "../components/public/Footer"; 

const MainLayout = ({ children }) => {
  return (
    <div className="layout-container">
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;