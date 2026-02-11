'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
} from 'recharts'

interface HealthRecord {
  id: string
  userId: string
  date: string
  weight: number | null
  bodyTemp: number | null
  sleepHours: number | null
  waterIntake: number | null
  steps: number | null
  meals: string | null
  activities: string | null
  notes: string | null
  rawInput: string
  createdAt: string
  updatedAt: string
}

type ViewMode = 'list' | 'table' | 'chart'

export default function HealthRecordPage() {
  const [rawInput, setRawInput] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [fetchLoading, setFetchLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [mounted, setMounted] = useState(false)

  const fetchRecords = useCallback(async () => {
    try {
      setFetchLoading(true)
      const res = await fetch('/api/health-record?limit=90')
      if (res.ok) {
        const data = await res.json()
        setRecords(data)
      }
    } catch (error) {
      console.error('Failed to fetch records:', error)
    } finally {
      setFetchLoading(false)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    setSelectedDate(`${yyyy}-${mm}-${dd}`)
    fetchRecords()
  }, [fetchRecords])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!rawInput.trim()) {
      setMessage('内容を入力してください')
      return
    }

    if (!selectedDate) {
      setMessage('日付を選択してください')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/health-record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date(selectedDate).toISOString(),
          rawInput: rawInput.trim(),
        }),
      })

      if (res.ok) {
        setMessage('記録を保存しました')
        setRawInput('')
        await fetchRecords()
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const weekdays = ['日', '月', '火', '水', '木', '金', '土']
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = date.getDate()
    const w = weekdays[date.getDay()]
    return `${y}/${m}/${d} (${w})`
  }

  const formatShortDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  // Chart data: reverse to ascending order for display
  const chartData = [...records]
    .reverse()
    .map((r) => ({
      date: formatShortDate(r.date),
      weight: r.weight,
      sleepHours: r.sleepHours,
      bodyTemp: r.bodyTemp,
      steps: r.steps,
      waterIntake: r.waterIntake,
    }))

  const hasNumericData = records.some(
    (r) =>
      r.weight !== null ||
      r.sleepHours !== null ||
      r.bodyTemp !== null ||
      r.steps !== null ||
      r.waterIntake !== null
  )

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            健康記録
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="record-date" className="block text-sm font-medium text-gray-700 mb-2">
                日付
              </label>
              <input
                id="record-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="raw-input" className="block text-sm font-medium text-gray-700 mb-2">
                今日の記録
              </label>
              <textarea
                id="raw-input"
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                placeholder={`例:\n睡眠: 7時間\n体温: 36.5℃\n体重: 70.2kg\n朝食: トースト、コーヒー\n昼食: パスタ\n夕食: サラダ、鶏肉\n運動: ジョギング30分`}
                rows={6}
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
            <div
              className={`mt-4 p-3 rounded-md ${
                message.includes('失敗') || message.includes('エラー')
                  ? 'bg-red-50 text-red-700'
                  : 'bg-green-50 text-green-700'
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            カード表示
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'table'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            表形式
          </button>
          <button
            onClick={() => setViewMode('chart')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'chart'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            グラフ
          </button>
        </div>

        {/* Records Display */}
        {fetchLoading ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-500 text-center">読み込み中...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-500 text-center">まだ記録がありません</p>
          </div>
        ) : (
          <>
            {/* Card List View */}
            {viewMode === 'list' && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-gray-800">
                  過去の記録 ({records.length}件)
                </h2>
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="bg-white rounded-lg shadow-md p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-bold text-gray-700">
                        {formatDate(record.date)}
                      </h3>
                    </div>
                    <p className="text-gray-600 whitespace-pre-wrap text-sm">
                      {record.rawInput}
                    </p>
                    {(record.weight !== null ||
                      record.bodyTemp !== null ||
                      record.sleepHours !== null) && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {record.weight !== null && (
                          <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                            体重: {record.weight}kg
                          </span>
                        )}
                        {record.bodyTemp !== null && (
                          <span className="inline-block bg-red-50 text-red-700 text-xs px-2 py-1 rounded">
                            体温: {record.bodyTemp}℃
                          </span>
                        )}
                        {record.sleepHours !== null && (
                          <span className="inline-block bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded">
                            睡眠: {record.sleepHours}時間
                          </span>
                        )}
                        {record.waterIntake !== null && (
                          <span className="inline-block bg-cyan-50 text-cyan-700 text-xs px-2 py-1 rounded">
                            水分: {record.waterIntake}L
                          </span>
                        )}
                        {record.steps !== null && (
                          <span className="inline-block bg-green-50 text-green-700 text-xs px-2 py-1 rounded">
                            歩数: {record.steps}歩
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
              <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  記録一覧 ({records.length}件)
                </h2>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-2 px-2 text-gray-700 whitespace-nowrap">日付</th>
                      <th className="text-right py-2 px-2 text-gray-700 whitespace-nowrap">体重(kg)</th>
                      <th className="text-right py-2 px-2 text-gray-700 whitespace-nowrap">体温(℃)</th>
                      <th className="text-right py-2 px-2 text-gray-700 whitespace-nowrap">睡眠(h)</th>
                      <th className="text-right py-2 px-2 text-gray-700 whitespace-nowrap">水分(L)</th>
                      <th className="text-right py-2 px-2 text-gray-700 whitespace-nowrap">歩数</th>
                      <th className="text-left py-2 px-2 text-gray-700">内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr
                        key={record.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-2 px-2 whitespace-nowrap text-gray-700">
                          {formatDate(record.date)}
                        </td>
                        <td className="py-2 px-2 text-right text-gray-600">
                          {record.weight ?? '-'}
                        </td>
                        <td className="py-2 px-2 text-right text-gray-600">
                          {record.bodyTemp ?? '-'}
                        </td>
                        <td className="py-2 px-2 text-right text-gray-600">
                          {record.sleepHours ?? '-'}
                        </td>
                        <td className="py-2 px-2 text-right text-gray-600">
                          {record.waterIntake ?? '-'}
                        </td>
                        <td className="py-2 px-2 text-right text-gray-600">
                          {record.steps ?? '-'}
                        </td>
                        <td className="py-2 px-2 text-gray-600 max-w-xs truncate">
                          {record.rawInput}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Chart View */}
            {viewMode === 'chart' && (
              <div className="space-y-4">
                {!hasNumericData ? (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">
                      グラフ
                    </h2>
                    <p className="text-gray-500 text-center">
                      数値データがまだありません。体重・睡眠時間・体温などのデータが記録されるとグラフに表示されます。
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Weight & Body Temp Chart */}
                    {chartData.some((d) => d.weight !== null || d.bodyTemp !== null) && (
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">
                          体重 / 体温
                        </h2>
                        <div className="w-full h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis
                                dataKey="date"
                                tick={{ fontSize: 11 }}
                                angle={-45}
                                textAnchor="end"
                                height={50}
                              />
                              <YAxis
                                yAxisId="left"
                                label={{ value: '体重(kg)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
                                domain={['dataMin - 1', 'dataMax + 1']}
                              />
                              <YAxis
                                yAxisId="right"
                                orientation="right"
                                label={{ value: '体温(℃)', angle: 90, position: 'insideRight', style: { fontSize: 11 } }}
                                domain={[35, 38]}
                              />
                              <Tooltip
                                formatter={(value: number | undefined, name: string | undefined) => {
                                  if (value === undefined || value === null || !name) return ['', '']
                                  if (name === 'weight') return [`${value} kg`, '体重']
                                  if (name === 'bodyTemp') return [`${value} ℃`, '体温']
                                  return [value, name]
                                }}
                              />
                              <Legend
                                formatter={(value) => {
                                  if (value === 'weight') return '体重 (kg)'
                                  if (value === 'bodyTemp') return '体温 (℃)'
                                  return value
                                }}
                              />
                              <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="weight"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                connectNulls
                              />
                              <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="bodyTemp"
                                stroke="#ef4444"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                connectNulls
                              />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    {/* Sleep & Water Chart */}
                    {chartData.some((d) => d.sleepHours !== null || d.waterIntake !== null) && (
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">
                          睡眠 / 水分摂取
                        </h2>
                        <div className="w-full h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis
                                dataKey="date"
                                tick={{ fontSize: 11 }}
                                angle={-45}
                                textAnchor="end"
                                height={50}
                              />
                              <YAxis
                                yAxisId="left"
                                label={{ value: '睡眠(h)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
                              />
                              <YAxis
                                yAxisId="right"
                                orientation="right"
                                label={{ value: '水分(L)', angle: 90, position: 'insideRight', style: { fontSize: 11 } }}
                              />
                              <Tooltip
                                formatter={(value: number | undefined, name: string | undefined) => {
                                  if (value === undefined || value === null || !name) return ['', '']
                                  if (name === 'sleepHours') return [`${value} 時間`, '睡眠']
                                  if (name === 'waterIntake') return [`${value} L`, '水分']
                                  return [value, name]
                                }}
                              />
                              <Legend
                                formatter={(value) => {
                                  if (value === 'sleepHours') return '睡眠 (時間)'
                                  if (value === 'waterIntake') return '水分 (L)'
                                  return value
                                }}
                              />
                              <Bar
                                yAxisId="left"
                                dataKey="sleepHours"
                                fill="#8b5cf6"
                                opacity={0.7}
                              />
                              <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="waterIntake"
                                stroke="#06b6d4"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                connectNulls
                              />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    {/* Steps Chart */}
                    {chartData.some((d) => d.steps !== null) && (
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">
                          歩数
                        </h2>
                        <div className="w-full h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis
                                dataKey="date"
                                tick={{ fontSize: 11 }}
                                angle={-45}
                                textAnchor="end"
                                height={50}
                              />
                              <YAxis
                                label={{ value: '歩数', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
                              />
                              <Tooltip
                                formatter={(value: number | undefined, name: string | undefined) => {
                                  if (value === undefined || value === null || !name) return ['', '']
                                  if (name === 'steps') return [`${value} 歩`, '歩数']
                                  return [value, name]
                                }}
                              />
                              <Legend
                                formatter={(value) => {
                                  if (value === 'steps') return '歩数'
                                  return value
                                }}
                              />
                              <Bar
                                dataKey="steps"
                                fill="#10b981"
                                opacity={0.7}
                              />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
