import { useState } from 'react'

const BS_BASE = 'https://raw.githubusercontent.com/BSData/wh40k-10e/main/'
const FALLBACK_URL = BS_BASE + 'Imperium%20-%20Space%20Marines.cat'

const CATALOGUE_MAP = [
  { keywords: ['space marine', 'astartes', 'intercessor', 'primaris', 'ultramar', 'space marines'],
    file: 'Imperium%20-%20Space%20Marines.cat' },
  { keywords: ['black templar'],
    file: 'Imperium%20-%20Black%20Templars.cat' },
  { keywords: ['blood angel'],
    file: 'Imperium%20-%20Blood%20Angels.cat' },
  { keywords: ['dark angel'],
    file: 'Imperium%20-%20Dark%20Angels.cat' },
  { keywords: ['grey knight'],
    file: 'Imperium%20-%20Grey%20Knights.cat' },
  { keywords: ['space wolf'],
    file: 'Imperium%20-%20Space%20Wolves.cat' },
  { keywords: ['ultramarine'],
    file: 'Imperium%20-%20Ultramarines.cat' },
  { keywords: ['deathwatch'],
    file: 'Imperium%20-%20Deathwatch.cat' },
  { keywords: ['imperial fist'],
    file: 'Imperium%20-%20Imperial%20Fists.cat' },
  { keywords: ['iron hand'],
    file: 'Imperium%20-%20Iron%20Hands.cat' },
  { keywords: ['raven guard'],
    file: 'Imperium%20-%20Raven%20Guard.cat' },
  { keywords: ['salamander'],
    file: 'Imperium%20-%20Salamanders.cat' },
  { keywords: ['white scar'],
    file: 'Imperium%20-%20White%20Scars.cat' },
  { keywords: ['imperial guard', 'astra militarum', 'guardsman'],
    file: 'Imperium%20-%20Astra%20Militarum.cat' },
  { keywords: ['adepta sororitas', 'sisters of battle', 'sororitas'],
    file: 'Imperium%20-%20Adepta%20Sororitas.cat' },
  { keywords: ['adeptus custodes', 'custodes', 'custodian'],
    file: 'Imperium%20-%20Adeptus%20Custodes.cat' },
  { keywords: ['adeptus mechanicus', 'mechanicus', 'skitarii'],
    file: 'Imperium%20-%20Adeptus%20Mechanicus.cat' },
  { keywords: ['imperial knight'],
    file: 'Imperium%20-%20Imperial%20Knights.cat' },
  { keywords: ['chaos space marine', 'heretic astartes', 'iron warrior', 'alpha legion', 'word bearer', 'night lord'],
    file: 'Chaos%20-%20Chaos%20Space%20Marines.cat' },
  { keywords: ['death guard', 'nurgle'],
    file: 'Chaos%20-%20Death%20Guard.cat' },
  { keywords: ['thousand son', 'tzeentch sorcerer'],
    file: 'Chaos%20-%20Thousand%20Sons.cat' },
  { keywords: ['world eater', 'khorne berzerker'],
    file: 'Chaos%20-%20World%20Eaters.cat' },
  { keywords: ["emperor's children", 'slaanesh'],
    file: "Chaos%20-%20Emperor%27s%20Children.cat" },
  { keywords: ['chaos daemon', 'daemon'],
    file: 'Chaos%20-%20Chaos%20Daemons.cat' },
  { keywords: ['chaos knight'],
    file: 'Chaos%20-%20Chaos%20Knights.cat' },
  { keywords: ['necron', 'necrontyr', "c'tan"],
    file: 'Necrons.cat' },
  { keywords: ['ork', 'greenskin', 'waaagh'],
    file: 'Orks.cat' },
  { keywords: ['aeldari', 'eldar', 'craftworld', 'aspect warrior'],
    file: 'Aeldari%20-%20Craftworlds.cat' },
  { keywords: ['drukhari', 'dark eldar'],
    file: 'Aeldari%20-%20Drukhari.cat' },
  { keywords: ['tau', "t'au", 'fire warrior'],
    file: "T%27au%20Empire.cat" },
  { keywords: ['tyranid', 'hive mind'],
    file: 'Tyranids.cat' },
  { keywords: ['genestealer cult'],
    file: 'Genestealer%20Cults.cat' },
  { keywords: ['leagues of votann', 'votann', 'kin'],
    file: 'Leagues%20of%20Votann.cat' },
]

