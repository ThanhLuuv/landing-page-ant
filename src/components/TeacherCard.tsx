import { FiUsers, FiStar, FiClock, FiUser } from 'react-icons/fi'

export type TeacherCardProps = {
  id?: string | number
  name?: string
  avatarUrl?: string
  cityName?: string
  nationality?: string
  accents?: string[]
  price?: string
  currency?: string
  rating?: number
  studentsCount?: number
  teachingHours?: number
  videoUrl?: string
  note?: string
  phone?: string
  email?: string
}

export default function TeacherCard({
  name,
  avatarUrl,
  cityName,
  nationality,
  accents = [],
//   price,
//   currency,
  rating,
  studentsCount,
  teachingHours,
  note,
}: TeacherCardProps) {
  const metaTop: string[] = []
  if (cityName) metaTop.push(cityName)
  if (nationality?.trim()) metaTop.push(nationality.trim())

  return (
    <article className="teacher-card card">
      <div className="teacher-card__header">
        <div className="teacher-card__avatar" style={{ display:'grid', placeItems:'center', background:'#f0f4ff' }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={name ? `Ảnh của ${name}` : 'Ảnh giáo viên'} loading="lazy" />
          ) : (
            <FiUser size={28} color="#7aa0d6" aria-hidden="true" />
          )}
        </div>
        <div className="teacher-card__title">
          <div className="t-name">{name || 'Giáo viên ẩn danh'}</div>
          {metaTop.length > 0 && <div className="meta">{metaTop.join(' • ')}</div>}
        </div>
        {/* {price && (
          <span className="teacher-card__price tag">
            {price}{currency === 'VND' ? 'đ' : currency ? ` ${currency}` : ''}/buổi
          </span>
        )} */}
      </div>

      <div className="teacher-card__meta">
        {typeof rating === 'number' && (
          <span className="teacher-card__chip"><FiStar /> {rating}</span>
        )}
        {typeof studentsCount === 'number' && (
          <span className="teacher-card__chip"><FiUsers /> {studentsCount} học viên</span>
        )}
        {typeof teachingHours === 'number' && (
          <span className="teacher-card__chip"><FiClock /> {Math.round(teachingHours)} giờ dạy</span>
        )}
      </div>

      {accents.length > 0 && (
        <div className="teacher-card__tags">
          {accents.slice(0, 4).map((tag, i) => (
            <span className="tag" key={i}>{tag}</span>
          ))}
        </div>
      )}

      {note && (
        <p className="teacher-card__note">
          {note.slice(0, 140)}{note.length > 140 ? '…' : ''}
        </p>
      )}

      {/* Contact info hidden per request */}

      <div className="teacher-card__actions">
        <a className="btn" href="#dangky">Học thử</a>
      </div>
    </article>
  )
}


