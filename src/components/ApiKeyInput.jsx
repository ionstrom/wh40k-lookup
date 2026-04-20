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
    <div className="mb-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
      <label className="block text-yellow-400 text-xs uppercase tracking-widest mb-2">
        Gemini API Key
      </label>
      <input
        type="password"
        value={apiKey}
        onChange={e => onChange(e.target.value)}
        placeholder="Paste your Gemini API key here"
        className="w-full bg-gray-900 text-gray-100 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
      />
      <p className="text-gray-500 text-xs mt-1">
        Stored in localStorage — only sent to the Gemini API.
      </p>

      <div className="mt-3 flex items-center gap-2">
        <label className="text-yellow-400 text-xs uppercase tracking-widest whitespace-nowrap">
          Model
        </label>
        <select
          value={selectedModel}
          onChange={e => onModelChange(e.target.value)}
          disabled={models.length === 0}
          className="flex-1 min-w-0 bg-gray-900 text-gray-100 border border-gray-600 rounded px-2 py-1 text-xs focus:outline-none focus:border-yellow-400 disabled:text-gray-500"
        >
          {models.length === 0 ? (
            <option value="">— paste key then click Load —</option>
          ) : (
            models.map(m => (
              <option key={m.id} value={m.id}>{m.id}</option>
            ))
          )}
        </select>
        <button
          onClick={() => onLoadModels(apiKey)}
          disabled={!apiKey.trim() || modelsLoading}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-yellow-400 text-xs rounded border border-gray-600 whitespace-nowrap transition-colors"
        >
          {modelsLoading ? 'Loading…' : models.length > 0 ? 'Reload' : 'Load Models'}
        </button>
      </div>

      {selectedModel && (
        <p className="text-gray-500 text-xs mt-1">
          Using: <span className="text-yellow-300">{selectedModel}</span>
          {' '}({models.length} models available)
        </p>
      )}
    </div>
  )
}
