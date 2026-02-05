export type HealthRecord = {
  id: string
  userId: string
  date: Date
  weight?: number
  bodyTemp?: number
  sleepHours?: number
  waterIntake?: number
  steps?: number
  meals?: string
  activities?: string
  notes?: string
  rawInput: string
  createdAt: Date
  updatedAt: Date
}

export type CreateHealthRecordInput = {
  date: string
  rawInput: string
  weight?: number
  bodyTemp?: number
  sleepHours?: number
  waterIntake?: number
  steps?: number
  meals?: string
  activities?: string
  notes?: string
}
