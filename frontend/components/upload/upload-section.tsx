"use client"

import { useCallback } from 'react'
import { Upload, FileImage, FileVideo } from 'lucide-react'
import { Button } from '@/components/ui/button'

type AnalysisMode = 'quick' | 'deep'

interface UploadSectionProps {
  file: File | null
  onFileSelect: (file: File) => void
  onAnalyze: (mode: AnalysisMode) => void
  disabled: boolean
  error: string | null
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/bmp', 'image/webp']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-matroska']
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export default function UploadSection({ 
  file, 
  onFileSelect, 
  onAnalyze, 
  disabled,
  error 
}: UploadSectionProps) {
  
  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 50MB limit'
    }

    const isValidImage = ALLOWED_IMAGE_TYPES.includes(file.type)
    const isValidVideo = ALLOWED_VIDEO_TYPES.includes(file.type)

    if (!isValidImage && !isValidVideo) {
      return 'Unsupported file format'
    }

    return null
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      const error = validateFile(droppedFile)
      if (error) {
        alert(error)
        return
      }
      onFileSelect(droppedFile)
    }
  }, [onFileSelect])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const error = validateFile(selectedFile)
      if (error) {
        alert(error)
        return
      }
      onFileSelect(selectedFile)
    }
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Media Analysis</h1>
          <p className="text-gray-600">Upload an image or video for AI-powered verification</p>
        </div>

        {/* Upload Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`
            relative border-2 border-dashed rounded-2xl p-12
            transition-all duration-200
            ${disabled 
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
              : 'border-gray-400 bg-white hover:border-gray-600 hover:bg-gray-50 cursor-pointer'
            }
            ${file ? 'border-green-500 bg-green-50' : ''}
          `}
        >
          <input
            type="file"
            id="file-input"
            className="hidden"
            accept={[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(',')}
            onChange={handleFileInput}
            disabled={disabled}
          />
          
          <label 
            htmlFor="file-input" 
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            {file ? (
              <>
                {file.type.startsWith('image/') ? (
                  <FileImage className="w-16 h-16 text-green-600 mb-4" />
                ) : (
                  <FileVideo className="w-16 h-16 text-green-600 mb-4" />
                )}
                <p className="text-lg font-medium text-gray-900 mb-2">{file.name}</p>
                <p className="text-sm text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </>
            ) : (
              <>
                <Upload className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drag & drop an image or video
                </p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <span className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                  Click to Browse
                </span>
              </>
            )}
          </label>
        </div>

        {/* Supported Formats */}
        <div className="text-center text-sm text-gray-600 space-y-1">
          <p><strong>Images:</strong> JPG, PNG, BMP, WEBP</p>
          <p><strong>Videos:</strong> MP4, AVI, MOV, MKV</p>
          <p className="text-xs text-gray-500">Max file size: 50 MB</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Analysis Mode Selection */}
        {file && (
          <div className="space-y-4">
            <p className="text-center text-sm font-medium text-gray-700">Select Analysis Mode</p>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => onAnalyze('quick')}
                disabled={disabled}
                className="h-auto py-6 flex flex-col items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
              >
                <span className="text-lg font-semibold">⚡ Quick Scan</span>
                <span className="text-xs opacity-90">Faster • Basic Analysis</span>
              </Button>

              <Button
                onClick={() => onAnalyze('deep')}
                disabled={disabled}
                className="h-auto py-6 flex flex-col items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-300"
              >
                <span className="text-lg font-semibold">🔬 Deep Analysis</span>
                <span className="text-xs opacity-90">Slower • Comprehensive</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
