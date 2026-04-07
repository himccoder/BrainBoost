import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-slate-100 bg-white py-6 text-center text-slate-400 text-sm">
        <p>BrainBoost &mdash; Cognitive Training for Recovery &amp; Resilience</p>
        <p className="mt-1 text-xs">Not a substitute for professional medical advice. Always consult your healthcare provider.</p>
      </footer>
    </div>
  )
}
