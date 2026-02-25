'use client'

import { useEffect, useState } from 'react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  ComposedChart,
  Line,
} from 'recharts'

interface WeightData {
  id: number
  date: string
  value: number
}

interface SideJobData {
  id: number
  date: string
  minutes: number
  memo?: string | null
}

interface ChartDataPoint {
  date: string
  weight: number | null
  minutes: number | null
}

export default function WeightAndSideJobChart() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // 体重データと副業データを並行して取得
      const [weightRes, sideJobRes] = await Promise.all([
        fetch('/api/weight/history?limit=30'),
        fetch('/api/sidejob/list?limit=30')
      ])

      if (!weightRes.ok || !sideJobRes.ok) {
        console.error('Failed to fetch data')
        return
      }

      const weights: WeightData[] = await weightRes.json()
      const sideJobs: SideJobData[] = await sideJobRes.json()

      // 日付をキーにしてデータを統合
      const dataMap = new Map<string, ChartDataPoint>()

      // 体重データを追加
      weights.forEach(w => {
        const date = new Date(w.date)
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}`
        dataMap.set(w.date, {
          date: dateStr,
          weight: w.value,
          minutes: null
        })
      })

      // 副業データを追加
      sideJobs.forEach(s => {
        const existing = dataMap.get(s.date)
        const date = new Date(s.date)
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}`
        
        if (existing) {
          existing.minutes = s.minutes
        } else {
          dataMap.set(s.date, {
            date: dateStr,
            weight: null,
            minutes: s.minutes
          })
        }
      })

      // 日付順にソート
      const sortedData = Array.from(dataMap.entries())
        .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
        .map(([, data]) => data)

      setChartData(sortedData)
    } catch (error) {
      console.error('Error fetching chart data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !mounted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📈 推移グラフ</h2>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📈 推移グラフ</h2>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">データがありません</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">📈 推移グラフ</h2>
      
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              yAxisId="left"
              label={{ value: '体重 (kg)', angle: -90, position: 'insideLeft' }}
              domain={['dataMin - 1', 'dataMax + 1']}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              label={{ value: '活動時間 (分)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip 
              formatter={(value: number | undefined, name: string | undefined) => {
                if (value === undefined || value === null || !name) return ['', '']
                if (name === 'weight') return [`${value} kg`, '体重']
                if (name === 'minutes') return [`${value} 分`, '活動時間']
                return [value, name]
              }}
            />
            <Legend 
              formatter={(value) => {
                if (value === 'weight') return '体重 (kg)'
                if (value === 'minutes') return '活動時間 (分)'
                return value
              }}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="weight" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ r: 4 }}
              connectNulls
            />
            <Bar 
              yAxisId="right"
              dataKey="minutes" 
              fill="#10b981"
              opacity={0.6}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>💡 青い線が体重、緑の棒グラフが活動時間を表しています</p>
      </div>
    </div>
  )
}
