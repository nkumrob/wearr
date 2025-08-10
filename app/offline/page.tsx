import Layout from '@/components/Layout'

export default function OfflinePage() {
  return (
    <Layout>
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📡</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re Offline</h2>
        <p className="text-gray-600">
          Please check your internet connection to get the latest weather and outfit recommendations.
        </p>
      </div>
    </Layout>
  )
}