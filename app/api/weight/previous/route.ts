import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // 最新の日付を取得
    const latest = await prisma.weight.findFirst({
      orderBy: { date: 'desc' },
    })

    if (!latest) {
      return NextResponse.json(
        { error: 'No weight data found' },
        { status: 404 }
      )
    }

    // 最新の日付より前のデータを取得
    const previousWeight = await prisma.weight.findFirst({
      where: {
        date: { lt: latest.date },
      },
      orderBy: { date: 'desc' },
    })

    if (!previousWeight) {
      return NextResponse.json(
        { error: 'No previous weight data found' },
        { status: 404 }
      )
    }

    return NextResponse.json(previousWeight)
  } catch (error) {
    console.error('Error fetching previous weight:', error)
    return NextResponse.json(
      { error: 'Failed to fetch previous weight' },
      { status: 500 }
    )
  }
}
