'use client'

import { useState } from 'react'
import ImageUpload from '@/components/ImageUpload'
import ResultDisplay from '@/components/ResultDisplay'

export interface PetResult {
  animal: 'cat' | 'dog' | 'unknown'
  breed: string
  confidence: number
  description?: string
}

export default function Home() {
  const [result, setResult] = useState<PetResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = async (file: File) => {
    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('/api/identify', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to identify pet breed')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-3">
            🐱 <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Pawsome</span> 🐶
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Cat & Dog Breed Identifier
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Upload a photo of your furry friend! 📸 Our AI will identify if it&apos;s a cat 🐱 or dog 🐶, 
            determine the breed, and share fun facts about your pet! ✨
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <ImageUpload onImageUpload={handleImageUpload} loading={loading} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">⚠️</div>
              <div>
                <h3 className="text-red-800 font-semibold">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <ResultDisplay result={result} />
          </div>
        )}
      </div>
    </main>
  )
}
