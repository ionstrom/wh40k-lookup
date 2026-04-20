export default function RawUnitDisplay({ geminiResult, bsResult, bsStatus }) {
  if (!geminiResult) return null

  return (
    <div className="mt-6 space-y-4">
      <div className="bg-gray-800 rounded-lg border border-yellow-600/40 p-4">
        <h2 className="text-yellow-400 text-xs uppercase tracking-widest mb-2 font-bold">
          Step 1 — Gemini Identification
        </h2>
        <p className="text-gray-200 text-sm leading-relaxed">{geminiResult.raw}</p>
        <div className="mt-2 flex gap-4 text-xs text-gray-400">
          <span>
            Unit:{' '}
            <span className="text-green-400 font-bold">
              {geminiResult.unitName || '(could not parse)'}
            </span>
          </span>
          <span>
            Faction:{' '}
            <span className="text-blue-400 font-bold">
              {geminiResult.faction || '(could not parse)'}
            </span>
          </span>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg border border-purple-600/40 p-4">
        <h2 className="text-purple-400 text-xs uppercase tracking-widest mb-2 font-bold">
          Step 2 — BattleScribe Match (Raw JSON)
        </h2>
        <div className="text-xs text-gray-400 mb-2">{bsStatus}</div>
        <pre className="text-green-300 text-xs bg-gray-900 rounded p-3 overflow-auto max-h-96 whitespace-pre-wrap break-all">
          {bsResult ? JSON.stringify(bsResult, null, 2) : ''}
        </pre>
      </div>
    </div>
  )
}
