import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { date, minutes, memo } = await request.json()

    if (!date || minutes === undefined) {
      return NextResponse.json(
        { error: 'date and minutes are required' },
        { status: 400 }
      )
    }

    const minutesValue = parseInt(minutes)
    if (isNaN(minutesValue) || minutesValue < 0) {
      return NextResponse.json(
        { error: 'minutes must be a valid positive number' },
        { status: 400 }
      )
    }

    // 日付を00:00:00に正規化
    const normalizedDate = new Date(date)
    normalizedDate.setHours(0, 0, 0, 0)

    // upsert: 存在すれば更新、なければ作成
    const sideJobLog = await prisma.sideJobLog.upsert({
      where: { date: normalizedDate },
      update: { 
        minutes: minutesValue,
        memo: memo || null
      },
      create: { 
        date: normalizedDate, 
        minutes: minutesValue,
        memo: memo || null
      },
    })

    return NextResponse.json(sideJobLog)
  } catch (error) {
    console.error('Error saving side job log:', error)
    return NextResponse.json(
      { error: 'Failed to save side job log' },
      { status: 500 }
    )
  }
}
