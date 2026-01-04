"use client"

interface RiskGaugeProps {
  manipulationScore: number
  riskLevel: string
  gaugeType?: 'risk' | 'confidence'
}

export default function RiskGauge({ manipulationScore, riskLevel, gaugeType = 'risk' }: RiskGaugeProps) {
  const percentage = Math.round(manipulationScore * 100)
  
  const getRiskConfig = () => {
    if (gaugeType === 'confidence') {
      return {
        label: 'MODEL CERTAINTY',
        color: 'text-blue-700',
        gaugeColor: '#3b82f6'
      }
    }
    
    const level = riskLevel.toLowerCase()
    if (level === 'low') return { 
      label: 'LOW RISK', 
      color: 'text-emerald-700',
      gaugeColor: '#059669'
    }
    if (level === 'medium') return { 
      label: 'MEDIUM RISK', 
      color: 'text-amber-700',
      gaugeColor: '#d97706'
    }
    return { 
      label: 'HIGH RISK', 
      color: 'text-rose-700',
      gaugeColor: '#dc2626'
    }
  }

  const config = getRiskConfig()
  const circumference = 2 * Math.PI * 110
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <svg width="280" height="280" viewBox="0 0 280 280" className="transform -rotate-90">
          <circle
            cx="140"
            cy="140"
            r="110"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="16"
          />
          <circle
            cx="140"
            cy="140"
            r="110"
            fill="none"
            stroke={config.gaugeColor}
            strokeWidth="16"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-6xl font-bold tracking-tight ${config.color} mb-1`}>
            {percentage}
          </div>
          <div className="text-sm text-neutral-500 tracking-wide">
            {gaugeType === 'risk' ? 'MANIPULATION' : 'CONFIDENCE'}
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className={`text-xl font-semibold tracking-wide ${config.color}`}>
          {config.label}
        </div>
      </div>
    </div>
  )
}
