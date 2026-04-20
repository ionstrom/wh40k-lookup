import { useMemo } from 'react'
import { parseUnit } from '../utils/parseUnit'

const THOUGHTS = [
  'AN OPEN MIND IS LIKE A FORTRESS WITH ITS GATES UNBARRED',
  'SUFFER NOT THE ALIEN TO LIVE',
  'FAITH IS YOUR SHIELD. VIGILANCE IS YOUR SWORD.',
  'IN THE GRIM DARKNESS OF THE FAR FUTURE, THERE IS ONLY WAR',
  'KNOWLEDGE IS POWER — GUARD IT WELL',
  'DOUBT IS THE SEED OF HERESY',
  'BLESSED IS THE MIND TOO SMALL FOR DOUBT',
  'TO QUESTION IS TO ADMIT WEAKNESS',
  'PURGE THE UNCLEAN',
  'HERESY GROWS FROM IDLENESS',
]

function randomThought() {
  return THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)]
}

/* ── Sub-components ── */

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="font-mono-ph text-xs tracking-widest ph-glow-mid"
            style={{ color: 'var(--ph-dim)' }}>
        {children}
      </span>
      <div className="flex-1 h-px" style={{ background: 'var(--ph-dim)' }} />
    </div>
  )
}

function StatBox({ label, value }) {
  return (
    <div className="flex flex-col items-center flex-1 py-2 border-r last:border-r-0"
         style={{ borderColor: 'var(--ph-dim)' }}>
      <span className="font-mono-ph text-xs leading-none mb-1"
            style={{ color: 'var(--ph-dim)' }}>
        {label}
      </span>
      <span className="font-vt323 text-2xl leading-none ph-glow-bright"
            style={{ color: 'var(--ph-bright)' }}>
        {value}
      </span>
    </div>
  )
}

