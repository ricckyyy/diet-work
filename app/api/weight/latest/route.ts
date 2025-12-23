import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const latestWeight = await prisma.weight.findFirst({
      orderBy: { date: 'desc' },
    })

    if (!latestWeight) {
      return NextResponse.json(
        { error: 'No weight data found' },
        { status: 404 }
      )
    }

    return NextResponse.json(latestWeight)
  } catch (error) {
    console.error('Error fetching latest weight:', error)
    return NextResponse.json(
      { error: 'Failed to fetch latest weight' },
      { status: 500 }
    )
  }
}
