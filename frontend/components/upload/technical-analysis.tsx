"use client"

import { useState } from 'react'

interface TechnicalAnalysisProps {
  results: any
  fileType: 'image' | 'video'
}

export default function TechnicalAnalysis({ results, fileType }: TechnicalAnalysisProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [{ id: 'overview', label: 'Overview' }]

  if (fileType === 'image') {
    const breakdown = results.analysis_breakdown || {}
    if (breakdown.neural_network) tabs.push({ id: 'neural', label: 'Neural' })
    if (breakdown.frequency_domain) tabs.push({ id: 'frequency', label: 'Frequency' })
    if (breakdown.facial_analysis) tabs.push({ id: 'facial', label: 'Facial' })
    if (breakdown.metadata_forensics) tabs.push({ id: 'metadata', label: 'Metadata' })
  } else {
    const layerSummaries = results.layer_summaries || {}
    if (layerSummaries.visual) tabs.push({ id: 'visual', label: 'Visual' })
    if (layerSummaries.audio && layerSummaries.audio.present !== false) tabs.push({ id: 'audio', label: 'Audio' })
    if (layerSummaries.physiological) tabs.push({ id: 'physiological', label: 'Physiological' })
    if (layerSummaries.physics) tabs.push({ id: 'physics', label: 'Physics' })
    if (layerSummaries.specialized) tabs.push({ id: 'specialized', label: 'Specialized' })
    if (layerSummaries.metadata) tabs.push({ id: 'metadata', label: 'Metadata' })
  }

  const renderMetric = (label: string, value: number | string, suffix = '') => {
    const displayValue = typeof value === 'number' 
      ? `${Math.round(value * 100)}${suffix}`
      : value
    
    return (
      <div className="flex justify-between items-center py-2.5 border-b border-neutral-100 last:border-0">
        <span className="text-sm text-neutral-600">{label}</span>
        <span className="text-sm font-semibold text-neutral-900">{displayValue}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Technical Analysis</h2>
        <p className="text-neutral-600 mt-1">Detailed forensic inspection on demand</p>
      </div>

      <div className="border-b border-neutral-200">
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                pb-3 px-1 text-sm font-medium tracking-wide whitespace-nowrap
                transition-colors border-b-2 -mb-px
                ${activeTab === tab.id 
                  ? 'border-neutral-900 text-neutral-900' 
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[300px]">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <p className="text-neutral-700 leading-relaxed">
              This {results.analysis_type || 'comprehensive'} analysis applied multiple forensic methods 
              to detect signs of manipulation or synthetic generation in this {fileType}.
            </p>

            {fileType === 'image' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.analysis_breakdown?.neural_network && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-neutral-900">Neural Network Ensemble</h3>
                    <div className="space-y-1">
                      {renderMetric('Detection Score', results.analysis_breakdown.neural_network.score, '%')}
                      {renderMetric('Confidence', results.analysis_breakdown.neural_network.confidence, '%')}
                      {renderMetric('Models Used', results.analysis_breakdown.neural_network.num_models, '')}
                    </div>
                  </div>
                )}
                {results.analysis_breakdown?.frequency_domain && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-neutral-900">Frequency Domain</h3>
                    <div className="space-y-1">
                      {renderMetric('Overall Score', results.analysis_breakdown.frequency_domain.score, '%')}
                      {renderMetric('FFT Analysis', results.analysis_breakdown.frequency_domain.fft_score, '%')}
                      {renderMetric('DCT Analysis', results.analysis_breakdown.frequency_domain.dct_score, '%')}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.layer_summaries?.visual?.frame_based && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-neutral-900">Frame Analysis</h3>
                    <div className="space-y-1">
                      {renderMetric('Ensemble Average', results.layer_summaries.visual.frame_based.ensemble_avg, '%')}
                      {renderMetric('Face Average', results.layer_summaries.visual.frame_based.face_avg, '%')}
                      {renderMetric('Frequency Average', results.layer_summaries.visual.frame_based.frequency_avg, '%')}
                    </div>
                  </div>
                )}
                {results.layer_summaries?.visual?.temporal && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-neutral-900">Temporal Consistency</h3>
                    <div className="space-y-1">
                      {renderMetric('Overall Score', results.layer_summaries.visual.temporal.score, '%')}
                      {renderMetric('Identity Shifts', results.layer_summaries.visual.temporal.identity_shifts, '')}
                      {renderMetric('Motion Smoothness', results.layer_summaries.visual.temporal.motion_smoothness, '%')}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Image-specific tabs */}
        {fileType === 'image' && activeTab === 'neural' && results.analysis_breakdown?.neural_network && (
          <div className="space-y-6">
            <p className="text-neutral-700 leading-relaxed text-sm">
              Deep learning models trained on thousands of real and fake images to detect subtle patterns.
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-neutral-500 tracking-wide uppercase">Overall Score</div>
                  <div className="text-3xl font-bold text-neutral-900">
                    {Math.round(results.analysis_breakdown.neural_network.score * 100)}%
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-neutral-500 tracking-wide uppercase">Confidence</div>
                  <div className="text-3xl font-bold text-neutral-900">
                    {Math.round(results.analysis_breakdown.neural_network.confidence * 100)}%
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-neutral-500 tracking-wide uppercase">Agreement</div>
                  <div className="text-lg font-semibold text-neutral-900 capitalize pt-1">
                    {results.analysis_breakdown.neural_network.model_agreement?.replace('_', ' ')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video-specific tabs */}
        {fileType === 'video' && activeTab === 'visual' && results.layer_summaries?.visual && (
          <div className="space-y-6">
            <p className="text-neutral-700 leading-relaxed text-sm">
              Multi-modal visual analysis combining frame-based detection, temporal consistency, and 3D video models.
            </p>
            <div className="space-y-4">
              {results.layer_summaries.visual.frame_based && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-neutral-900">Frame-Based Analysis</h3>
                  <div className="space-y-1">
                    {renderMetric('Ensemble Average', results.layer_summaries.visual.frame_based.ensemble_avg, '%')}
                    {renderMetric('Ensemble Maximum', results.layer_summaries.visual.frame_based.ensemble_max, '%')}
                    {renderMetric('Face Average', results.layer_summaries.visual.frame_based.face_avg, '%')}
                    {renderMetric('Frequency Average', results.layer_summaries.visual.frame_based.frequency_avg, '%')}
                  </div>
                </div>
              )}
              {results.layer_summaries.visual.temporal && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-neutral-900">Temporal Consistency</h3>
                  <div className="space-y-1">
                    {renderMetric('Consistency Score', results.layer_summaries.visual.temporal.score, '%')}
                    {renderMetric('Identity Shifts', results.layer_summaries.visual.temporal.identity_shifts, '')}
                    {renderMetric('Motion Smoothness', results.layer_summaries.visual.temporal.motion_smoothness, '%')}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {fileType === 'video' && activeTab === 'audio' && results.layer_summaries?.audio && (
          <div className="space-y-6">
            <p className="text-neutral-700 leading-relaxed text-sm">
              Analyzes voice characteristics and lip-sync correlation to detect audio deepfakes.
            </p>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-xs text-neutral-500 tracking-wide uppercase">Overall Score</div>
                <div className="text-3xl font-bold text-neutral-900">
                  {Math.round(results.layer_summaries.audio.score * 100)}%
                </div>
              </div>
              <div className="space-y-2 pt-4">
                {renderMetric('Voice Deepfake', results.layer_summaries.audio.voice_deepfake, '%')}
                {renderMetric('Lip Sync Quality', results.layer_summaries.audio.lip_sync, '%')}
              </div>
            </div>
          </div>
        )}

        {fileType === 'video' && activeTab === 'physiological' && results.layer_summaries?.physiological && (
          <div className="space-y-6">
            <p className="text-neutral-700 leading-relaxed text-sm">
              Detects physiological signals like heartbeat and blink patterns via remote sensing.
            </p>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-xs text-neutral-500 tracking-wide uppercase">Overall Score</div>
                <div className="text-3xl font-bold text-neutral-900">
                  {Math.round(results.layer_summaries.physiological.score * 100)}%
                </div>
              </div>
              <div className="space-y-2 pt-4">
                {renderMetric('Heartbeat Detected', results.layer_summaries.physiological.heartbeat_detected ? 'Yes' : 'No', '')}
                {results.layer_summaries.physiological.heartbeat_detected && 
                  renderMetric('Heart Rate (BPM)', results.layer_summaries.physiological.heartbeat_bpm, '')
                }
                {renderMetric('Natural Blink Pattern', results.layer_summaries.physiological.natural_blink_pattern ? 'Yes' : 'No', '')}
                {renderMetric('Blink Count', results.layer_summaries.physiological.blink_count, '')}
              </div>
            </div>
          </div>
        )}

        {fileType === 'video' && activeTab === 'physics' && results.layer_summaries?.physics && (
          <div className="space-y-6">
            <p className="text-neutral-700 leading-relaxed text-sm">
              Checks lighting consistency and depth plausibility using physics-based analysis.
            </p>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-xs text-neutral-500 tracking-wide uppercase">Overall Score</div>
                <div className="text-3xl font-bold text-neutral-900">
                  {Math.round(results.layer_summaries.physics.score * 100)}%
                </div>
              </div>
              <div className="space-y-2 pt-4">
                {renderMetric('Lighting Consistent', results.layer_summaries.physics.lighting_consistent ? 'Yes' : 'No', '')}
                {renderMetric('Depth Plausible', results.layer_summaries.physics.depth_plausible ? 'Yes' : 'No', '')}
              </div>
            </div>
          </div>
        )}

        {fileType === 'video' && activeTab === 'specialized' && results.layer_summaries?.specialized && (
          <div className="space-y-6">
            <p className="text-neutral-700 leading-relaxed text-sm">
              Advanced boundary and compression analysis for detecting splice points and editing artifacts.
            </p>
            <div className="space-y-4">
              {results.layer_summaries.specialized.boundary && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-neutral-900">Boundary Analysis</h3>
                  <div className="space-y-1">
                    {renderMetric('Detection Score', results.layer_summaries.specialized.boundary.score, '%')}
                    {renderMetric('Suspicious Transitions', results.layer_summaries.specialized.boundary.suspicious_transitions, '')}
                    {renderMetric('Quality Drops', results.layer_summaries.specialized.boundary.quality_drops, '')}
                  </div>
                </div>
              )}
              {results.layer_summaries.specialized.compression && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-neutral-900">Compression Analysis</h3>
                  <div className="space-y-1">
                    {renderMetric('Detection Score', results.layer_summaries.specialized.compression.score, '%')}
                    {renderMetric('Compression Mismatches', results.layer_summaries.specialized.compression.mismatches, '')}
                    {renderMetric('Face Compression', results.layer_summaries.specialized.compression.face_compression, '%')}
                    {renderMetric('Background Compression', results.layer_summaries.specialized.compression.background_compression, '%')}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'metadata' && (
          <div className="space-y-6">
            <p className="text-neutral-700 leading-relaxed text-sm">
              {fileType === 'image' 
                ? 'Analyzes EXIF metadata and compression patterns using Error Level Analysis.'
                : 'Analyzes video container metadata, encoding parameters, and frame rate consistency.'
              }
            </p>
            <div className="space-y-4">
              {fileType === 'image' && results.analysis_breakdown?.metadata_forensics && (
                <div className="space-y-1">
                  <div className="text-xs text-neutral-500 tracking-wide uppercase">Overall Score</div>
                  <div className="text-3xl font-bold text-neutral-900">
                    {Math.round(results.analysis_breakdown.metadata_forensics.score * 100)}%
                  </div>
                </div>
              )}
              {fileType === 'video' && results.layer_summaries?.metadata && (
                <div className="space-y-1">
                  <div className="text-xs text-neutral-500 tracking-wide uppercase">Overall Score</div>
                  <div className="text-3xl font-bold text-neutral-900">
                    {Math.round(results.layer_summaries.metadata.score * 100)}%
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
