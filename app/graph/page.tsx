'use client'

import { useState } from 'react'
import Link from 'next/link'
import WeightAndSideJobChart from '../components/WeightAndSideJobChart'

type Range = 30 | 60 | 90

export default function GraphPage() {
  const [limit, setLimit] = useState<Range>(30)

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-lg mx-auto px-3 pt-4 pb-6 space-y-3">

        <div className="flex items-center justify-between">
          <h1 className="text-base font-bold text-gray-800">推移グラフ</h1>
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-700">
            ← ホーム
          </Link>
        </div>

        <div className="flex gap-2">
          {([30, 60, 90] as Range[]).map((days) => (
            <button
              key={days}
              onClick={() => setLimit(days)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                limit === days
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {days}日
            </button>
          ))}
        </div>

        <WeightAndSideJobChart height={400} limit={limit} />

      </div>
    </div>
  )
}
