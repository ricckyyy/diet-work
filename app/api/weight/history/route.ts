import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '30')

    const weights = await prisma.weight.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'asc' },
      take: limit,
    })

    return NextResponse.json(weights)
  } catch (error) {
    console.error('Error fetching weight history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weight history' },
      { status: 500 }
    )
  }
}
