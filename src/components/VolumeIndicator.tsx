import React, { useMemo } from 'react'

interface VolumeIndicatorProps {
  volume: number
}

const VolumeIndicator: React.FC<VolumeIndicatorProps> = ({ volume }) => {
  const normalizedVolume = useMemo(() => Math.min(volume / 128, 1), [volume])
  const bars = 20

  return (
    <div className="flex items-end justify-center space-x-1 w-48 h-16">
      {[...Array(bars)].map((_, index) => {
        const barHeight = (index + 1) / bars
        const isActive = normalizedVolume >= barHeight
        const height = isActive ? `${barHeight * 100}%` : '4px'

        return (
          <div
            key={index}
            className={`w-1 rounded-t-full transition-all duration-75 ${
              isActive ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            style={{ height }}
          />
        )
      })}
    </div>
  )
}

export default VolumeIndicator
