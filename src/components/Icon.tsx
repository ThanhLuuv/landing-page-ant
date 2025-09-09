import React from 'react'

type IconName = 'check-circle' | 'lightning' | 'clock'

type IconProps = {
  name: IconName
  size?: number
  color?: string
  className?: string
}

const paths: Record<IconName, React.ReactNode> = {
  'check-circle': (
    <>
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" fill="currentColor" opacity=".12"/>
      <path d="M9.5 12.5l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".5"/>
    </>
  ),
  lightning: (
    <>
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8Z" fill="currentColor"/>
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.6" opacity=".6"/>
      <path d="M12 6v6l4 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </>
  )
}

export function Icon({ name, size = 18, color = 'currentColor', className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-hidden="true"
      style={{ color }}
      className={className}
    >
      {paths[name]}
    </svg>
  )
}

export default Icon


