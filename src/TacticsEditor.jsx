import { useState } from 'react'
import { BEHAVIORS, PRESETS, SELECTORS, normalizeTactics, unitToken } from './tactics'

const titleCase = value => value.replace(/\b\w/g, letter => letter.toUpperCase())

export default function TacticsEditor({ unit, onSave, onClose }) {
  const [draft, setDraft] = useState(() => normalizeTactics(unit.tactics))
  const used = draft.behaviors.length + (draft.selector ? 1 : 0)
  const addBehavior = behavior => {
    if (!behavior || used >= 3 || draft.behaviors.includes(behavior)) return
    setDraft(current => normalizeTactics({ ...current, behaviors: [...current.behaviors, behavior] }))
  }
  const moveBehavior = (index, direction) => setDraft(current => {
    const next = [...current.behaviors], destination = index + direction
    if (destination < 0 || destination >= next.length) return current
    ;[next[index], next[destination]] = [next[destination], next[index]]
    return { ...current, behaviors: next }
  })
  const selectedDescription = SELECTORS.find(([name]) => name === draft.selector)?.[1]

  return <div className="overlay tactics-overlay" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <section className="tactics-dialog" role="dialog" aria-modal="true" aria-labelledby="tactics-title">
      <header><div><small>Tactical AI</small><h2 id="tactics-title">{unit.name}</h2></div><button className="tactics-close" onClick={onClose} aria-label="Close tactics editor">×</button></header>
      <div className="tactics-scroll">
        <div className="token-preview"><span>Live NWN token</span><code>{unitToken(unit.resref, draft)}</code></div>
        <p className="pipeline-note"><strong>Order matters.</strong> Behaviors run left to right; the first one able to act controls the round.</p>
        <section className="tactics-block"><div className="tactics-label"><span>Quick presets</span><small>Optional · fully editable</small></div><div className="preset-strip">{PRESETS.map(([name, selector, behaviors]) => <button key={name} onClick={() => setDraft({ selector, behaviors })}>{titleCase(name)}</button>)}</div></section>
        <section className="tactics-block"><div className="tactics-label"><span>Target selector</span><small>{used}/3 components</small></div><select value={draft.selector} onChange={event => setDraft(current => normalizeTactics({ ...current, selector: event.target.value }))} disabled={!draft.selector && used >= 3} aria-label="Target selector"><option value="">automatic (nearest)</option>{SELECTORS.map(([name, description]) => <option key={name} value={name} title={description}>{name}</option>)}</select>{selectedDescription && <p className="choice-help">{selectedDescription}</p>}</section>
        <section className="tactics-block"><div className="tactics-label"><span>Behavior order</span><small>First available wins</small></div><div className="behavior-stack">{draft.behaviors.map((behavior, index) => {
          const description = BEHAVIORS.find(([name]) => name === behavior)?.[1]
          return <div className={`behavior-item ${behavior === 'hold' ? 'terminal' : ''}`} key={behavior} title={description}><span className="behavior-rank">{index + 1}</span><span><strong>{behavior}</strong><small>{description}</small>{behavior === 'hold' && <em>Stops the pipeline</em>}</span><div><button onClick={() => moveBehavior(index, -1)} disabled={index === 0} aria-label={`Move ${behavior} earlier`}>↑</button><button onClick={() => moveBehavior(index, 1)} disabled={index === draft.behaviors.length - 1} aria-label={`Move ${behavior} later`}>↓</button><button onClick={() => setDraft(current => ({ ...current, behaviors: current.behaviors.filter((_, i) => i !== index) }))} aria-label={`Remove ${behavior}`}>×</button></div></div>
        })}</div><select value="" onChange={event => addBehavior(event.target.value)} disabled={used >= 3} aria-label="Add behavior"><option value="">{used >= 3 ? '3-component limit reached' : '+ add behavior'}</option>{BEHAVIORS.map(([name, description]) => <option key={name} value={name} disabled={draft.behaviors.includes(name)} title={description}>{name}</option>)}</select></section>
      </div>
      <footer><button className="remove-tactics" onClick={() => setDraft({ selector: '', behaviors: [] })} disabled={!used}>Remove tactics</button><button className="save-tactics" onClick={() => onSave(draft)}>Save tactics</button></footer>
    </section>
  </div>
}
