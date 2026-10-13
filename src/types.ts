export type Group = 'up' | 'low'

export interface Entry {
  id?: number
  date: string // YYYY-MM-DD
  g: Group
  name: string
  sets: number // series meta
  done: number // series completadas
  reps: number
  kg: number | null
}

export interface LibItem {
  key: string // `${g}|${nombre en minúsculas}`
  g: Group
  name: string
  sets: number
  reps: number
  kg: number | null
}

export const LABEL: Record<Group, string> = { up: 'Tren superior', low: 'Tren inferior' }
