import { FiCheckCircle, FiZap, FiClock, FiArrowRight, FiShield, FiPlayCircle } from 'react-icons/fi'

export default function Header() {
  return (
    <>
      {/* DECOR SHAPES (global, non-interactive) */}
      <div className="decor decor--1" aria-hidden="true" />
      <div className="decor decor--2" aria-hidden="true" />
      <div className="decor decor--3" aria-hidden="true" />

      {/* PROMO BAR */}
      <div className="promo-bar promo-bar--angled">
        <div className="container promo-inner">
          <span className="promo-text">
            Học thử 1-1 với giáo viên chất lượng <strong>miễn phí</strong>
          </span>
          <a href="#dangky" className="promo-cta promo-badge badge--pulse">
            Đăng ký ngay <FiArrowRight size={16} />
          </a>
        </div>
      </div>

      {/* HERO */}
      <header className="hero section hero--gradient">
        {/* background blobs */}
        <div className="blob blob--a" aria-hidden="true" />
        <div className="blob blob--b" aria-hidden="true" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1>
              Học Tiếng Anh 1-1 theo nhu cầu, <span className="text-accent">80–90k/buổi</span>
            </h1>
            <p className="lead">
              Chọn giáo viên phù hợp, đặt lịch nhanh, 
            </p>
            <p className="lead">
              <strong>Thanh toán theo buổi</strong>,
              cân mọi loại tiếng Anh.
            </p>

            {/* Social proof — circular chips */}
            <div className="proof">
              <div className="chip circle">
                <strong>4.9/5</strong>
                <span>điểm hài lòng</span>
              </div>
              <div className="chip circle">
                <strong>1.200+</strong>
                <span>học viên</span>
              </div>
              <div className="chip circle">
                <strong>24h</strong>
                <span>xếp lịch</span>
              </div>
            </div>

            <div className="price-strip">
              <span className="pill"><FiCheckCircle size={16} /> Thanh toán theo buổi</span>
              <span className="pill"><FiCheckCircle size={16} /> Hoàn tiền nếu không phù hợp</span>
              <span className="pill"><FiCheckCircle size={16} /> Giá minh bạch 80–90k</span>
            </div>

            <div className="actions">
              <a href="#dangky" className="btn">
                Học thử ngay <FiPlayCircle size={18} />
              </a>
            </div>

            {/* trust bullets with icons inside soft circles */}
            <ul className="bullets">
              <li><span className="icon-dot"><FiZap size={14} /></span> Tối đa hoá thời lượng nói</li>
              <li><span className="icon-dot"><FiShield size={14} /></span> Giá dễ duy trì dài hạn</li>
              <li><span className="icon-dot"><FiClock size={14} /></span> Kết nối trong 24h</li>
            </ul>
          </div>

          {/* Value Card — ticket / cut-corner with arrow ribbon */}
          <div className="visual">
            <div className="ribbon ribbon--arrow">Bán chạy</div>
            <div className="card ticket">
              <div className="demo-banner demo-banner--radial">
                <div className="demo-banner__head">Gói 1-1 theo buổi</div>
                <div className="demo-banner__body">
                  <div>
                    <div className="price">80–90k/buổi</div>
                    <div className="caption">Đặt lịch linh hoạt • Học trước từng buổi</div>
                  </div>
                  <a className="btn" href="#dangky">Chọn gói này</a>
                </div>
              </div>
              <ul className="list--check">
                <li><FiCheckCircle size={16} className="check" /> Không phải đóng cả khoá</li>
                <li><FiCheckCircle size={16} className="check" /> Giáo viên duyệt chất lượng</li>
                <li><FiCheckCircle size={16} className="check" /> Nhắc lịch tự động</li>
              </ul>
              <div className="trust-logos">
                <div className="logo-skel" aria-hidden="true" />
                <div className="logo-skel" aria-hidden="true" />
                <div className="logo-skel" aria-hidden="true" />
                <div className="logo-skel" aria-hidden="true" />
                <div className="logo-skel" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        {/* curved divider */}
        <div className="curve" aria-hidden="true" />
      </header>
    </>
  )
}
