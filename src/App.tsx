import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './db'
import { iso, shift } from './date'
import { DayStrip } from './components/DayStrip'
import { AddForm } from './components/AddForm'
import { Summary } from './components/Summary'
import { Section } from './components/Section'

export default function App() {
  const [sel, setSel] = useState(iso(new Date()))
  const day = useLiveQuery(() => db.entries.where('date').equals(sel).toArray(), [sel]) ?? []

  return (
    <main>
      <h1>Mi registro de entrenamiento</h1>
      <div className="bar">
        <div className="nav">
          <button className="btn" aria-label="Día anterior" onClick={() => setSel(shift(sel, -1))}>‹</button>
          <button className="btn" onClick={() => setSel(iso(new Date()))}>Hoy</button>
          <button className="btn" aria-label="Día siguiente" onClick={() => setSel(shift(sel, 1))}>›</button>
        </div>
        <input type="date" aria-label="Fecha" style={{ width: 'auto' }} value={sel}
          onChange={e => e.target.value && setSel(e.target.value)} />
      </div>
      <DayStrip sel={sel} onSelect={setSel} />
      <AddForm date={sel} />
      <Summary day={day} />
      <Section g="up" list={day.filter(e => e.g === 'up')} />
      <Section g="low" list={day.filter(e => e.g === 'low')} />
    </main>
  )
}
