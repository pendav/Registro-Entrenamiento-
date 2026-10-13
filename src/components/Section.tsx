import type { CSSProperties } from 'react'
import { db, setDone } from '../db'
import { LABEL, type Entry, type Group } from '../types'

export function Section({ g, list }: { g: Group; list: Entry[] }) {
  const c = g === 'up' ? 'var(--up)' : 'var(--low)'

  return (
    <div className="card sec">
      <h2><span style={{ background: c }} />{LABEL[g]}</h2>
      {list.length === 0 && (
        <div className="empty">Aún no hay ejercicios de {LABEL[g].toLowerCase()} este día.</div>
      )}
      {list.map(e => (
        <div className="row" key={e.id}>
          <div style={{ flex: 1 }}>
            <div className="n">{e.name}</div>
            <div className="d">{e.done} de {e.sets} series · {e.reps} reps{e.kg ? ` · ${e.kg} kg` : ''}</div>
            <div className="chips" style={{ '--c': c } as CSSProperties}>
              {Array.from({ length: e.sets }, (_, i) => (
                <button key={i} className="chip" aria-pressed={i < e.done} aria-label={`Serie ${i + 1}`}
                  onClick={() => setDone(e.id!, i < e.done ? i : i + 1)}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
          <button className="x" aria-label={`Quitar ${e.name}`} onClick={() => db.entries.delete(e.id!)}>
            Quitar
          </button>
        </div>
      ))}
    </div>
  )
}
