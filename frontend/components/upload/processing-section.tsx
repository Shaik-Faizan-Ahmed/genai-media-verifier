"use client"

import { Loader2 } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface ProcessingSectionProps {
  progress: string
}

export default function ProcessingSection({ progress }: ProcessingSectionProps) {
  const consoleRef = useRef<HTMLDivElement>(null)
  
  // Split progress into lines for better display
  const progressLines = progress.split('\n').filter(line => line.trim())
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight
    }
  }, [progress])
  
  return (
    <section className="min-h-[40vh] flex items-center justify-center px-6 bg-white border-t-2 border-gray-200">
      <div className="text-center space-y-6 max-w-2xl w-full">
        {/* Animated Loader */}
        <div className="relative inline-block">
          <div className="w-24 h-24 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          <Loader2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-blue-600 animate-pulse" />
        </div>

        {/* Progress Text - Display as console-like output */}
        <div ref={consoleRef} className="bg-gray-900 rounded-lg p-6 text-left max-h-96 overflow-y-auto scroll-smooth">
          <div className="font-mono text-sm space-y-1">
            {progressLines.length > 0 ? (
              progressLines.map((line, index) => (
                <div
                  key={index}
                  className="text-green-400 animate-fadeIn"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {line}
                </div>
              ))
            ) : (
              <div className="text-green-400">Initializing...</div>
            )}
          </div>
        </div>

        {/* Clinical Progress Indicator */}
        <div className="flex items-center justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
