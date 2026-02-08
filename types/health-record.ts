export type HealthRecord = {
  id: string
  userId: string
  date: Date
  weight: number | null
  bodyTemp: number | null
  sleepHours: number | null
  waterIntake: number | null
  steps: number | null
  meals: string | null
  activities: string | null
  notes: string | null
  rawInput: string
  createdAt: Date
  updatedAt: Date
}

// API response type (dates are serialized as strings)
export type HealthRecordResponse = {
  id: string
  userId: string
  date: string
  weight: number | null
  bodyTemp: number | null
  sleepHours: number | null
  waterIntake: number | null
  steps: number | null
  meals: string | null
  activities: string | null
  notes: string | null
  rawInput: string
  createdAt: string
  updatedAt: string
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
