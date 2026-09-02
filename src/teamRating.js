export const ARENA_RATING_LIMIT = 20

export const creaturePower = cr => Math.pow(2, Number(cr) / 2)

export const teamPower = creatures => creatures.reduce(
  (sum, creature) => sum + creaturePower(creature.cr),
  0,
)

export const teamRating = creatures => {
  const power = teamPower(creatures)
  return power === 0 ? 0 : 2 * Math.log2(power)
}

export const fitsArenaRating = (creatures, creature, limit = ARENA_RATING_LIMIT) => (
  teamRating([...creatures, creature]) <= limit
)

export const formatTeamRating = rating => rating.toFixed(1)
