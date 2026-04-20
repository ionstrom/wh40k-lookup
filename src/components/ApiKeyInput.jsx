export default function ApiKeyInput({ apiKey, onChange }) {
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
    </div>
  )
}