function WeaponTable({ weapons, label }) {
  if (!weapons || weapons.length === 0) return null
  const cols = Object.keys(weapons[0]).filter(k => k !== 'name' && k !== 'keywords')

  return (
    <div className="mb-3">
      <div className="font-mono-ph text-xs mb-1 px-1 tracking-wider"
           style={{ color: 'var(--ph-dim)' }}>
        — {label} —
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--ph-dim)' }}>
            <th className="font-mono-ph text-xs text-left py-1 px-1 font-normal"
                style={{ color: 'var(--ph-dim)' }}>
              WEAPON
            </th>
            {cols.map(c => (
              <th key={c} className="font-mono-ph text-xs text-center py-1 px-1 font-normal"
                  style={{ color: 'var(--ph-dim)' }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weapons.map((wpn, i) => (
            <tr key={i}
                style={{ borderBottom: '1px solid rgba(0,122,31,0.4)' }}>
              <td className="font-mono-ph text-xs py-1 px-1 ph-glow-mid"
                  style={{ color: 'var(--ph-mid)' }}>
                {wpn.name}
                {wpn.keywords && wpn.keywords !== '—' && wpn.keywords.trim() && (
                  <span className="ml-1 text-xs opacity-60">[{wpn.keywords}]</span>
                )}
              </td>
              {cols.map(c => (
                <td key={c} className="font-vt323 text-base text-center py-1 px-1"
                    style={{ color: 'var(--ph-bright)' }}>
                  {wpn[c]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AbilityEntry({ name, description, last }) {
  return (
    <div>
      <div className="flex gap-2 items-baseline py-1">
        <span className="font-mono-ph text-xs font-bold ph-glow-mid whitespace-nowrap"
              style={{ color: 'var(--ph-mid)' }}>
          {name}:
        </span>
        <span className="font-mono-ph text-xs leading-relaxed"
              style={{ color: 'rgba(0,204,51,0.75)' }}>
          {description}
        </span>
      </div>
      {!last && (
        <div className="my-1"
             style={{ borderBottom: '1px dotted var(--ph-dim)' }} />
      )}
    </div>
  )
}

/* ── Main Card ── */

export default function DatasheetCard({ geminiResult, bsResult, bsStatus }) {
  const thought = useMemo(() => randomThought(), [bsResult])
  const unit = useMemo(() => parseUnit(bsResult), [bsResult])

  if (!geminiResult) return null

  /* Gemini identification panel (always shown) */
  const geminiPanel = (
    <div className="mb-4 p-3 font-mono-ph text-xs"
         style={{ border: '1px solid var(--ph-dim)', background: 'rgba(0,122,31,0.06)' }}>
      <span style={{ color: 'var(--ph-dim)' }}>// AUSPEX INPUT RECEIVED // GEMINI IDENT: </span>
      <span className="ph-glow-mid" style={{ color: 'var(--ph-mid)' }}>
        {geminiResult.unitName || '(UNRESOLVED)'}
      </span>
      {geminiResult.faction && (
        <span style={{ color: 'var(--ph-dim)' }}> // FACTION: {geminiResult.faction}</span>
      )}
      {bsStatus && (
        <div className="mt-1" style={{ color: 'var(--ph-dim)' }}>{bsStatus}</div>
      )}
    </div>
  )

  if (!unit) {
    return (
      <div className="mt-6 max-w-2xl mx-auto">
        {geminiPanel}
        <div className="font-mono-ph text-xs text-center py-4"
             style={{ color: 'var(--ph-dim)' }}>
          // NO UNIT RECORD FOUND IN DATABANKS //
        </div>
      </div>
    )
  }

  const STAT_ORDER = ['M', 'T', 'SV', 'W', 'LD', 'OC']
  const hasWeapons = unit.weapons.ranged.length > 0 || unit.weapons.melee.length > 0
  const hasAbilities = unit.abilities.length > 0

  return (
    <div className="mt-6 max-w-2xl mx-auto">
      {geminiPanel}

      {/* Outer frame */}
      <div className="auspex-border auspex-border-inner scanlines ph-glow-box-strong"
           style={{ background: 'var(--ph-bg)', padding: '0' }}>

        {/* Top accent bar */}
        <div className="h-1" style={{ background: 'var(--ph-border)' }} />

        <div className="p-4">

          {/* ── HEADER ── */}
          <div className="mb-4 pb-3"
               style={{ borderBottom: '2px solid var(--ph-border)' }}>
            <div className="font-mono-ph text-xs mb-1 tracking-widest ph-glow-mid"
                 style={{ color: 'var(--ph-dim)' }}>
              // UNIT IDENTIFIED //
            </div>
            <div className="font-gothic leading-none ph-glow-bright"
                 style={{ color: 'var(--ph-bright)', fontSize: 'clamp(1.6rem, 5vw, 2.4rem)' }}>
              {unit.name}
            </div>
            {unit.factionKeywords.length > 0 && (
              <div className="font-mono-ph text-xs mt-1 tracking-widest"
                   style={{ color: 'var(--ph-mid)' }}>
                {unit.factionKeywords.join(' • ')}
              </div>
            )}
          </div>

          {/* ── STAT BLOCK ── */}
          <div className="mb-4">
            <SectionLabel>// COMBAT PARAMETERS</SectionLabel>
            <div className="flex auspex-border ph-glow-box"
                 style={{ borderColor: 'var(--ph-border)', background: 'rgba(0,122,31,0.07)' }}>
              {STAT_ORDER.map(s => (
                <StatBox key={s} label={s} value={unit.stats[s]} />
              ))}
            </div>
          </div>

          {/* ── WEAPONS ── */}
          {hasWeapons && (
            <div className="mb-4">
              <SectionLabel>// ARMAMENTS</SectionLabel>
              <WeaponTable weapons={unit.weapons.ranged} label="RANGED" />
              <WeaponTable weapons={unit.weapons.melee} label="MELEE" />
            </div>
          )}

          {/* ── ABILITIES ── */}
          {hasAbilities && (
            <div className="mb-4">
              <SectionLabel>// SPECIAL PROTOCOLS</SectionLabel>
              <div className="p-2"
                   style={{ border: '1px solid var(--ph-dim)', background: 'rgba(0,122,31,0.04)' }}>
                {unit.abilities.map((ab, i) => (
                  <AbilityEntry
                    key={i}
                    name={ab.name}
                    description={ab.description}
                    last={i === unit.abilities.length - 1}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── KEYWORDS ── */}
          {(unit.factionKeywords.length > 0 || unit.keywords.length > 0) && (
            <div className="mb-4">
              <SectionLabel>// IDENTIFICATION TAGS</SectionLabel>
              {unit.factionKeywords.length > 0 && (
                <div className="mb-1">
                  <span className="font-mono-ph text-xs mr-2"
                        style={{ color: 'var(--ph-dim)' }}>
                    FACTION:
                  </span>
                  <span className="font-mono-ph text-xs"
                        style={{ color: 'var(--ph-mid)' }}>
                    {unit.factionKeywords.join(', ')}
                  </span>
                </div>
              )}
              {unit.keywords.length > 0 && (
                <div>
                  <span className="font-mono-ph text-xs mr-2"
                        style={{ color: 'var(--ph-dim)' }}>
                    KEYWORDS:
                  </span>
                  <span className="font-mono-ph text-xs"
                        style={{ color: 'var(--ph-mid)' }}>
                    {unit.keywords.join(', ')}
                  </span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* ── STATUS BAR ── */}
        <div className="px-4 py-2 font-mono-ph text-xs flex flex-wrap gap-x-2 gap-y-1"
             style={{
               borderTop: '1px solid var(--ph-dim)',
               background: 'rgba(0,122,31,0.08)',
               color: 'var(--ph-dim)',
             }}>
          <span>AUSPEX SCAN COMPLETE</span>
          <span>//</span>
          <span>UNIT RECORD RETRIEVED</span>
          <span>//</span>
          <span>THOUGHT FOR THE DAY: {thought}</span>
        </div>

        {/* Bottom accent bar */}
        <div className="h-1" style={{ background: 'var(--ph-border)' }} />
      </div>
    </div>
  )
}
