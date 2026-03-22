import { NavLink } from 'react-router-dom'

const tabs = [
  { path: '/', icon: '🏠', label: '홈' },
  { path: '/watchlist', icon: '⭐', label: '관심' },
  { path: '/mystocks', icon: '💰', label: '내주식' },
  { path: '/diary', icon: '📝', label: '일기' },
  { path: '/report', icon: '🏆', label: '성적' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around py-2">
        {tabs.map(({ path, icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-1 px-3 text-xs transition-colors ${
                isActive ? 'text-primary font-bold' : 'text-gray-400'
              }`
            }
          >
            <span className="text-xl">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
