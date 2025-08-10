import { ReactNode } from 'react'
import Link from 'next/link'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌤️</span>
              <h1 className="text-xl font-semibold text-gray-900">Wearr</h1>
            </div>
            <nav className="flex gap-6">
              <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">Today</Link>
              <Link href="/week" className="text-gray-700 hover:text-gray-900 font-medium">This Week</Link>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      <footer className="mt-auto border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-600">
            © 2024 Wearr - AI-Powered Outfit Planner
          </p>
        </div>
      </footer>
    </div>
  )
}