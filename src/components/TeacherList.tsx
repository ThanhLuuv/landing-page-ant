import { useEffect, useState } from 'react'
// (icons moved into TeacherCard)
import TeacherCard from './TeacherCard'

type Teacher = {
  id?: string | number
  name?: string
  title?: string
  bio?: string
  tags?: string[]
  schedule?: string
  avatarUrl?: string
  cityName?: string
  nationality?: string
  phone?: string
  email?: string
  salaryValue?: string
  salaryCurrency?: string
  rating?: number
  studentsCount?: number
  teachingHours?: number
  videoUrl?: string
  // fallback unknown fields
  [key: string]: unknown
}

type ApiResponse = {
  items?: Teacher[]
  data?: any[]
  results?: Teacher[]
  total?: number
  count?: number
  pagination?: {
    currentPage?: number
    totalItems?: number
    totalPage?: number
    itemsPerPage?: number
    hasMore?: boolean
  }
  [key: string]: unknown
}

type TeacherListProps = {
  apiBase?: string
  initialTerm?: string
  pageSize?: number
}

const DEFAULT_API = 'http://172.16.0.35:8000/admin/v2/landing-pages/teachers'

// Hard-coded currency conversion to VND (set cứng)
const CURRENCY_TO_VND: Record<string, number> = {
  VND: 1,
  PHP: 500,      // ~500 VND / PHP (ước lượng, có thể điều chỉnh)
  USD: 25000,    // tuỳ chọn mở rộng
  EUR: 27000,    // tuỳ chọn mở rộng
}

const MAX_PRICE_VND = 90000

function parseMoneyString(value: unknown): number | undefined {
  if (typeof value !== 'string') return undefined
  const digits = value.replace(/[^0-9.]/g, '')
  if (!digits) return undefined
  const num = Number(digits)
  return Number.isFinite(num) ? num : undefined
}

function convertToVnd(amount: number | undefined, currency?: string): number | undefined {
  if (!Number.isFinite(amount as number)) return undefined
  const rate = CURRENCY_TO_VND[(currency || 'VND').toUpperCase()] || 1
  return Math.round((amount as number) * rate)
}

export default function TeacherList({ apiBase = DEFAULT_API, initialTerm = '' }: TeacherListProps) {
  const [term] = useState(initialTerm)
  // UI pagination (client-side) – always show 9 per page as requested
  const UI_PAGE_SIZE = 9
  const [uiPage, setUiPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    let isCancelled = false
    const fetchAll = async () => {
      setIsLoading(true)
      setError(null)
      setUiPage(1)
      try {
        const all: any[] = []
        let page = 1
        const serverPageSize = 100
        while (true) {
          const params = new URLSearchParams()
          params.set('page', String(page))
          params.set('page-size', String(serverPageSize))
          if (term) params.set('term', term)
          const url = `${apiBase}?${params.toString()}`
          const res = await fetch(url, { method: 'GET' })
          const json: ApiResponse = await res.json().catch(() => ({} as ApiResponse))
          const chunk = (json.items || json.data || json.results || []) as any[]
          if (Array.isArray(chunk) && chunk.length > 0) {
            all.push(...chunk)
          }
          const more = json.pagination?.hasMore
          const totalPage = json.pagination?.totalPage
          if (!Array.isArray(chunk) || chunk.length < serverPageSize) {
            // also break if not full page
          }
          if (!more && typeof totalPage === 'number' && page >= totalPage) {
            break
          }
          if (!more && (typeof totalPage !== 'number')) {
            break
          }
          page += 1
          if (page > 1000) break // safety
        }

        if (isCancelled) return

        // Filter by price < 90k VND
        const filtered = all.filter((r) => {
          const val = parseMoneyString(r?.salaryRate?.value)
          const vnd = convertToVnd(val, r?.salaryRate?.currency)
          return typeof vnd === 'number' && vnd < MAX_PRICE_VND
        })

        const mapped: Teacher[] = filtered.map((r) => ({
          id: r.id,
          name: r.name,
          avatarUrl: r.avatarUrlThumb || r.avatarUrl,
          tags: Array.isArray(r.accent) ? r.accent.map((a: any) => a?.name).filter(Boolean) : [],
          cityName: r.city?.name,
          nationality: r.nationality,
          phone: r.phone,
          email: r.email,
          salaryValue: r.salaryRate?.value,
          salaryCurrency: r.salaryRate?.currency,
          rating: r.rating,
          studentsCount: r.students_count,
          teachingHours: r.teaching_hours,
          videoUrl: r.video,
        }))

        setTeachers(mapped)
        setTotal(mapped.length)
      } catch (err) {
        if (!isCancelled) setError('Không tải được danh sách giáo viên.')
      } finally {
        if (!isCancelled) setIsLoading(false)
      }
    }
    fetchAll()
    return () => { isCancelled = true }
  }, [apiBase, term])

  // Client-side pagination controls
  const totalPages = Math.max(1, Math.ceil((total || 0) / UI_PAGE_SIZE))
  const canPrev = uiPage > 1
  const canNext = uiPage < totalPages
  const startIdx = (uiPage - 1) * UI_PAGE_SIZE
  const currentTeachers = teachers.slice(startIdx, startIdx + UI_PAGE_SIZE)

  return (
    <section className="section" id="danhsach-giaovien">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 12, marginBottom: 12 }}>
          <div>
            <h2 style={{ margin: '0 0 6px' }}>Danh sách giáo viên</h2>
          </div>
          <div className="caption" style={{ color: 'var(--muted)' }}>
            {typeof total === 'number' ? `${total} giáo viên` : ''}
          </div>
        </div>

        {error && (
          <div className="card" style={{ padding: 12, borderRadius: 12, border: '1px solid var(--line)' }}>{error}</div>
        )}

        <div className="teacher-grid">
          {isLoading && teachers.length === 0 && (
            <div className="card" style={{ padding: 14 }}>Đang tải danh sách…</div>
          )}
          {!isLoading && teachers.length === 0 && !error && (
            <div className="card" style={{ padding: 14 }}>Không có giáo viên phù hợp.</div>
          )}

          {currentTeachers.map((t, idx) => {
            const price = t.salaryValue
            const rating = t.rating
            const students = t.studentsCount
            const hours = t.teachingHours
            const city = t.cityName
            const nationality = t.nationality?.trim()
            const accents = Array.isArray(t.tags) ? t.tags.slice(0, 4) : []
            const metaTop: string[] = []
            if (city) metaTop.push(city)
            if (nationality) metaTop.push(nationality)
            return (
              <TeacherCard
                key={String(t.id ?? startIdx + idx)}
                name={t.name}
                avatarUrl={t.avatarUrl as string | undefined}
                cityName={city}
                nationality={nationality}
                accents={accents}
                price={price}
                currency={t.salaryCurrency as string | undefined}
                rating={rating}
                studentsCount={students}
                teachingHours={hours}
                videoUrl={t.videoUrl as string | undefined}
                note={(t as any).note as string | undefined}
              />
            )
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <button className="btn btn--ghost" onClick={() => setUiPage((p) => Math.max(1, p - 1))} disabled={!canPrev}>Trang trước</button>
          <div className="caption">Trang {uiPage} • Tổng {total}</div>
          <button className="btn" onClick={() => setUiPage((p) => Math.min(totalPages, p + 1))} disabled={!canNext}>Trang sau</button>
        </div>
      </div>
    </section>
  )
}


