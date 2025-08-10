import { IOutfit } from '@/types/shared/outfit.types'

interface OutfitCardProps {
  outfit: IOutfit
  variant?: 'full' | 'compact'
}

const categoryIcons: Record<string, string> = {
  top: '👔',
  bottom: '👖',
  footwear: '👟',
  outerwear: '🧥',
  accessory: '🧢'
}

export default function OutfitCard({ outfit, variant = 'full' }: OutfitCardProps) {
  if (variant === 'compact') {
    return (
      <div className="outfit-card p-4">
        <p className="text-sm text-gray-600 mb-2">
          {new Date(outfit.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </p>
        <p className="text-lg font-medium text-gray-900">{outfit.temperature}°C</p>
        <p className="text-sm text-gray-600">{outfit.condition}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          {outfit.items.map(item => (
            <span key={item.id} className="text-lg" title={item.name}>
              {categoryIcons[item.category]}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="outfit-card">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Today&apos;s Outfit</h3>
        
        {outfit.imageUrl && (
          <div className="mb-4 bg-gray-100 rounded-lg h-64 flex items-center justify-center">
            <p className="text-gray-500">AI-generated outfit visualization</p>
          </div>
        )}
        
        <p className="text-gray-700 mb-4">{outfit.description}</p>
        
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Clothing Items:</h4>
          {['top', 'bottom', 'footwear', 'outerwear', 'accessory'].map(category => {
            const items = outfit.items.filter(item => item.category === category)
            if (items.length === 0) return null
            
            return (
              <div key={category} className="flex items-start gap-3">
                <span className="text-2xl" aria-label={category}>
                  {categoryIcons[category]}
                </span>
                <div className="flex-1">
                  {items.map(item => (
                    <p key={item.id} className="text-gray-700">{item.name}</p>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}