import { useState, useEffect } from "react";
import { FiGift, FiArrowRight } from "react-icons/fi";

export default function SurpriseBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Kiểm tra xem đã click CTA chưa trong session này
    const hasClickedCTA = sessionStorage.getItem('surpriseBannerCTAClicked');
    
    if (!hasClickedCTA) {
      // Hiển thị sau 2 giây khi load trang
      const timer = setTimeout(() => {
        setShow(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCTAClick = () => {
    // Scroll đến form đăng ký
    const formElement = document.getElementById('dangky');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
    // Đánh dấu đã click CTA và đóng banner
    sessionStorage.setItem('surpriseBannerCTAClicked', 'true');
    setShow(false);
  };

  const handleClose = () => {
    // Chỉ đóng banner, không lưu trạng thái
    setShow(false);
  };

  return (
    <div
      className={`surprise-banner ${show ? "visible" : "hidden"}`}
    >
      {/* Message bubble */}
      <div className="surprise-banner-message">
        <p className="surprise-banner-description pt-2">
          Hi, tôi có một bất ngờ nhỏ dành cho bạn
          <FiGift className="surprise-banner-gift-icon" />
        </p>
        
        {/* CTA Button */}
        <button
          onClick={handleCTAClick}
          className="surprise-banner-cta"
        >
          <FiArrowRight className="surprise-banner-cta-icon" />
          Xem ngay
        </button>
        
        <button
          onClick={handleClose}
          className="surprise-banner-close"
        >
          ✕
        </button>
      </div>
      
      {/* Ant image */}
      <div className="surprise-banner-ant">
        <img 
          src="/ant.png" 
          alt="Ant mascot" 
          className="ant-image"
        />
      </div>
    </div>
  );
}
