import { ReactNode } from 'react'
import Link from 'next/link'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-warm-white">
      <header className="bg-white border-b border-warm-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">☀️</span>
              </div>
              <h1 className="text-2xl font-bold text-warm-gray-900">Wearr</h1>
            </div>
            <nav className="flex gap-8">
              <Link href="/" className="text-warm-gray-600 hover:text-primary font-medium transition-colors relative group">
                Today
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/week" className="text-warm-gray-600 hover:text-primary font-medium transition-colors relative group">
                This Week
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      <footer className="mt-auto border-t border-warm-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-tertiary mb-2">
              © 2024 Wearr - AI-Powered Outfit Planner
            </p>
            <p className="text-xs text-tertiary">
              Weather data powered by WeatherAPI.com
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}