'use client'

import { useState, useEffect } from 'react'
import { HealthRecordResponse } from '@/types/health-record'

export default function HealthRecordPage() {
  const [rawInput, setRawInput] = useState('')
  const [records, setRecords] = useState<HealthRecordResponse[]>([])
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      const res = await fetch('/api/health-record?limit=30')
      if (res.ok) {
        const data = await res.json()
        setRecords(data)
        setFetchError('')
      } else {
        setFetchError('記録の取得に失敗しました')
      }
    } catch (error) {
      console.error('Failed to fetch health records:', error)
      setFetchError('ネットワークエラーが発生しました')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!rawInput.trim()) {
      setMessage('入力内容を記入してください')
      setMessageType('error')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/health-record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString(),
          rawInput: rawInput.trim()
        })
      })

      if (res.ok) {
        setMessage('健康記録を保存しました')
        setMessageType('success')
        setRawInput('')
        // データを再取得
        await fetchRecords()
      } else {
        const errorData = await res.json().catch(() => null)
        const errorMessage = errorData?.error || '保存に失敗しました'
        setMessage(errorMessage)
        setMessageType('error')
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('ネットワークエラーが発生しました')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 入力フォーム */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            健康記録
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="rawInput" className="block text-sm font-medium text-gray-700 mb-2">
                今日の健康データを入力
              </label>
              <textarea
                id="rawInput"
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="睡眠: 5時間&#10;体温: 36.2℃&#10;体重: 93.4kg&#10;..."
                rows={6}
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                自由形式で入力できます。睡眠時間、体温、体重、食事内容など
              </p>
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
              messageType === 'error'
                ? 'bg-red-50 text-red-700'
                : 'bg-green-50 text-green-700'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* 過去の記録 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">
            過去の記録
          </h2>

          {fetchError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md">
              {fetchError}
            </div>
          )}

          {records.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
              まだ記録がありません
            </div>
          ) : (
            records.map((record) => (
              <div key={record.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {formatDate(record.date)}
                  </h3>
                </div>
                
                <div className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-md">
                  {record.rawInput}
                </div>
                
                <div className="mt-3 text-xs text-gray-400">
                  記録日時: {new Date(record.createdAt).toLocaleString('ja-JP')}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
