import Dexie, { type Table } from 'dexie'
import type { Entry, Group, LibItem } from './types'

class EntrenoDB extends Dexie {
  entries!: Table<Entry, number>
  library!: Table<LibItem, string>

  constructor() {
    super('entreno')
    this.version(1).stores({
      entries: '++id, date, [date+g], name',
      library: 'key, g',
    })
  }
}

export const db = new EntrenoDB()

export const libKey = (g: Group, name: string) => `${g}|${name.trim().toLowerCase()}`

export const addEntry = (e: Omit<Entry, 'id' | 'done'>) => db.entries.add({ ...e, done: 0 })

export const setDone = (id: number, done: number) => db.entries.update(id, { done })

export const saveToLibrary = (i: Omit<LibItem, 'key'>) =>
  db.library.put({ ...i, key: libKey(i.g, i.name) })
