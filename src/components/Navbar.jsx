import { Link, useLocation } from 'react-router-dom'
import { Brain, BarChart2, Gamepad2, Home, LogOut, LogIn, User, ClipboardList, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useState, useRef, useEffect } from 'react'

const navLinks = [
  { to: '/',          label: 'Home',        icon: Home },
  { to: '/games',     label: 'Brain Games', icon: Gamepad2 },
  { to: '/dashboard', label: 'My Progress', icon: BarChart2 },
  { to: '/assessment?type=biweekly', label: 'Assessment', icon: ClipboardList, authOnly: true },
]

function UserMenu({ user, profile, signOut }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const initials = (profile?.name || user.email || '?')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {initials}
        </div>
        <span className="hidden sm:inline text-sm font-medium text-slate-700 max-w-[120px] truncate">
          {profile?.name || user.email}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-lg border border-slate-100 py-2 z-50 animate-slide-up">
          <div className="px-4 py-2.5 border-b border-slate-50">
            <p className="text-xs font-semibold text-slate-800 truncate">{profile?.name || 'User'}</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
          <Link to="/dashboard" onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <BarChart2 size={14} /> My Progress
          </Link>
          <Link to="/profile" onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Settings size={14} /> My Profile
          </Link>
          <div className="border-t border-slate-50 my-1" />
          <button onClick={() => { signOut(); setOpen(false) }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-colors">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const { pathname } = useLocation()
  const { user, profile, loading, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <Brain size={18} className="text-white" />
          </div>
          <span className="font-display text-xl text-slate-800">BrainBoost</span>
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon, authOnly }) => {
            if (authOnly && !user) return null
            const isActive = pathname === to.split('?')[0]
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
          ) : user ? (
            <UserMenu user={user} profile={profile} signOut={signOut} />
          ) : (
            <Link
              to="/signin"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors"
            >
              <LogIn size={15} />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
