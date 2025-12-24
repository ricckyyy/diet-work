import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const today = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    
    const baseWeight = 65
    const variation = (Math.random() - 0.5) * 4
    const weight = Math.round((baseWeight + variation) * 10) / 10
    
    await prisma.weight.upsert({
      where: { date },
      update: { value: weight },
      create: { date, value: weight }
    })
    
    if (Math.random() > 0.3) {
      const minutes = Math.floor(Math.random() * 90) + 30
      await prisma.sideJobLog.upsert({
        where: { date },
        update: { minutes },
        create: { date, minutes }
      })
    }
  }
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); process.exit(1) })
