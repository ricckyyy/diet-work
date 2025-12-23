'use client'

import { useState, useEffect } from 'react'

interface WeightData {
  id: number
  date: string
  value: number
}

export default function Home() {
  const [weight, setWeight] = useState('')
  const [latestWeight, setLatestWeight] = useState<WeightData | null>(null)
  const [previousWeight, setPreviousWeight] = useState<WeightData | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSideJob, setShowSideJob] = useState(false)

  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })

  useEffect(() => {
    fetchLatestWeight()
    fetchPreviousWeight()
  }, [])

  const fetchLatestWeight = async () => {
    try {
      const res = await fetch('/api/weight/latest')
      if (res.ok) {
        const data = await res.json()
        setLatestWeight(data)
      }
    } catch (error) {
      console.error('Failed to fetch latest weight:', error)
    }
  }

  const fetchPreviousWeight = async () => {
    try {
      const res = await fetch('/api/weight/previous')
      if (res.ok) {
        const data = await res.json()
        setPreviousWeight(data)
      }
    } catch (error) {
      console.error('Failed to fetch previous weight:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!weight) {
      setMessage('体重を入力してください')
      return
    }

    const weightValue = parseFloat(weight)
    if (isNaN(weightValue) || weightValue <= 0) {
      setMessage('有効な体重を入力してください')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/weight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString(),
          value: weightValue
        })
      })

      if (res.ok) {
        const newWeight = await res.json()
        
        // 前日比の計算
        let diff = 0
        if (latestWeight) {
          diff = weightValue - latestWeight.value
        }

        // 増加した場合のみ副業メッセージを表示
        if (diff > 0) {
          setShowSideJob(true)
        } else {
          setShowSideJob(false)
        }

        setMessage(`体重を記録しました: ${weightValue}kg`)
        setWeight('')
        
        // データを再取得
        await fetchLatestWeight()
        await fetchPreviousWeight()
      } else {
        setMessage('保存に失敗しました')
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const getDiff = () => {
    if (!latestWeight || !previousWeight) return null
    const diff = latestWeight.value - previousWeight.value
    return diff
  }

  const diff = getDiff()

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          体重記録
        </h1>
        
        <p className="text-sm text-gray-500 mb-6">
          {today}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
              今日の体重 (kg)
            </label>
            <input
              id="weight"
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="65.0"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '保存中...' : '保存'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-md ${
            message.includes('失敗') || message.includes('エラー')
              ? 'bg-red-50 text-red-700'
              : 'bg-green-50 text-green-700'
          }`}>
            {message}
          </div>
        )}

        {latestWeight && previousWeight && diff !== null && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h2 className="text-sm font-medium text-gray-700 mb-2">前日比</h2>
            <p className={`text-2xl font-bold ${
              diff > 0 ? 'text-red-600' : diff < 0 ? 'text-blue-600' : 'text-gray-600'
            }`}>
              {diff > 0 ? '+' : ''}{diff.toFixed(1)} kg
            </p>
            <p className="text-xs text-gray-500 mt-1">
              前回: {previousWeight.value}kg → 最新: {latestWeight.value}kg
            </p>
          </div>
        )}

        {showSideJob && (
          <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-md">
            <h2 className="text-lg font-bold text-yellow-900 mb-1">
              ⚠️ 副業タイム
            </h2>
            <p className="text-yellow-800">
              今日は副業30分
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

