import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const logs = await prisma.sideJobLog.findMany({
      orderBy: { date: 'desc' },
      take: limit,
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Error fetching side job logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch side job logs' },
      { status: 500 }
    )
  }
}
