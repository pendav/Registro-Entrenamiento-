import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { iso, parse, shift } from '../date'

const DOW = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']

export function DayStrip({ sel, onSelect }: { sel: string; onSelect: (d: string) => void }) {
  const today = iso(new Date())
  const days = Array.from({ length: 7 }, (_, i) => shift(today, i - 6))
  const entries = useLiveQuery(() => db.entries.where('date').anyOf(days).toArray(), [today]) ?? []

  return (
    <div className="week">
      {days.map(s => {
        const has = (g: string) => entries.some(e => e.date === s && e.g === g)
        return (
          <button key={s} className="day" aria-pressed={s === sel} onClick={() => onSelect(s)}>
            <small>{DOW[parse(s).getDay()]}</small>
            <b>{parse(s).getDate()}</b>
            <div className="dots">
              {has('up') && <i className="d-up" />}
              {has('low') && <i className="d-low" />}
            </div>
          </button>
        )
      })}
    </div>
  )
}
