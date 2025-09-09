import { FiX, FiPhone, FiMail, FiMessageCircle } from 'react-icons/fi'

interface PolicyModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PolicyModal({ isOpen, onClose }: PolicyModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Chính sách Bảo mật Thông tin</h2>
          <button className="modal-close" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="policy-section">
            <h3>1. Thông tin thu thập</h3>
            <p>Chúng tôi thu thập các thông tin sau khi bạn đăng ký tư vấn:</p>
            <ul>
              <li><strong>Thông tin cá nhân:</strong> Họ tên, số điện thoại</li>
              <li><strong>Thông tin học tập:</strong> Mục tiêu học tiếng Anh, trình độ hiện tại</li>
              <li><strong>Thông tin liên hệ:</strong> Email, Zalo (nếu cung cấp)</li>
            </ul>
          </div>

          <div className="policy-section">
            <h3>2. Mục đích sử dụng thông tin</h3>
            <ul>
              <li>Tư vấn và gợi ý giáo viên phù hợp với nhu cầu học tập</li>
              <li>Liên hệ để xếp lịch học thử miễn phí</li>
              <li>Gửi thông tin về các khóa học và chương trình ưu đãi</li>
              <li>Cải thiện chất lượng dịch vụ và trải nghiệm người dùng</li>
              <li>Thực hiện các nghĩa vụ pháp lý theo quy định</li>
            </ul>
          </div>

          <div className="policy-section">
            <h3>3. Bảo mật thông tin</h3>
            <ul>
              <li>Mã hóa và lưu trữ thông tin trên hệ thống bảo mật cao</li>
              <li>Chỉ nhân viên có thẩm quyền mới được tiếp cận thông tin</li>
              <li>Không chia sẻ thông tin với bên thứ ba mà không có sự đồng ý</li>
              <li>Tuân thủ Luật An toàn thông tin mạng và GDPR</li>
              <li>Thông tin được lưu trữ tối đa 3 năm kể từ lần liên hệ cuối</li>
            </ul>
          </div>

          <div className="policy-section">
            <h3>4. Quyền của người dùng</h3>
            <ul>
              <li>Yêu cầu xem, sửa đổi hoặc xóa thông tin cá nhân</li>
              <li>Rút lại sự đồng ý bất kỳ lúc nào</li>
              <li>Yêu cầu ngừng nhận thông tin marketing</li>
              <li>Khiếu nại về việc xử lý thông tin không đúng mục đích</li>
              <li>Yêu cầu cung cấp bản sao thông tin đã thu thập</li>
            </ul>
          </div>

          <div className="policy-section">
            <h3>5. Chia sẻ thông tin</h3>
            <p>Chúng tôi có thể chia sẻ thông tin trong các trường hợp sau:</p>
            <ul>
              <li>Với giáo viên được gợi ý để tư vấn và xếp lịch học</li>
              <li>Khi có yêu cầu từ cơ quan pháp luật có thẩm quyền</li>
              <li>Để bảo vệ quyền lợi hợp pháp của Antoree</li>
              <li>Với đối tác tin cậy để cải thiện dịch vụ (có thỏa thuận bảo mật)</li>
            </ul>
          </div>

          <div className="policy-section">
            <h3>6. Liên hệ hỗ trợ</h3>
            <div className="contact-info">
              <div className="contact-item">
                <FiPhone size={16} className="contact-icon" />
                <span>Hotline: 0877709376</span>
              </div>
              <div className="contact-item">
                <FiMail size={16} className="contact-icon" />
                <span>Email: cskh@antoree.com</span>
              </div>
              <div className="contact-item">
                <FiMessageCircle size={16} className="contact-icon" />
                <span>Zalo: Antoree Support</span>
              </div>
            </div>
          </div>

          <div className="policy-footer">
            <p><strong>Cập nhật lần cuối:</strong> 15/01/2025</p>
            <p>Bằng việc đăng ký tư vấn, bạn đồng ý với việc thu thập và xử lý thông tin cá nhân theo chính sách trên.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
