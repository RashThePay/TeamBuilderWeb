export const ARENA_RATING_LIMIT = 20

export const creaturePower = cr =>
  Math.pow(2, Number(cr) / 2)

export const teamPower = creatures =>
  creatures.reduce(
    (sum, creature) => sum + creaturePower(creature.cr),
    0,
  )

export const effectiveTeamSize = creatures => {
  if (!creatures.length) return 0

  const powers = creatures.map(creature =>
    creaturePower(creature.cr)
  )

  const total = powers.reduce((sum, power) => sum + power, 0)
  const strongest = Math.max(...powers)

  return total / strongest
}

export const teamRating = creatures => {
  const power = teamPower(creatures)

  if (power === 0) return 0

  const effectiveSize = effectiveTeamSize(creatures)

  const adjustedPower =
    power * Math.sqrt(effectiveSize)

  return 2 * Math.log2(adjustedPower)
}

export const fitsArenaRating = (
  creatures,
  creature,
  limit = ARENA_RATING_LIMIT,
) => (
  teamRating([...creatures, creature]) <= limit
)

export const formatTeamRating = rating =>
  rating.toFixed(1)