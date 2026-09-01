export const SELECTORS = [
  ['nearest', 'Select the closest visible, living enemy.'],
  ['weakest', 'Select the visible enemy with the lowest challenge rating. Distance breaks ties.'],
  ['strongest', 'Select the visible enemy with the highest challenge rating. Distance breaks ties.'],
  ['execute', 'Select the visible enemy with the lowest current hit-point percentage. Distance breaks ties.'],
  ['attacker', 'Select the enemy that most recently attacked this unit. Falls back to nearest when unavailable.'],
  ['caster', 'Select the nearest enemy with usable spells or innate spell abilities. Falls back to nearest.'],
]

export const BEHAVIORS = [
  ['default', 'Use an offensive spell when available; otherwise perform a normal attack.'],
  ['melee', 'Close with and physically attack the selected target.'],
  ['ranged', 'Use spells or a ranged weapon while trying to remain 8–15 metres away.'],
  ['hold', 'Stay within 10 metres of the spawn position. Terminal: waits when no target is inside.'],
  ['guard', 'Stay near the most injured ally and attack that ally’s most recent attacker.'],
  ['preserve', 'Try self-healing, protection, and defensive modes, then continue if no action was spent.'],
  ['support', 'Try healing, recovery, protection, and enhancement on the most injured ally.'],
]

export const PRESETS = [
  ['finisher', 'execute', ['melee']], ['boss hunter', 'strongest', ['melee']],
  ['mage hunter', 'caster', ['melee']], ['skirmisher', 'nearest', ['ranged', 'preserve']],
  ['artillery', 'strongest', ['ranged']], ['bodyguard', 'attacker', ['guard']],
  ['defender', 'nearest', ['hold']], ['combat medic', 'nearest', ['support', 'default']],
  ['survivalist', 'nearest', ['preserve', 'default']], ['opportunist', 'execute', ['ranged', 'preserve']],
]

const selectorNames = new Set(SELECTORS.map(([name]) => name))
const behaviorNames = new Set(BEHAVIORS.map(([name]) => name))

export function normalizeTactics(tactics = {}) {
  const selector = selectorNames.has(tactics.selector) ? tactics.selector : ''
  const behaviors = [...new Set(Array.isArray(tactics.behaviors) ? tactics.behaviors : [])]
    .filter(name => behaviorNames.has(name)).slice(0, selector ? 2 : 3)
  return { selector, behaviors }
}

export function unitToken(resref, tactics) {
  const { selector, behaviors } = normalizeTactics(tactics)
  if ((!selector && !behaviors.length) || (selector === 'nearest' && behaviors.length === 1 && behaviors[0] === 'default')) return resref
  return `${resref}:${[selector, ...behaviors].filter(Boolean).join('+')}`
}

export const teamCommand = team => team.map(unit => unitToken(unit.resref, unit.tactics)).join(' ')
