import type { FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import '../index.css'
import { FiSend, FiZap, FiShield, FiClock } from 'react-icons/fi'
import { toast, Toaster } from 'react-hot-toast'
import Header from '../components/Header'
// import TeacherList from '../components/TeacherList'
import PolicyModal from '../components/PolicyModal'
import { submitViaHiddenForm } from '../utils/googleForm'

/**
 * Hook chặn nút Back trong SPA (Single Page Application) bằng popstate + history.pushState.
 * English: block browser Back within SPA by intercepting popstate.
 * - shouldBlock (boolean) = có chặn không (vd: khi form dirty)
 * - onConfirmLeave = callback khi người dùng chấp nhận rời (để cleanup nếu cần)
 * - showConfirm = hàm mở modal tùy chỉnh (custom modal) của bạn, trả về Promise<boolean>
 */
function useBackBlocker(
  shouldBlock: boolean,
  onConfirmLeave: () => void,
  showConfirm: () => Promise<boolean>
) {
  useEffect(() => {
    if (!shouldBlock) return

    // Đẩy một state vào history để có cái mà Back sẽ lùi về
    const push = () => history.pushState({ _guard: true }, '', window.location.href)
    push()

    const onPopState = async (_e: PopStateEvent) => {
      // Hiện modal confirm tùy chỉnh
      const ok = await showConfirm()
      if (ok) {
        // Người dùng đồng ý rời trang: gỡ listener rồi back thật
        window.removeEventListener('popstate', onPopState)
        onConfirmLeave()
        history.back()
      } else {
        // Ở lại: đẩy lại state để tiếp tục chặn lần sau
        push()
      }
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [shouldBlock, onConfirmLeave, showConfirm])
}

export default function Landing() {
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Modal góp ý khi có ý định thoát (exit-intent modal)
  const [isExitModalOpen, setIsExitModalOpen] = useState(false)
  const [exitReason, setExitReason] = useState('')

  // Cờ "dữ liệu đã thay đổi nhưng chưa lưu" (unsaved changes / dirty state)
  const [isDirty, setIsDirty] = useState(false)

  const nameInputRef = useRef<HTMLInputElement | null>(null)

  // Hàm mở modal confirm khi người dùng bấm Back trong SPA
  // Ở đây demo dùng confirm() sẵn có; bạn có thể thay bằng mở modal UI của bạn và resolve true/false.
  const showLeaveConfirm = async () => {
    // English: custom confirm modal hook point
    return window.confirm('Dữ liệu (data) chưa lưu — Bạn có chắc chắn muốn rời trang?')
  }

  // Chặn Back (SPA) khi isDirty
  useBackBlocker(
    isDirty,
    () => {
      // onConfirmLeave: ví dụ dọn dẹp/lưu nháp nếu cần
      // English: cleanup or save draft before leaving
    },
    showLeaveConfirm
  )

  // beforeunload: chặn rời tab/refresh/đóng trình duyệt bằng hộp thoại mặc định (native)
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return
      // Lưu ý: KHÔNG thể mở modal React ở đây; chỉ hộp thoại mặc định của trình duyệt.
      e.preventDefault()
      e.returnValue = '' // Safari/Firefox: gán chuỗi rỗng để hiển thị prompt mặc định
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [isDirty])

  // Exit-intent (ý định rời) — desktop + mobile fallback, chỉ bật 1 lần / session
  useEffect(() => {
    const shownKey = 'exit_intent_modal_shown'
    const notShownYet = () => !sessionStorage.getItem(shownKey)
    const markShown = () => sessionStorage.setItem(shownKey, '1')

    // Desktop: chuột rời khỏi viewport ở mép trên (mouseout + relatedTarget === null)
    const onMouseOut = (e: MouseEvent) => {
      if (!notShownYet()) return
      const toEl = (e as MouseEvent).relatedTarget as Node | null
      const y = (e as MouseEvent).clientY ?? 9999
      if (!toEl && y <= 0) {
        markShown()
        setIsExitModalOpen(true) // mở modal tùy chỉnh
      }
    }

    // Mobile fallback: người dùng chuyển tab/app (visibilitychange) hoặc pagehide (iOS)
    const onVisibility = () => {
      if (!notShownYet()) return
      if (document.visibilityState === 'hidden') {
        markShown()
        setIsExitModalOpen(true)
      }
    }
    const onPageHide = () => {
      if (!notShownYet()) return
      markShown()
      setIsExitModalOpen(true)
    }

    document.addEventListener('mouseout', onMouseOut)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', onPageHide)

    return () => {
      document.removeEventListener('mouseout', onMouseOut)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', onPageHide)
    }
  }, [])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const payload = Object.fromEntries(data.entries())

    setIsSubmitting(true)

    try {
      // Gửi dữ liệu đến Google Form (Google Form submission)
      await submitToGoogleForm(payload as Record<string, string>)
      toast.success('Đã gửi thông tin thành công! Chúng tôi sẽ liên hệ với bạn trong 24h.', {
        duration: 5000,
        position: 'top-center',
      })
      form.reset()
      setIsDirty(false) // dữ liệu đã “lưu” xong
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
      // Map đúng entry IDs (Google Form entry fields)
      'entry.888789107': data.name || '',
      'entry.1587081785': data.phone || '',
      'entry.2127657389': `${data.goal || ''} | UTM: ${data.utm_source || 'landing'}-${data.utm_campaign || 'trial-1-1'}`,
      'entry.1950214871': data.feedback || '',
      'submit': 'Submit',
    }

    try {
      const formData = new FormData()
      Object.entries(fields).forEach(([k, v]) => formData.append(k, v))
      await fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors', // Tránh CORS error khi POST trực tiếp
        body: formData,
      })
      return
    } catch {
      // Nếu fetch bị chặn -> dùng form ẩn (hidden form fallback)
      submitViaHiddenForm(GOOGLE_FORM_URL, fields)
      return
    }
  }

  // Gửi lý do thoát (exit reason) vào riêng 1 field của Google Form
  const submitExitReason = async (reason: string) => {
    const GOOGLE_FORM_ID = '1FAIpQLSf7yq2a83f-boZE0Yag2JBm593EwAkRS3AEhB4fOXJLBFxnug'
    const GOOGLE_FORM_URL = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`

    const fields = {
      'entry.1950214871': reason || '',
      'submit': 'Submit',
    }

    try {
      const formData = new FormData()
      Object.entries(fields).forEach(([k, v]) => formData.append(k, v as string))
      await fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      })
    } catch {
      submitViaHiddenForm(GOOGLE_FORM_URL, fields)
    }
  }

  // Helper: khi user gõ vào form thì đánh dấu dirty (unsaved changes)
  const markDirty = () => setIsDirty(true)

  return (
    <>
      <Header
        onCtaClick={() => {
          const target = document.getElementById('dangky')
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
          // focus vào input đầu tiên
          requestAnimationFrame(() => {
            nameInputRef.current?.focus()
          })
        }}
      />

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
              <input ref={nameInputRef} name="name" aria-label="Họ và tên" placeholder="Họ và tên" required className="input input--lg" onChange={markDirty} />
              <input name="phone" type="tel" aria-label="Số điện thoại/Zalo" placeholder="Số điện thoại/Zalo" required className="input input--lg" onChange={markDirty} />
              <input name="goal" aria-label="Mục tiêu học" placeholder="Mục tiêu (VD: giao tiếp/TOEIC/IELTS/công việc)" className="input input--lg" onChange={markDirty} />
              <input name="feedback" aria-label="Góp ý/Thắc mắc" placeholder="Góp ý hoặc thắc mắc (tuỳ chọn)" className="input input--lg" onChange={markDirty} />
            </div>

            <div className="form-actions form-actions--stack">
              <label className="agree">
                <input type="checkbox" required onChange={markDirty} />
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

      {/* EXIT-INTENT MODAL (modal góp ý) */}
      {isExitModalOpen && (
        <div className="modal-overlay" onClick={() => setIsExitModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Giúp chúng tớ cải thiện</h2>
              <button className="modal-close" onClick={() => setIsExitModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ marginTop: 0, marginBottom: 12, color: '#374151' }}>
                Bạn ơi đừng vội rời đi - hãy chia sẻ điều khiến bạn chưa thể đăng ký khóa học nhé?
              </p>
              <textarea
                className="input"
                placeholder="Ví dụ: Tôi muốn xem thêm giáo viên, giá chưa phù hợp..."
                value={exitReason}
                onChange={(e) => setExitReason(e.target.value)}
                style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', display: 'block', minHeight: 96, padding: 12, resize: 'vertical', overflowWrap: 'anywhere' }}
              />
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
                <button className="btn btn--ghost" onClick={() => setIsExitModalOpen(false)}>Bỏ qua</button>
                <button
                  className="btn"
                  onClick={async () => {
                    try {
                      await submitExitReason(exitReason)
                      toast.success('Cảm ơn bạn đã góp ý!')
                    } catch { /* noop */ }
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
          success: {
            duration: 5000,
            style: { background: '#10b981', color: '#fff' },
            iconTheme: { primary: '#fff', secondary: '#10b981' },
          },
          error: {
            duration: 5000,
            style: { background: '#ef4444', color: '#fff' },
            iconTheme: { primary: '#fff', secondary: '#ef4444' },
          },
        }}
      />
    </>
  )
}
