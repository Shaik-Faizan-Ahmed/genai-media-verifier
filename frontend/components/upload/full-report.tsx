"use client"

interface FullReportProps {
  report: string
}

export default function FullReport({ report }: FullReportProps) {
  if (!report) return null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Full Report</h2>
        <p className="text-neutral-600 mt-1">Complete technical findings</p>
      </div>

      <div className="bg-white border border-neutral-200 p-6 rounded-lg">
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-neutral-700 leading-relaxed">
            {report}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <p className="text-sm text-blue-900 leading-relaxed">
          <strong>Disclaimer:</strong> This assessment is probabilistic and should not be considered 
          definitive proof of authenticity or manipulation. Results should be interpreted by trained 
          professionals alongside contextual analysis, source verification, and chain of custody validation.
        </p>
      </div>
    </div>
  )
}
