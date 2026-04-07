import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Brain, Eye, EyeOff, Loader2, CheckCircle2, Mail, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function EmailToast({ onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Slight delay so the slide-in animation plays after mount
    const showTimer = setTimeout(() => setVisible(true), 50)
    const hideTimer = setTimeout(() => { setVisible(false); setTimeout(onClose, 400) }, 6000)
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer) }
  }, [onClose])

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-start gap-3 bg-white border border-brand-100 rounded-2xl shadow-xl px-5 py-4 max-w-sm transition-all duration-400 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0 mt-0.5">
        <Mail size={18} className="text-brand-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 text-sm">Check your email</p>
        <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
          Open your inbox and click the confirmation link to activate your account.
        </p>
        <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-brand-400 rounded-full animate-[shrink_6s_linear_forwards]" />
        </div>
      </div>
      <button
        onClick={() => { setVisible(false); setTimeout(onClose, 400) }}
        className="text-slate-300 hover:text-slate-500 transition-colors shrink-0 mt-0.5"
      >
        <X size={15} />
      </button>
    </div>
  )
}

function InputField({ label, type, value, onChange, placeholder, autoComplete }) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={isPassword && show ? 'text' : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 transition-all bg-white text-sm"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  )
}

function Alert({ type, message }) {
  if (!message) return null
  return (
    <div className={`rounded-xl px-4 py-3 text-sm font-medium ${
      type === 'error'   ? 'bg-rose-50 text-rose-700 border border-rose-100' :
      type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : ''
    }`}>
      {message}
    </div>
  )
}

export default function AuthPage() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode]         = useState('signin')   // 'signin' | 'signup'
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [showToast, setShowToast] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (mode === 'signup') {
      if (!name.trim()) { setError('Please enter your name.'); setLoading(false); return }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return }
      const { error: err } = await signUp(email, password, name.trim())
      if (err) { setError(err.message); setLoading(false); return }
      setShowToast(true)
      setMode('signin')
    } else {
      const { error: err } = await signIn(email, password)
      if (err) { setError(err.message); setLoading(false); return }
      navigate('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-teal-50 flex items-center justify-center px-4 py-12">
      {showToast && <EmailToast onClose={() => setShowToast(false)} />}
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center shadow-lg">
              <Brain size={28} className="text-white" />
            </div>
            <span className="font-display text-2xl text-slate-900">BrainBoost</span>
          </Link>
          <p className="mt-2 text-slate-500 text-sm">
            {mode === 'signin' ? 'Sign in to track your cognitive progress' : 'Create a free account to save your progress'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          {/* Tab toggle */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode('signin'); setError(''); setSuccess('') }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signin' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); setSuccess('') }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signup' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <InputField
                label="Your name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Sarah"
                autoComplete="name"
              />
            )}
            <InputField
              label="Email address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              autoComplete="email"
            />
            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />

            <Alert type="error" message={error} />

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {mode === 'signin' ? 'Sign In' : 'Create Free Account'}
            </button>
          </form>

          {mode === 'signup' && (
            <div className="mt-5 space-y-2">
              {['Free forever', 'Progress saved to the cloud', 'Play on any device'].map(t => (
                <div key={t} className="flex items-center gap-2 text-sm text-slate-500">
                  <CheckCircle2 size={14} className="text-teal-500 shrink-0" />
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-center mt-6 text-xs text-slate-400">
          You can also{' '}
          <Link to="/games" className="text-brand-600 hover:underline">
            play without an account
          </Link>{' '}
          — progress will be saved locally.
        </p>
      </div>
    </div>
  )
}
