'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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
  const [sideJobMessage, setSideJobMessage] = useState('')
  const [stats, setStats] = useState<SideJobStats | null>(null)
  
  // ストップウォッチの状態
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  
  // 日付の状態（ハイドレーションエラー回避のためクライアント側でのみ生成）
  const [today, setToday] = useState('')
  const [recordDate, setRecordDate] = useState('')
  const [todayStr, setTodayStr] = useState('')

  useEffect(() => {
    // クライアント側でのみ日付を生成
    const now = new Date()
    setToday(now.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    }))
    // 体重入力用の日付をYYYY-MM-DD形式で設定（ローカル時刻を使用）
    const yyyy = now.getFullYear()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    const localDateStr = `${yyyy}-${mm}-${dd}`
    setRecordDate(localDateStr)
    setTodayStr(localDateStr)
    
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

  const handleCombinedSubmit = async () => {
    if (!weight) {
      setMessage('体重を入力してください')
      return
    }

    const weightValue = parseFloat(weight)
    if (isNaN(weightValue) || weightValue <= 0) {
      setMessage('有効な体重を入力してください')
      return
    }

    let minutes: number | null = null
    if (sideJobMinutes) {
      minutes = parseInt(sideJobMinutes)
      if (isNaN(minutes) || minutes <= 0) {
        setSideJobMessage('有効な時間を入力してください')
        return
      }
    }

    setLoading(true)
    setMessage('')
    setSideJobMessage('')

    try {
      // 体重を保存
      const weightRes = await fetch('/api/weight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date(recordDate).toISOString(),
          value: weightValue
        })
      })

      if (weightRes.ok) {
        let diff = 0
        if (latestWeight) {
          diff = weightValue - latestWeight.value
        }
        if (diff > 0) {
          setShowSideJob(true)
        } else {
          setShowSideJob(false)
        }
        const isToday = recordDate === todayStr
        setMessage(`体重を記録しました: ${weightValue}kg${isToday ? '' : ` (${recordDate})`}`)
        setWeight('')
        await fetchLatestWeight()
        await fetchPreviousWeight()
      } else {
        setMessage('体重の保存に失敗しました')
      }

      // 副業時間を保存（入力がある場合のみ）
      if (minutes !== null) {
        const sideJobRes = await fetch('/api/sidejob', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: new Date(recordDate).toISOString(),
            minutes: minutes,
            memo: sideJobMemo || null
          })
        })

        if (sideJobRes.ok) {
          setSideJobMessage(`活動時間を記録しました: ${minutes}分`)
          setSideJobMinutes('')
          setSideJobMemo('')
          setIsTimerRunning(false)
          setElapsedSeconds(0)
          setStartTime(null)
          await fetchSideJobStats()
        } else {
          setSideJobMessage('活動時間の保存に失敗しました')
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('エラーが発生しました')
    } finally {
      setLoading(false)
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
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-lg mx-auto px-3 pt-3 pb-4 space-y-2">

        {/* グラフ（縮小版・一番上） */}
        <WeightAndSideJobChart />

        <div className="flex justify-end -mt-1">
          <Link href="/graph" className="text-xs text-blue-600 hover:underline">
            グラフを大きく表示 →
          </Link>
        </div>

        {/* 日付 + 保存ボタン */}
        <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm px-3 py-2">
          <label htmlFor="recordDate" className="text-xs font-medium text-gray-500 whitespace-nowrap w-10 shrink-0">
            記録日
          </label>
          <input
            id="recordDate"
            type="date"
            value={recordDate}
            onChange={(e) => setRecordDate(e.target.value)}
            max={todayStr}
            className="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button
            type="button"
            onClick={handleCombinedSubmit}
            disabled={loading}
            className="shrink-0 px-4 py-1.5 bg-blue-600 text-white text-sm rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '保存中...' : '保存'}
          </button>
        </div>

        {/* 4行入力カード */}
        <div className="bg-white rounded-lg shadow-sm px-3 py-2 space-y-2">

          {/* 体重行 */}
          <div className="flex items-center gap-2">
            <label htmlFor="weight" className="text-sm font-medium text-gray-700 w-14 shrink-0 leading-tight">
              体重
              <span className="block text-xs font-normal text-gray-400">kg</span>
            </label>
            <input
              id="weight"
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              placeholder="65.0"
              disabled={loading}
            />
            {diff !== null && (
              <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded-full ${
                diff > 0 ? 'bg-red-100 text-red-600' : diff < 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {diff > 0 ? '+' : ''}{diff.toFixed(1)}kg
              </span>
            )}
          </div>

          {/* 活動行 */}
          <div className="flex items-center gap-2">
            <label htmlFor="minutes" className="text-sm font-medium text-gray-700 w-14 shrink-0 leading-tight">
              活動
              <span className="block text-xs font-normal text-gray-400">分</span>
            </label>
            <input
              id="minutes"
              type="number"
              min="0"
              value={sideJobMinutes}
              onChange={(e) => setSideJobMinutes(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              placeholder="30"
              disabled={loading}
            />
          </div>

          {/* メモ行 */}
          <div className="flex items-center gap-2">
            <label htmlFor="memo" className="text-sm font-medium text-gray-700 w-14 shrink-0">
              メモ
            </label>
            <input
              id="memo"
              type="text"
              value={sideJobMemo}
              onChange={(e) => setSideJobMemo(e.target.value)}
              maxLength={200}
              className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              placeholder="ブログ記事執筆..."
              disabled={loading}
            />
          </div>

          {/* ストップウォッチ行 */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 w-14 shrink-0 leading-tight">
              SW
              <span className="block text-xs font-normal text-gray-400">計測</span>
            </label>
            <span className="text-lg font-bold font-mono text-indigo-600 w-16 text-center shrink-0 tabular-nums">
              {formatTime(elapsedSeconds)}
            </span>
            <button
              type="button"
              onClick={handleStartStopTimer}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                isTimerRunning
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isTimerRunning ? '⏸ 停止' : '▶ 開始'}
            </button>
            <button
              type="button"
              onClick={handleResetTimer}
              disabled={isTimerRunning}
              className="shrink-0 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-md font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ↺
            </button>
          </div>
        </div>

        {/* フィードバックメッセージ */}
        {(message || sideJobMessage) && (
          <div className="space-y-1">
            {message && (
              <p className={`text-xs px-3 py-1.5 rounded-md ${
                message.includes('失敗') || message.includes('エラー')
                  ? 'bg-red-50 text-red-700'
                  : 'bg-green-50 text-green-700'
              }`}>
                {message}
              </p>
            )}
            {sideJobMessage && (
              <p className={`text-xs px-3 py-1.5 rounded-md ${
                sideJobMessage.includes('失敗') || sideJobMessage.includes('エラー')
                  ? 'bg-red-50 text-red-700'
                  : 'bg-green-50 text-green-700'
              }`}>
                {sideJobMessage}
              </p>
            )}
          </div>
        )}

        {/* 区切り */}
        <div className="flex items-center gap-2 pt-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">活動実績</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* 体重増加警告 */}
        {showSideJob && (
          <div className="bg-yellow-50 border border-yellow-400 rounded-lg px-3 py-2 flex items-center gap-2">
            <span className="text-yellow-900 text-sm font-semibold flex-1">
              ⚠️ 体重増加！活動30分を実施しましょう
            </span>
          </div>
        )}

        {/* 活動実績（3列コンパクト） */}
        {stats && (
          <div className="bg-white rounded-lg shadow-sm px-3 py-2">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-blue-50 rounded-md py-2">
                <p className="text-xs text-gray-500">今日</p>
                <p className="text-sm font-bold text-blue-600">
                  {stats.today > 0 ? formatMinutes(stats.today) : '—'}
                </p>
              </div>
              <div className="bg-green-50 rounded-md py-2">
                <p className="text-xs text-gray-500">今週</p>
                <p className="text-sm font-bold text-green-600">{formatMinutes(stats.week.total)}</p>
                <p className="text-xs text-gray-400">{stats.week.count}日</p>
              </div>
              <div className="bg-purple-50 rounded-md py-2">
                <p className="text-xs text-gray-500">今月</p>
                <p className="text-sm font-bold text-purple-600">{formatMinutes(stats.month.total)}</p>
                <p className="text-xs text-gray-400">{stats.month.count}日</p>
              </div>
            </div>
          </div>
        )}

        {/* 前日比詳細 */}
        {latestWeight && previousWeight && diff !== null && (
          <div className="bg-white rounded-lg shadow-sm px-3 py-2 flex items-center justify-between">
            <p className="text-xs text-gray-500">前回 {previousWeight.value}kg → 最新 {latestWeight.value}kg</p>
            <p className={`text-sm font-bold ${
              diff > 0 ? 'text-red-600' : diff < 0 ? 'text-blue-600' : 'text-gray-600'
            }`}>
              {diff > 0 ? '+' : ''}{diff.toFixed(1)} kg
            </p>
          </div>
        )}

        {/* 健康記録リンク */}
        <Link
          href="/health-record"
          className="block bg-white rounded-lg shadow-sm px-4 py-3 hover:shadow-md transition-shadow border-l-4 border-green-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-800">健康記録</p>
              <p className="text-xs text-gray-500 mt-0.5">日々の健康データをグラフで確認</p>
            </div>
            <span className="text-gray-400 text-xl">&rarr;</span>
          </div>
        </Link>

      </div>
    </div>
  )
}

