export default function ApiKeyInput({
  apiKey,
  onChange,
  models,
  selectedModel,
  onModelChange,
  onLoadModels,
  modelsLoading,
}) {
  return (
    <div className="mb-4 p-3 font-mono-ph"
         style={{ border: '1px solid var(--ph-border)', background: 'rgba(0,122,31,0.06)' }}>

      <div className="text-xs tracking-widest mb-2"
           style={{ color: 'var(--ph-dim)', borderBottom: '1px solid var(--ph-dim)', paddingBottom: '4px' }}>
        // COGITATOR ACCESS CREDENTIALS
      </div>

      <label className="block text-xs tracking-widest mb-1"
             style={{ color: 'var(--ph-dim)' }}>
        GEMINI API KEY
      </label>
      <input
        type="password"
        value={apiKey}
        onChange={e => onChange(e.target.value)}
        placeholder="PASTE KEY HERE..."
        className="w-full text-xs px-2 py-2 font-mono-ph focus:outline-none"
        style={{
          background: 'rgba(0,0,0,0.6)',
          border: '1px solid var(--ph-border)',
          color: 'var(--ph-bright)',
          caretColor: 'var(--ph-bright)',
        }}
      />
      <div className="text-xs mt-1" style={{ color: 'var(--ph-dim)' }}>
        // STORED IN LOCALSTORAGE — TRANSMITTED ONLY TO GEMINI API
      </div>

      <div className="mt-3 flex items-center gap-2">
        <label className="text-xs tracking-widest whitespace-nowrap"
               style={{ color: 'var(--ph-dim)' }}>
          MODEL
        </label>
        <select
          value={selectedModel}
          onChange={e => onModelChange(e.target.value)}
          disabled={models.length === 0}
          className="flex-1 min-w-0 text-xs px-2 py-1 font-mono-ph focus:outline-none"
          style={{
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid var(--ph-border)',
            color: models.length === 0 ? 'var(--ph-dim)' : 'var(--ph-mid)',
          }}
        >
          {models.length === 0 ? (
            <option value="">— PASTE KEY THEN LOAD —</option>
          ) : (
            models.map(m => (
              <option key={m.id} value={m.id}>{m.id}</option>
            ))
          )}
        </select>
        <button
          onClick={() => onLoadModels(apiKey)}
          disabled={!apiKey.trim() || modelsLoading}
          className="px-3 py-1 text-xs font-mono-ph tracking-wider transition-all whitespace-nowrap"
          style={apiKey.trim() && !modelsLoading ? {
            border: '1px solid var(--ph-mid)',
            color: 'var(--ph-mid)',
            background: 'rgba(0,122,31,0.1)',
          } : {
            border: '1px solid var(--ph-dim)',
            color: 'var(--ph-dim)',
            background: 'transparent',
            cursor: 'not-allowed',
          }}
        >
          {modelsLoading ? '...' : models.length > 0 ? 'RELOAD' : 'LOAD'}
        </button>
      </div>

      {selectedModel && (
        <div className="text-xs mt-2" style={{ color: 'var(--ph-dim)' }}>
          // ACTIVE:{' '}
          <span style={{ color: 'var(--ph-mid)' }}>{selectedModel}</span>
          {' '}// {models.length} MODELS AVAILABLE
        </div>
      )}
    </div>
  )
}
