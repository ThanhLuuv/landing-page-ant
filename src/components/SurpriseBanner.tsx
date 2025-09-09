import { useState, useEffect } from "react";
import { FiGift, FiArrowRight } from "react-icons/fi";

export default function SurpriseBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Kiểm tra xem đã hiển thị banner chưa trong session này
    const hasShownBanner = sessionStorage.getItem('surpriseBannerShown');
    
    if (!hasShownBanner) {
      // Hiển thị sau 2 giây khi load trang
      const timer = setTimeout(() => {
        setShow(true);
        // Đánh dấu đã hiển thị trong session này
        sessionStorage.setItem('surpriseBannerShown', 'true');
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
    // Đóng banner sau khi click CTA
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
          onClick={() => setShow(false)}
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