function selectCatalogueUrls(faction) {
  const f = (faction || '').toLowerCase()
  for (const entry of CATALOGUE_MAP) {
    if (entry.keywords.some(k => f.includes(k))) {
      const primary = BS_BASE + entry.file
      return primary === FALLBACK_URL ? [primary] : [primary, FALLBACK_URL]
    }
  }
  return [FALLBACK_URL]
}

function normalise(str) {
  return (str || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim()
}

async function fetchXml(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)
  const text = await res.text()
  const stripped = text.replace(/\sxmlns(?::[^=]+)?="[^"]*"/g, '')
  return new DOMParser().parseFromString(stripped, 'application/xml')
}

function extractEntryData(entry) {
  const result = {
    name: entry.getAttribute('name'),
    id: entry.getAttribute('id'),
    stats: {},
    weapons: [],
    abilities: [],
    keywords: [],
    factionKeywords: [],
  }

  Array.from(entry.getElementsByTagName('profile')).forEach(profile => {
    const typeName = profile.getAttribute('typeName') || ''
    const tl = typeName.toLowerCase()

    if (tl === 'unit' || tl === 'model') {
      Array.from(profile.getElementsByTagName('characteristic')).forEach(c => {
        result.stats[c.getAttribute('name')] = c.textContent.trim()
      })
    } else if (tl.includes('weapon') || tl.includes('ranged') || tl.includes('melee')) {
      const wpn = { name: profile.getAttribute('name'), type: typeName, stats: {} }
      Array.from(profile.getElementsByTagName('characteristic')).forEach(c => {
        wpn.stats[c.getAttribute('name')] = c.textContent.trim()
      })
      if (!result.weapons.find(w => w.name === wpn.name)) result.weapons.push(wpn)
    } else if (tl.includes('abilit')) {
      const chars = Array.from(profile.getElementsByTagName('characteristic'))
      result.abilities.push({
        name: profile.getAttribute('name'),
        description: chars.map(c => `${c.getAttribute('name')}: ${c.textContent.trim()}`).join(' | ')
      })
    }
  })

  Array.from(entry.getElementsByTagName('categoryLink')).forEach(cl => {
    const name = cl.getAttribute('name') || ''
    if (name.toLowerCase().startsWith('faction:')) {
      result.factionKeywords.push(name.replace(/^faction:\s*/i, ''))
    } else {
      result.keywords.push(name)
    }
  })

  return result
}

function searchCatalogue(xmlDoc, unitName) {
  const allEntries = Array.from(xmlDoc.getElementsByTagName('selectionEntry'))
  const entries = allEntries.filter(e => {
    const t = e.getAttribute('type')
    return t === 'unit' || t === 'model'
  })

  const target = normalise(unitName)

  let match = entries.find(e => normalise(e.getAttribute('name')) === target)

  if (!match) {
    const words = target.split(' ').filter(w => w.length > 2)
    match = entries.find(e => {
      const n = normalise(e.getAttribute('name'))
      return words.every(w => n.includes(w))
    })
  }

  if (!match) match = entries.find(e => normalise(e.getAttribute('name')).includes(target))
  if (!match) match = entries.find(e => target.includes(normalise(e.getAttribute('name'))))

  if (!match) return null
  return extractEntryData(match)
}

export function useBattlescribe() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  async function lookup(unitName, faction) {
    setLoading(true)
    setStatus('')
    try {
      const urls = selectCatalogueUrls(faction)
      for (const url of urls) {
        const filename = decodeURIComponent(url.split('/').pop())
        setStatus(`Fetching: ${filename}...`)
        try {
          const xml = await fetchXml(url)
          const match = searchCatalogue(xml, unitName)
          if (match) return match
        } catch (e) {
          console.warn('Catalogue fetch failed:', url, e)
        }
      }
      return null
    } finally {
      setLoading(false)
      setStatus('')
    }
  }

  return { lookup, loading, status }
}
