"use client"

import { Button } from '@/components/ui/button'
import { Download, RotateCcw } from 'lucide-react'
import RiskGauge from './risk-gauge'
import SignalsOverview from './signals-overview'
import KeyIndicators from './key-indicators'
import TechnicalAnalysis from './technical-analysis'
import FullReport from './full-report'

interface ResultsDashboardProps {
  results: any
  fileType: 'image' | 'video'
  mode: 'quick' | 'deep'
  onReset: () => void
}

export default function ResultsDashboard({ 
  results, 
  fileType, 
  mode, 
  onReset 
}: ResultsDashboardProps) {
  
  const handleDownload = () => {
    const dataStr = JSON.stringify(results, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `analysis-report-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const finalScore = results.final_score || 0
  const riskLevel = results.risk_level || 'Unknown'
  const confidence = results.confidence || 0

  return (
    <section id="results-section" className="min-h-screen bg-neutral-50 py-16 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Risk Gauge, Confidence, and Key Indicators Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Risk Gauge */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center space-y-4">
              <RiskGauge 
                manipulationScore={finalScore}
                riskLevel={riskLevel}
                gaugeType="risk"
              />
            </div>
          </div>

          {/* Confidence Gauge */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center space-y-4">
              <RiskGauge 
                manipulationScore={confidence}
                riskLevel="confidence"
                gaugeType="confidence"
              />
            </div>
          </div>

          {/* Key Indicators */}
          <div className="flex items-center">
            <KeyIndicators 
              results={results}
              fileType={fileType}
            />
          </div>
        </div>

        {/* Signals Overview */}
        <SignalsOverview 
          results={results}
          fileType={fileType}
        />

        {/* Technical Analysis */}
        <TechnicalAnalysis 
          results={results}
          fileType={fileType}
        />

        {/* Full Report */}
        <FullReport report={results.report} />

        {/* Actions */}
        <div className="flex items-center justify-center gap-4 pt-8 border-t border-neutral-200">
          <Button
            onClick={onReset}
            className="px-8 py-3 bg-neutral-900 text-white hover:bg-neutral-800 font-medium"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Analyze Another
          </Button>

          <Button
            onClick={handleDownload}
            className="px-8 py-3 bg-blue-600 text-white hover:bg-blue-700 font-medium"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>
    </section>
  )
}
