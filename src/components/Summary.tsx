import type { Entry, Group } from '../types'

export function Summary({ day }: { day: Entry[] }) {
  const t = (g: Group) => {
    const l = day.filter(e => e.g === g)
    return {
      s: l.reduce((a, e) => a + e.sets, 0),
      d: l.reduce((a, e) => a + e.done, 0),
      r: l.reduce((a, e) => a + e.done * e.reps, 0),
    }
  }
  const U = t('up')
  const L = t('low')
  const td = U.d + L.d
  const tt = U.s + L.s

  return (
    <div className="sum">
      <div className="all">
        <b>{td} / {tt}</b>series completadas hoy
        <div className="prog" role="progressbar" aria-valuemin={0} aria-valuemax={tt} aria-valuenow={td}>
          <i style={{ width: `${tt ? Math.round((td / tt) * 100) : 0}%` }} />
        </div>
      </div>
      <div className="u"><b>{U.d} / {U.s}</b>series de tren superior · {U.r} reps</div>
      <div className="l"><b>{L.d} / {L.s}</b>series de tren inferior · {L.r} reps</div>
    </div>
  )
}
