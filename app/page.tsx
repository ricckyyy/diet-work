'use client'

import { useState, useEffect } from 'react'
import WeightAndSideJobChart from './components/WeightAndSideJobChart'

interface WeightData {
  id: number
  date: string
  value: number
}

interface SideJobStats {
  today: number
  week: { total: number; count: number }
  month: { total: number; count: number }
}

export default function Home() {
  const [weight, setWeight] = useState('')
  const [latestWeight, setLatestWeight] = useState<WeightData | null>(null)
  const [previousWeight, setPreviousWeight] = useState<WeightData | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSideJob, setShowSideJob] = useState(false)
  
  // 副業関連の状態
  const [sideJobMinutes, setSideJobMinutes] = useState('')
  const [sideJobMemo, setSideJobMemo] = useState('')
  const [sideJobLoading, setSideJobLoading] = useState(false)
  const [sideJobMessage, setSideJobMessage] = useState('')
  const [stats, setStats] = useState<SideJobStats | null>(null)
  
  // ストップウォッチの状態
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  
  // 日付の状態（ハイドレーションエラー回避のためクライアント側でのみ生成）
  const [today, setToday] = useState('')

  useEffect(() => {
    // クライアント側でのみ日付を生成
    setToday(new Date().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    }))
    
    fetchLatestWeight()
    fetchPreviousWeight()
    fetchSideJobStats()
  }, [])

  // ストップウォッチの更新
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isTimerRunning && startTime !== null) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        setElapsedSeconds(elapsed)
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning, startTime])

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

  const fetchSideJobStats = async () => {
    try {
      const res = await fetch('/api/sidejob/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch side job stats:', error)
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
        await res.json()
        
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

  const handleSideJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!sideJobMinutes) {
      setSideJobMessage('作業時間を入力してください')
      return
    }

    const minutes = parseInt(sideJobMinutes)
    if (isNaN(minutes) || minutes <= 0) {
      setSideJobMessage('有効な時間を入力してください')
      return
    }

    setSideJobLoading(true)
    setSideJobMessage('')

    try {
      const res = await fetch('/api/sidejob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString(),
          minutes: minutes,
          memo: sideJobMemo || null
        })
      })

      if (res.ok) {
        setSideJobMessage(`副業時間を記録しました: ${minutes}分`)
        setSideJobMinutes('')
        setSideJobMemo('')
        
        // タイマーをリセット
        setIsTimerRunning(false)
        setElapsedSeconds(0)
        setStartTime(null)
        
        // 統計を再取得
        await fetchSideJobStats()
      } else {
        setSideJobMessage('保存に失敗しました')
      }
    } catch (error) {
      console.error('Error:', error)
      setSideJobMessage('エラーが発生しました')
    } finally {
      setSideJobLoading(false)
    }
  }

  const handleStartStopTimer = () => {
    if (isTimerRunning) {
      // タイマー停止 - 経過時間を分に変換して入力欄に設定
      setIsTimerRunning(false)
      const minutes = elapsedSeconds > 0 ? Math.ceil(elapsedSeconds / 60) : 0
      setSideJobMinutes(minutes.toString())
    } else {
      // タイマー開始
      setIsTimerRunning(true)
      setStartTime(Date.now())
      setElapsedSeconds(0)
    }
  }

  const handleResetTimer = () => {
    setIsTimerRunning(false)
    setStartTime(null)
    setElapsedSeconds(0)
    setSideJobMinutes('')
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getDiff = () => {
    if (!latestWeight || !previousWeight) return null
    const diff = latestWeight.value - previousWeight.value
    return diff
  }

  const diff = getDiff()

  // 分単位で表示（時間への自動変換なし）
  const formatMinutes = (minutes: number) => {
    return `${minutes}分`
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* 推移グラフ - 一番上に配置 */}
        <WeightAndSideJobChart />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 第1カラム: 体重記録 */}
          <div className="space-y-4">
        {/* 体重記録カード */}
        <div className="bg-white rounded-lg shadow-md p-6">
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
        </div>
          </div>

          {/* 第2カラム: 副業記録 */}
          <div className="space-y-4">
        {/* 副業記録カード */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            副業記録
          </h1>
          
          <p className="text-sm text-gray-500 mb-6">
            {today}
          </p>

          {/* ストップウォッチ */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="text-center mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">ストップウォッチ</p>
              <p className="text-4xl font-bold text-indigo-600 font-mono">
                {formatTime(elapsedSeconds)}
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleStartStopTimer}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  isTimerRunning
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isTimerRunning ? '⏸ 停止' : '▶ 開始'}
              </button>
              
              <button
                type="button"
                onClick={handleResetTimer}
                disabled={isTimerRunning}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                🔄 リセット
              </button>
            </div>
          </div>

          <form onSubmit={handleSideJobSubmit} className="space-y-4">
            <div>
              <label htmlFor="minutes" className="block text-sm font-medium text-gray-700 mb-2">
                実施時間 (分)
              </label>
              <input
                id="minutes"
                type="number"
                min="0"
                value={sideJobMinutes}
                onChange={(e) => setSideJobMinutes(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="30"
                disabled={sideJobLoading}
              />
            </div>

            <div>
              <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-2">
                メモ (任意)
              </label>
              <textarea
                id="memo"
                value={sideJobMemo}
                onChange={(e) => setSideJobMemo(e.target.value)}
                maxLength={200}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ブログ記事執筆..."
                rows={2}
                disabled={sideJobLoading}
              />
            </div>

            <button
              type="submit"
              disabled={sideJobLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {sideJobLoading ? '保存中...' : '保存'}
            </button>
          </form>

          {sideJobMessage && (
            <div className={`mt-4 p-3 rounded-md ${
              sideJobMessage.includes('失敗') || sideJobMessage.includes('エラー')
                ? 'bg-red-50 text-red-700'
                : 'bg-green-50 text-green-700'
            }`}>
              {sideJobMessage}
            </div>
          )}
        </div>
          </div>

          {/* 第3カラム: 副業タイム警告と副業実績 */}
          <div className="space-y-4">
        {/* 副業タイム警告 */}
        {showSideJob && (
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-yellow-900 mb-2 flex items-center gap-2">
              ⚠️ 副業タイム
            </h2>
            <p className="text-yellow-800">
              体重が増加しました！今日は副業30分を実施しましょう
            </p>
          </div>
        )}

        {/* 副業実績カード */}
        {stats && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              📊 副業実績
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md">
                <span className="text-sm font-medium text-gray-700">今日</span>
                <span className="text-lg font-bold text-blue-600">
                  {stats.today > 0 ? formatMinutes(stats.today) : '未記録'}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-green-50 rounded-md">
                <span className="text-sm font-medium text-gray-700">今週</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-green-600">
                    {formatMinutes(stats.week.total)}
                  </span>
                  <p className="text-xs text-gray-500">{stats.week.count}日分</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-md">
                <span className="text-sm font-medium text-gray-700">今月</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-purple-600">
                    {formatMinutes(stats.month.total)}
                  </span>
                  <p className="text-xs text-gray-500">{stats.month.count}日分</p>
                </div>
              </div>
            </div>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  )
}

