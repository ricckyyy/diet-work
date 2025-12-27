import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const latestWeight = await prisma.weight.findFirst({
      where: { userId: session.user.id },
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
