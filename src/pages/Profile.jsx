import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, Save, CheckCircle, ChevronRight, Brain } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const GENDER_OPTIONS = [
  { value: 'male',              label: 'Male' },
  { value: 'female',            label: 'Female' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
]

/** Convert a date string (YYYY-MM-DD) or Date to a display age */
function calcAge(dob) {
  if (!dob) return null
  const birth = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age >= 0 ? age : null
}

export default function Profile() {
  const { user, profile, updateProfile } = useAuth()

  const [name,  setName]  = useState('')
  const [dob,   setDob]   = useState('')
  const [gender, setGender] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [error,  setError]  = useState('')

  // Populate fields from loaded profile
  useEffect(() => {
    if (profile) {
      setName(profile.name  || '')
      setDob(profile.date_of_birth || '')
      setGender(profile.gender || '')
    }
  }, [profile])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true); setError(''); setSaved(false)
    const { error: err } = await updateProfile({
      name:           name.trim() || null,
      date_of_birth:  dob  || null,
      gender:         gender || null,
    })
    setSaving(false)
    if (err) { setError(err.message); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const age = calcAge(dob)

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="bg-gradient-to-b from-brand-50 to-white py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link to="/dashboard" className="hover:text-brand-600 transition-colors">Dashboard</Link>
            <ChevronRight size={14} />
            <span className="text-slate-600">My Profile</span>
          </div>
          <h1 className="font-display text-4xl text-slate-900 mb-1">My Profile</h1>
          <p className="text-slate-500">Your personal information is included in assessment reports for your care team.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-20">
        <form onSubmit={handleSave} className="space-y-6">

          {/* Avatar / email header */}
          <div className="card flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-teal-400 flex items-center justify-center text-white font-bold text-xl shrink-0">
              {(profile?.name || user?.email || '?')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-slate-800 truncate">{profile?.name || 'No name set'}</div>
              <div className="text-slate-400 text-sm truncate">{user?.email}</div>
            </div>
          </div>

          {/* Personal info */}
          <div className="card space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <User size={15} className="text-brand-500" />
              <h2 className="font-semibold text-slate-800">Personal Information</h2>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none text-slate-700 placeholder-slate-300 transition-all"
              />
            </div>

            {/* Date of birth */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date of birth</label>
              <input
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none text-slate-700 transition-all"
              />
              {age !== null && (
                <p className="text-xs text-slate-400 mt-1.5 ml-1">Age: <strong className="text-slate-600">{age} years old</strong></p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Gender</label>
              <div className="flex gap-3 flex-wrap">
                {GENDER_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setGender(g => g === opt.value ? '' : opt.value)}
                    className={`px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                      gender === opt.value
                        ? 'border-brand-400 bg-brand-50 text-brand-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Why this matters */}
          <div className="rounded-2xl bg-teal-50 border border-teal-100 p-4 flex items-start gap-3">
            <Brain size={16} className="text-teal-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-teal-700 mb-0.5">Why we ask</p>
              <p className="text-xs text-teal-600 leading-relaxed">
                Age and gender are used to contextualise your assessment scores against clinical reference norms.
                Your neurologist can use this information to better interpret your cognitive profile over time.
                This data is never shared without your consent.
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Save button */}
          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saved ? (
              <><CheckCircle size={17} /> Saved!</>
            ) : saving ? (
              <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving…</>
            ) : (
              <><Save size={17} /> Save Profile</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
