"use client"

import { useState } from 'react'
import UploadSection from '@/components/upload/upload-section'
import ProcessingSection from '@/components/upload/processing-section'
import ResultsDashboard from '@/components/upload/results-dashboard'

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

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setError(null)
    
    // Determine file type
    const type = selectedFile.type.startsWith('image/') ? 'image' : 'video'
    setFileType(type)
  }

  const handleAnalyze = async (selectedMode: AnalysisMode) => {
    if (!file || !fileType) return

    setMode(selectedMode)
    setState('uploading')
    setProgress('Uploading file...')
    setProgressMessages(['Uploading file...'])

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Determine backend route
      let endpoint = ''
      if (fileType === 'image') {
        endpoint = selectedMode === 'quick' ? '/analyze/image' : '/analyze/image/comprehensive'
      } else {
        endpoint = selectedMode === 'quick' ? '/analyze/video' : '/analyze/video/comprehensive'
      }

      setState('processing')
      
      // Connect to SSE for live progress updates (only for comprehensive analysis)
      let eventSource: EventSource | null = null
      if (selectedMode === 'deep') {
        eventSource = new EventSource('http://localhost:8000/analyze/progress')
        
        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data)
          if (data.message) {
            setProgressMessages(prev => [...prev, data.message])
            setProgress(data.message)
          }
        }
        
        eventSource.onerror = () => {
          console.log('SSE connection closed')
          eventSource?.close()
        }
      } else {
        // For quick analysis, use predetermined messages
        const progressSteps = [
          'Uploading file...',
          fileType === 'video' ? 'Extracting frames...' : 'Processing image...',
          'Analyzing neural patterns...',
          'Checking frequency domain...',
          'Scanning facial landmarks...',
          'Examining metadata...',
          'Generating report...'
        ]

        let stepIndex = 0
        const progressInterval = setInterval(() => {
          if (stepIndex < progressSteps.length) {
            setProgress(progressSteps[stepIndex])
            setProgressMessages(prev => [...prev, progressSteps[stepIndex]])
            stepIndex++
          }
        }, 1500)
      }

      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        body: formData,
      })

      // Close SSE connection
      if (eventSource) {
        eventSource.close()
      }

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      setResults(data)
      setState('complete')
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }, 300)

    } catch (err) {
      setState('error')
      setError(err instanceof Error ? err.message : 'Analysis failed')
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
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Section 1: Upload */}
      <UploadSection
        file={file}
        onFileSelect={handleFileSelect}
        onAnalyze={handleAnalyze}
        disabled={state !== 'idle'}
        error={error}
      />

      {/* Section 2: Processing */}
      {(state === 'uploading' || state === 'processing') && (
        <ProcessingSection progress={progressMessages.join('\n')} />
      )}

      {/* Section 3: Results */}
      {state === 'complete' && results && (
        <ResultsDashboard
          results={results}
          fileType={fileType!}
          mode={mode!}
          onReset={handleReset}
        />
      )}
    </div>
  )
}
