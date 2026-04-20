const STAT_KEYS = [
  { label: 'M',  aliases: ['m', 'move', 'movement'] },
  { label: 'T',  aliases: ['t', 'toughness'] },
  { label: 'SV', aliases: ['sv', 'save', 'armour save'] },
  { label: 'W',  aliases: ['w', 'wounds'] },
  { label: 'LD', aliases: ['ld', 'leadership', 'bravery'] },
  { label: 'OC', aliases: ['oc', 'objective control'] },
]

const WEAPON_COLS = [
  { label: 'RANGE', aliases: ['range'] },
  { label: 'A',     aliases: ['a', 'attacks'] },
  { label: 'BS/WS', aliases: ['bs', 'ws', 'skill', 'bs/ws'] },
  { label: 'S',     aliases: ['s', 'strength'] },
  { label: 'AP',    aliases: ['ap'] },
  { label: 'D',     aliases: ['d', 'damage'] },
]

function findStatValue(rawStats, aliases) {
  const lower = Object.fromEntries(
    Object.entries(rawStats || {}).map(([k, v]) => [k.toLowerCase().trim(), v])
  )
  for (const alias of aliases) {
    if (lower[alias] !== undefined) return lower[alias] || '—'
  }
  return '—'
}

function normalizeWeapons(weapons) {
  const ranged = []
  const melee = []

  for (const wpn of weapons || []) {
    const typeLower = (wpn.type || '').toLowerCase()
    const isRanged = typeLower.includes('ranged') || typeLower.includes('ballistic')
    const isMelee = typeLower.includes('melee') || typeLower.includes('weapon skill')

    const cols = {}
    for (const col of WEAPON_COLS) {
      const rawVal = findStatValue(wpn.stats, col.aliases)
      // Rename BS/WS based on weapon type
      const key = col.label === 'BS/WS'
        ? (isMelee ? 'WS' : 'BS')
        : col.label
      cols[key] = rawVal
    }

    // Collect any keywords from the stats
    const keywordsRaw = Object.entries(wpn.stats || {}).find(
      ([k]) => k.toLowerCase() === 'keywords'
    )
    const keywords = keywordsRaw ? keywordsRaw[1] : ''

    const normalized = { name: wpn.name || '—', ...cols, keywords }

    if (isMelee) melee.push(normalized)
    else ranged.push(normalized)
  }

  return { ranged, melee }
}

function normalizeAbilities(abilities) {
  return (abilities || []).map(ab => {
    // BSData abilities often pack description as "Description: <text>"
    let desc = ab.description || '—'
    desc = desc.replace(/^Description:\s*/i, '')
    return { name: (ab.name || '—').toUpperCase(), description: desc }
  })
}

export function parseUnit(raw) {
  if (!raw) return null

  const stats = {}
  for (const s of STAT_KEYS) {
    stats[s.label] = findStatValue(raw.stats, s.aliases)
  }

  const { ranged, melee } = normalizeWeapons(raw.weapons)
  const abilities = normalizeAbilities(raw.abilities)

  const factionKeywords = (raw.factionKeywords || []).map(k => k.toUpperCase())
  const keywords = (raw.keywords || []).map(k => k.toUpperCase())

  const primaryFaction = factionKeywords[0] || '—'

  return {
    name: raw.name || '—',
    faction: primaryFaction,
    factionKeywords,
    keywords,
    stats,
    weapons: { ranged, melee },
    abilities,
  }
}
