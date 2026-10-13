import { useState, type CSSProperties } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, addEntry, saveToLibrary } from '../db'
import { LABEL, type Group } from '../types'

const SUG: Record<Group, string[]> = {
  up: ['Press de banca', 'Dominadas', 'Remo con barra', 'Press militar', 'Fondos', 'Curl de bíceps', 'Extensión de tríceps'],
  low: ['Sentadilla', 'Peso muerto rumano', 'Prensa', 'Zancadas', 'Hip thrust', 'Elevación de talones', 'Curl femoral'],
}

export function AddForm({ date }: { date: string }) {
  const [g, setG] = useState<Group>('up')
  const [name, setName] = useState('')
  const [sets, setSets] = useState(3)
  const [reps, setReps] = useState(10)
  const [kg, setKg] = useState('')
  const [keep, setKeep] = useState(true)
  const [edit, setEdit] = useState(false)

  const lib = useLiveQuery(() => db.library.where('g').equals(g).sortBy('name'), [g]) ?? []
  const names = [...new Set([...lib.map(i => i.name), ...SUG[g]])]

  // Autocompleta series, reps y peso si el nombre ya está en la biblioteca
  const onName = (v: string) => {
    setName(v)
    const f = lib.find(i => i.name.toLowerCase() === v.trim().toLowerCase())
    if (f) {
      setSets(f.sets)
      setReps(f.reps)
      setKg(f.kg == null ? '' : String(f.kg))
    }
  }

  const submit = async () => {
    const n = name.trim()
    if (!n || sets < 1 || reps < 1) return
    const k = kg === '' ? null : Number(kg)
    await addEntry({ date, g, name: n, sets, reps, kg: k })
    if (keep) await saveToLibrary({ g, name: n, sets, reps, kg: k })
    setName('')
  }

  return (
    <>
      <div className="card">
        <h2 style={{ marginBottom: 10 }}>Agregar ejercicio</h2>
        <div className="seg">
          {(['up', 'low'] as Group[]).map(x => (
            <label key={x}>
              <input type="radio" name="g" value={x} checked={g === x} onChange={() => setG(x)} />
              <span>{LABEL[x]}</span>
            </label>
          ))}
        </div>
        <div className="f">
          <label htmlFor="name">Ejercicio</label>
          <input type="text" id="name" list="sug" autoComplete="off" placeholder="Ej. Press de banca"
            value={name} onChange={e => onName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()} />
        </div>
        <datalist id="sug">{names.map(n => <option key={n} value={n} />)}</datalist>
        <div className="grid">
          <div className="f"><label htmlFor="sets">Series (meta)</label>
            <input type="number" id="sets" min={1} inputMode="numeric" value={sets} onChange={e => setSets(+e.target.value)} /></div>
          <div className="f"><label htmlFor="reps">Repeticiones</label>
            <input type="number" id="reps" min={1} inputMode="numeric" value={reps} onChange={e => setReps(+e.target.value)} /></div>
          <div className="f"><label htmlFor="kg">Peso (kg)</label>
            <input type="number" id="kg" min={0} step={0.5} inputMode="decimal" placeholder="Opcional" value={kg} onChange={e => setKg(e.target.value)} /></div>
        </div>
        <label className="keep">
          <input type="checkbox" checked={keep} onChange={e => setKeep(e.target.checked)} /> Guardar en mi biblioteca
        </label>
        <button className="go" onClick={submit}>Agregar ejercicio</button>
      </div>

      <div className="card">
        <div className="libh">
          <h2>Mi biblioteca · {LABEL[g]}</h2>
          {lib.length > 0 && <button className="btn" onClick={() => setEdit(!edit)}>{edit ? 'Listo' : 'Editar'}</button>}
        </div>
        {lib.length === 0 ? (
          <div className="empty">Aún no tienes ejercicios guardados. Los que agregues arriba se guardan aquí y los registras con un toque.</div>
        ) : (
          <div className="libchips" style={{ '--c': g === 'up' ? 'var(--up)' : 'var(--low)' } as CSSProperties}>
            {lib.map(i => edit ? (
              <button key={i.key} className="lib-b" aria-label={`Eliminar ${i.name}`} onClick={() => db.library.delete(i.key)}>
                ✕ {i.name}
              </button>
            ) : (
              <button key={i.key} className="lib-b"
                onClick={() => addEntry({ date, g: i.g, name: i.name, sets: i.sets, reps: i.reps, kg: i.kg })}>
                <b>{i.name}</b><small>{i.sets} × {i.reps}{i.kg ? ` · ${i.kg} kg` : ''}</small>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
