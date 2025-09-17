import type { FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import '../index.css'
import { FiSend, FiZap, FiShield, FiClock } from 'react-icons/fi'
import { toast, Toaster } from 'react-hot-toast'
import Header from '../components/Header'
// import TeacherList from '../components/TeacherList'
import PolicyModal from '../components/PolicyModal'
import { submitViaHiddenForm } from '../utils/googleForm'

export default function Landing() {
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExitModalOpen, setIsExitModalOpen] = useState(false)
  const [exitReason, setExitReason] = useState('')
  const nameInputRef = useRef<HTMLInputElement | null>(null)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const payload = Object.fromEntries(data.entries())
    
    setIsSubmitting(true)
    
    try {
      // Gửi dữ liệu đến Google Form
      await submitToGoogleForm(payload as Record<string, string>)
      toast.success('Đã gửi thông tin thành công! Chúng tôi sẽ liên hệ với bạn trong 24h.', {
        duration: 5000,
        position: 'top-center',
      })
      form.reset()
    } catch (error) {
      console.error('Lỗi khi gửi form:', error)
      toast.error('Có lỗi xảy ra, vui lòng thử lại hoặc liên hệ trực tiếp.', {
        duration: 5000,
        position: 'top-center',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitToGoogleForm = async (data: Record<string, string>) => {
    const GOOGLE_FORM_ID = '1FAIpQLSf7yq2a83f-boZE0Yag2JBm593EwAkRS3AEhB4fOXJLBFxnug'
    const GOOGLE_FORM_URL = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`

    const fields = {
      // Map đúng entry IDs
      'entry.888789107': data.name || '',
      'entry.1587081785': data.phone || '',
      'entry.2127657389': `${data.goal || ''} | UTM: ${data.utm_source || 'landing'}-${data.utm_campaign || 'trial-1-1'}`,
      'entry.1950214871': data.feedback || '',
      'submit': 'Submit'
    };

    // Thử fetch trước (trong case không bị chặn)
    try {
      const formData = new FormData();
      Object.entries(fields).forEach(([k, v]) => formData.append(k, v));
      await fetch(GOOGLE_FORM_URL, { 
        method: 'POST', 
        mode: 'no-cors', 
        body: formData 
      });
      return;
    } catch {
      // Nếu fetch bị chặn -> dùng form ẩn
      submitViaHiddenForm(GOOGLE_FORM_URL, fields);
      return;
    }
  }

  // Submit exit intent reason directly to the form (only the reason field)
  const submitExitReason = async (reason: string) => {
    const GOOGLE_FORM_ID = '1FAIpQLSf7yq2a83f-boZE0Yag2JBm593EwAkRS3AEhB4fOXJLBFxnug'
    const GOOGLE_FORM_URL = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`

    const fields = {
      'entry.1950214871': reason || '',
      'submit': 'Submit',
    }

    try {
      const formData = new FormData();
      Object.entries(fields).forEach(([k, v]) => formData.append(k, v as string));
      await fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });
    } catch {
      submitViaHiddenForm(GOOGLE_FORM_URL, fields);
    }
  }

  // Detect exit intent (desktop): open modal once per session
  useEffect(() => {
    const shownKey = 'exit_intent_shown'
    const handler = (e: MouseEvent) => {
      if ((e.clientY || 0) <= 0 && !sessionStorage.getItem(shownKey)) {
        sessionStorage.setItem(shownKey, '1')
        setIsExitModalOpen(true)
      }
    }
    document.addEventListener('mouseleave', handler)
    return () => document.removeEventListener('mouseleave', handler)
  }, [])

  return (
    <>
      <Header onCtaClick={() => {
        const target = document.getElementById('dangky')
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        // focus vào input đầu tiên
        requestAnimationFrame(() => {
          nameInputRef.current?.focus()
        })
      }} />

      {/* LỢI ÍCH NỔI BẬT — professional cards */}
      <section className="section">
        <div className="container">
          <div className="benefits benefits--cards benefits--notes">
            <article className="benefit-card note">
              <div className="benefit-icon"><FiZap size={18} /></div>
              <h3>Tập trung thực hành</h3>
              <p>70% thời lượng dành cho nói và phản xạ. Tình huống thực tế, sửa lỗi trực tiếp.</p>
            </article>
            <article className="benefit-card note">
              <div className="benefit-icon"><FiShield size={18} /></div>
              <h3>Chi phí minh bạch</h3>
              <p>từ 80k/buổi, thanh toán theo từng buổi. Hoàn tiền nếu không phù hợp.</p>
            </article>
            <article className="benefit-card note">
              <div className="benefit-icon"><FiClock size={18} /></div>
              <h3>Lịch linh hoạt</h3>
              <p>Đặt — đổi — huỷ dễ dàng. Khớp lịch người đi làm.</p>
            </article>
          </div>
        </div>
      </section>

      {/* DANH SÁCH GIÁO VIÊN */}
      {/* <TeacherList pageSize={10} /> */}

      {/* CÁCH HOẠT ĐỘNG — arrow connectors
      <section className="section section--subtle">
        <div className="container">
          <h2 className="sec-title">3 bước là bắt đầu</h2>
          <div className="steps steps--arrows">
            <div className="step bubble">
              <span className="step-num">1</span>
              <h4>Điền mục tiêu</h4>
            </div>
            <div className="arrow" aria-hidden="true" />
            <div className="step bubble">
              <span className="step-num">2</span>
              <h4>Đặt lịch học thử</h4>
            </div>
            <div className="arrow" aria-hidden="true" />
            <div className="step bubble">
              <span className="step-num">3</span>
              <h4>Bắt đầu & tối ưu</h4>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA FORM – FULLSCREEN, FOCUS, GLASS CARD */}
    <section className="cta section cta--fullscreen" id="dangky" aria-labelledby="cta-title">
        {/* Spotlight + shapes để thu hút mắt nhìn */}
        <span className="spotlight" aria-hidden="true" />
        <span className="shape shape--circle" aria-hidden="true" />
        <span className="shape shape--pill" aria-hidden="true" />

        <div className="container cta-wrap">
            <div className="cta-head">
            <h2 id="cta-title" className="cta-title">Sẵn sàng bắt đầu với</h2>
            <h2 id="cta-title" className="cta-title text-accent"><strong>từ 80k/buổi</strong></h2>
            <p className="cta-sub">
                Điền thông tin, chúng tôi gợi ý giáo viên phù hợp và xếp lịch học thử trong 24h.
            </p>
            <ul className="cta-points">
                <li><span className="dot" /> Học 1–1, lịch linh hoạt</li>
                <li><span className="dot" /> Đổi giáo viên miễn phí</li>
                {/* <li><span className="dot" /> Hoàn tiền nếu không phù hợp</li> */}
            </ul>
            </div>

            <form className="card form-card form-card--glass form-card--xl" onSubmit={onSubmit}>
            {/* Hidden fields cho marketing attribution */}
            <input type="hidden" name="utm_source" value="landing" />
            <input type="hidden" name="utm_campaign" value="trial-1-1" />

            <div className="grid-2 grid-2--wide">
                <input ref={nameInputRef} name="name" aria-label="Họ và tên" placeholder="Họ và tên" required className="input input--lg" />
                <input name="phone" type="tel" aria-label="Số điện thoại/Zalo" placeholder="Số điện thoại/Zalo" required className="input input--lg" />
                <input name="goal" aria-label="Mục tiêu học" placeholder="Mục tiêu (VD: giao tiếp/TOEIC/IELTS/công việc)" className="input input--lg" />
                <input name="feedback" aria-label="Góp ý/Thắc mắc" placeholder="Góp ý hoặc thắc mắc (tuỳ chọn)" className="input input--lg" />
            </div>

            <div className="form-actions form-actions--stack">
                <label className="agree">
                <input type="checkbox" required />
                <p className="agree-text">
                  Tôi đồng ý với <button type="button" className="policy-link" onClick={() => setIsPolicyModalOpen(true)}>chính sách bảo mật thông tin</button>.
                </p>
                </label>

                <button type="submit" className="btn btn--block" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="spinner" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      Đặt lịch học thử <FiSend size={18} />
                    </>
                  )}
                </button>
            </div>
            </form>
        </div>
        </section>


      {/* FAQ
      <section className="section">
        <div className="container">
          <h2 className="sec-title">Câu hỏi thường gặp</h2>
          <div className="faq">
            <details>
              <summary>Thanh toán theo buổi nghĩa là gì?</summary>
              <p>Bạn chỉ thanh toán cho buổi tiếp theo trên lịch. Không cần trả trước cả khoá. Sau buổi học có thể tiếp tục đặt buổi mới.</p>
            </details>
            <details>
              <summary>Học thử có mất phí không?</summary>
              <p>Học thử sẽ không tính phí, khi bạn đã chọn cho mình một giáo viên phù hợp và bắt đầu học thì mới bắt đầu tính phí.</p>
            </details>
            <details>
              <summary>Làm sao để chọn giáo viên phù hợp?</summary>
              <p>Điền mục tiêu và thời gian, hệ thống gợi ý giáo viên có lịch khớp và kinh nghiệm tương ứng (TOEIC/IELTS/giao tiếp/công việc).</p>
            </details>
            <details>
              <summary>Huỷ hoặc đổi lịch như thế nào?</summary>
              <p>Bạn có thể đổi/huỷ miễn phí trước thời điểm buổi học theo chính sách hiện hành. Lịch sẽ nhắc bạn trước giờ học.</p>
            </details>
          </div>
        </div>
      </section> */}

      {/* FOOTER */}
      <footer className="section" style={{ background: '#083668' }}>
        <div className="container footer-inner">
          <div>© 2025 Antoree — Học tiếng Anh 1-1</div>
        </div>
      </footer>

      {/* POLICY MODAL */}
      <PolicyModal 
        isOpen={isPolicyModalOpen} 
        onClose={() => setIsPolicyModalOpen(false)} 
      />

      {/* EXIT-INTENT MODAL */}
      {isExitModalOpen && (
        <div className="modal-overlay" onClick={() => setIsExitModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Vì sao bạn chưa đăng ký?</h2>
              <button className="modal-close" onClick={() => setIsExitModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ marginTop: 0, marginBottom: 12, color: '#374151' }}>
                Cho chúng tôi biết lý do để cải thiện trải nghiệm của bạn.
              </p>
              <textarea
                className="input"
                placeholder="Ví dụ: Tôi muốn xem thêm giáo viên, giá chưa phù hợp..."
                value={exitReason}
                onChange={(e) => setExitReason(e.target.value)}
                style={{ width: '100%', minHeight: 96, padding: 12, resize: 'vertical' }}
              />
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
                <button className="btn btn--ghost" onClick={() => setIsExitModalOpen(false)}>Bỏ qua</button>
                <button
                  className="btn"
                  onClick={async () => {
                    try {
                      await submitExitReason(exitReason)
                      toast.success('Cảm ơn bạn đã góp ý!')
                    } catch {}
                    setIsExitModalOpen(false)
                    setExitReason('')
                  }}
                >
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATIONS */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Default options
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '8px',
            padding: '12px 16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          // Success toast
          success: {
            duration: 5000,
            style: {
              background: '#10b981',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981',
            },
          },
          // Error toast
          error: {
            duration: 5000,
            style: {
              background: '#ef4444',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
        }}
      />

    </>
  )
}