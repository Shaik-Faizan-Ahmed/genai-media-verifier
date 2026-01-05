"use client"

import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import UploadSection from '@/components/upload/upload-section'
import ProcessingSection from '@/components/upload/processing-section'
import ResultsDashboard from '@/components/upload/results-dashboard'

// Dynamic imports for background effects
const AnoAI = dynamic(() => import("@/components/ui/animated-shader-background"), { 
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-900/50 to-transparent" />
  )
})

const SnowParticles = dynamic(
  () => import("@/components/ui/snow-particles").then(mod => ({ default: mod.SnowParticles })),
  { ssr: false }
)

type AnalysisState = 'idle' | 'uploading' | 'processing' | 'complete' | 'error'
type AnalysisMode = 'quick' | 'deep'
type FileType = 'image' | 'video'

export default function UploadPage() {
  const [state, setState] = useState<AnalysisState>('idle')
  const [mode, setMode] = useState<AnalysisMode | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [fileType, setFileType] = useState<FileType | null>(null)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<string>('')
  const [progressMessages, setProgressMessages] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [currentStage, setCurrentStage] = useState<string>('')
  const resultsRef = useRef<HTMLDivElement>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setError(null)
    
    const type = selectedFile.type.startsWith('image/') ? 'image' : 'video'
    setFileType(type)
  }

  const getStageFromMessage = (message: string): { stage: string; progress: number } => {
    console.log('Processing message:', message) // Debug log
    
    // Layer 1
    if (message.includes('LAYER 1') || message.includes('Metadata')) {
      return { stage: 'Stage 1: Metadata Analysis', progress: 10 }
    }
    // Layer 2A - Frame extraction
    if (message.includes('LAYER 2A') && message.includes('Extracting')) {
      return { stage: 'Stage 2A: Frame Extraction', progress: 20 }
    }
    // Layer 2A - Frame analysis
    if (message.includes('Analyzing frames') || message.includes('Processed')) {
      const match = message.match(/Processed (\d+)\/(\d+)/)
      if (match) {
        const current = parseInt(match[1])
        const total = parseInt(match[2])
        const frameProgress = 20 + (current / total) * 15
        return { stage: `Stage 2A: Analyzing Frames (${current}/${total})`, progress: frameProgress }
      }
      return { stage: 'Stage 2A: Frame Analysis', progress: 25 }
    }
    // Layer 2A - Temporal
    if (message.includes('Temporal')) {
      return { stage: 'Stage 2A: Temporal Consistency', progress: 40 }
    }
    // Layer 2A - 3D Model
    if (message.includes('3D') || message.includes('video model')) {
      return { stage: 'Stage 2A: 3D Video Model', progress: 50 }
    }
    // Layer 2B - Audio
    if (message.includes('LAYER 2B') || message.includes('Audio')) {
      return { stage: 'Stage 2B: Audio Analysis', progress: 60 }
    }
    // Layer 2C - Physiological
    if (message.includes('LAYER 2C') || message.includes('Physiological')) {
      return { stage: 'Stage 2C: Physiological Signals', progress: 70 }
    }
    // Layer 2D - Physics
    if (message.includes('LAYER 2D') || message.includes('Physics')) {
      return { stage: 'Stage 2D: Physics Consistency', progress: 80 }
    }
    // Layer 3 - Boundary
    if (message.includes('LAYER 3') || message.includes('Boundary')) {
      return { stage: 'Stage 3: Boundary Analysis', progress: 85 }
    }
    // Layer 3 - Compression
    if (message.includes('Compression')) {
      return { stage: 'Stage 3: Compression Analysis', progress: 90 }
    }
    // Final scoring
    if (message.includes('Final') || message.includes('Complete')) {
      return { stage: 'Stage 4: Finalizing Report', progress: 95 }
    }
    
    return { stage: message, progress: uploadProgress }
  }

  const handleAnalyze = async (selectedMode: AnalysisMode) => {
    if (!file || !fileType) return

    setMode(selectedMode)
    setState('uploading')
    setProgress('Uploading file...')
    setProgressMessages(['Uploading file...'])
    setUploadProgress(0)
    setCurrentStage('Uploading file...')

    try {
      const formData = new FormData()
      formData.append('file', file)

      let endpoint = ''
      if (fileType === 'image') {
        endpoint = selectedMode === 'quick' ? '/analyze/image' : '/analyze/image/comprehensive'
      } else {
        endpoint = selectedMode === 'quick' ? '/analyze/video' : '/analyze/video/comprehensive'
      }

      setState('processing')
      
      let progressInterval: NodeJS.Timeout | null = null
      
      if (selectedMode === 'deep') {
        // Connect to SSE FIRST before starting analysis
        console.log('Connecting to SSE endpoint...')
        eventSourceRef.current = new EventSource('http://localhost:8000/analyze/progress')
        
        eventSourceRef.current.onopen = () => {
          console.log('SSE connection opened')
        }
        
        eventSourceRef.current.onmessage = (event) => {
          console.log('SSE message received:', event.data)
          try {
            const data = JSON.parse(event.data)
            if (data.message) {
              const { stage, progress } = getStageFromMessage(data.message)
              console.log('Stage:', stage, 'Progress:', progress)
              setProgressMessages(prev => [...prev, data.message])
              setProgress(data.message)
              setCurrentStage(stage)
              setUploadProgress(progress)
            }
          } catch (e) {
            console.error('Error parsing SSE message:', e)
          }
        }
        
        eventSourceRef.current.onerror = (error) => {
          console.log('SSE error or connection closed:', error)
          eventSourceRef.current?.close()
        }
        
        // Wait a bit for SSE connection to establish
        await new Promise(resolve => setTimeout(resolve, 500))
        console.log('Starting analysis request...')
      } else {
        // For quick scan, simulate progress
        const progressSteps = [
          { msg: 'Uploading file...', progress: 10 },
          { msg: fileType === 'video' ? 'Extracting frames...' : 'Processing image...', progress: 25 },
          { msg: 'Analyzing neural patterns...', progress: 40 },
          { msg: 'Checking frequency domain...', progress: 55 },
          { msg: 'Scanning facial landmarks...', progress: 70 },
          { msg: 'Examining metadata...', progress: 85 },
          { msg: 'Generating report...', progress: 95 }
        ]

        let stepIndex = 0
        progressInterval = setInterval(() => {
          if (stepIndex < progressSteps.length) {
            const step = progressSteps[stepIndex]
            setProgress(step.msg)
            setCurrentStage(step.msg)
            setProgressMessages(prev => [...prev, step.msg])
            setUploadProgress(step.progress)
            stepIndex++
          }
        }, 1500)
      }

      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        body: formData,
      })

      if (progressInterval) {
        clearInterval(progressInterval)
      }

      setUploadProgress(100)
      setCurrentStage('Analysis Complete!')

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      setResults(data)
      setState('complete')
      
      // Close SSE after getting results
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
      
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }, 300)

    } catch (err) {
      setState('error')
      setError(err instanceof Error ? err.message : 'Analysis failed')
      setUploadProgress(0)
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
    }
  }

  const handleReset = () => {
    setState('idle')
    setMode(null)
    setFile(null)
    setFileType(null)
    setResults(null)
    setError(null)
    setProgress('')
    setProgressMessages([])
    setUploadProgress(0)
    setCurrentStage('')
    
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    // Cancel ongoing operations if any
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    
    setState('idle')
    setMode(null)
    setFile(null)
    setFileType(null)
    setResults(null)
    setError(null)
    setProgress('')
    setProgressMessages([])
    setUploadProgress(0)
    setCurrentStage('')
    
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30 overflow-x-hidden font-sans">
      {/* Global background effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AnoAI className="opacity-90" />
        <SnowParticles quantity={80} />
      </div>

      {/* Noise texture overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Upload Section - Always visible in idle state */}
        {state === 'idle' && (
          <UploadSection
            file={file}
            onFileSelect={handleFileSelect}
            onAnalyze={handleAnalyze}
            disabled={state !== 'idle'}
            error={error}
          />
        )}

        {/* Processing Section - Shows during upload/processing */}
        {(state === 'uploading' || state === 'processing' || state === 'complete') && (
          <ProcessingSection 
            file={file}
            progress={progressMessages.join('\n')}
            uploadProgress={uploadProgress}
            currentStage={currentStage}
            onCancel={handleCancel}
          />
        )}

        {/* Results Section - Appears below processing section */}
        {state === 'complete' && results && (
          <div ref={resultsRef}>
            <ResultsDashboard
              results={results}
              fileType={fileType!}
              mode={mode!}
              onReset={handleReset}
            />
          </div>
        )}
      </div>
    </main>
  )
}
