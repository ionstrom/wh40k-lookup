import { useState } from 'react'
import ApiKeyInput from './components/ApiKeyInput'
import ImageInput from './components/ImageInput'
import RawUnitDisplay from './components/RawUnitDisplay'
import { useGemini } from './hooks/useGemini'
import { useBattlescribe } from './hooks/useBattlescribe'

const LS_KEY = 'wh40k_gemini_api_key'

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(LS_KEY) || '')
  const [selectedFile, setSelectedFile] = useState(null)
  const [geminiResult, setGeminiResult] = useState(null)
  const [bsResult, setBsResult] = useState(null)
  const [bsMatchStatus, setBsMatchStatus] = useState('')
  const [error, setError] = useState('')
  const [statusMsg, setStatusMsg] = useState('')

  const { identify, loading: geminiLoading, loadModels, models, selectedModel, setSelectedModel, modelsLoading } = useGemini()
  const { lookup, loading: bsLoading, status: bsStatus } = useBattlescribe()

  const loading = geminiLoading || bsLoading

  function handleApiKeyChange(key) {
    setApiKey(key)
    localStorage.setItem(LS_KEY, key)
  }

  async function handleIdentify() {
    if (!apiKey.trim()) { setError('Please enter your Gemini API key above.'); return }
    if (!selectedModel) { setError('Please load models and select one above.'); return }
    if (!selectedFile) { setError('Please select an image first.'); return }

    setError('')
    setGeminiResult(null)
    setBsResult(null)
    setBsMatchStatus('')

    try {
      setStatusMsg('Sending image to Gemini...')
      const result = await identify(selectedFile, apiKey.trim())
      setGeminiResult(result)

      if (!result.unitName) {
        setBsMatchStatus('Skipping BattleScribe lookup — unit name not parsed.')
        setStatusMsg('')
        return
      }

      setStatusMsg('Fetching BattleScribe catalogue...')
      const match = await lookup(result.unitName, result.faction)

      if (match) {
        setBsMatchStatus(`✅ Matched "${match.name}" in catalogue`)
        setBsResult(match)
      } else {
        setBsMatchStatus(`⚠ No exact match found for "${result.unitName}"`)
      }
    } catch (err) {
      setError(err.message || String(err))
    } finally {
      setStatusMsg('')
    }
  }

  const canIdentify = !!apiKey.trim() && !!selectedFile && !!selectedModel && !loading

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-gray-100 font-mono p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 tracking-widest uppercase mb-1">
            ⚔ WH40K Datasheet Lookup
          </h1>
          <p className="text-gray-400 text-sm">Gemini Vision + BattleScribe XML</p>
        </div>

        <ApiKeyInput
          apiKey={apiKey}
          onChange={handleApiKeyChange}
          models={models}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          onLoadModels={loadModels}
          modelsLoading={modelsLoading}
        />
        <ImageInput onFileSelect={setSelectedFile} />

        <button
          onClick={handleIdentify}
          disabled={!canIdentify}
          className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold uppercase tracking-widest rounded-lg transition-colors text-sm"
        >
          {loading ? 'Identifying…' : 'Identify Miniature'}
        </button>

        {(statusMsg || bsStatus) && (
          <div className="mt-4 text-center">
            <div className="inline-block w-8 h-8 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin mb-2" />
            <p className="text-yellow-400 text-sm">{statusMsg || bsStatus}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-900/40 border border-red-600 rounded-lg p-4 text-red-300 text-sm">
            Error: {error}
          </div>
        )}

        <RawUnitDisplay
          geminiResult={geminiResult}
          bsResult={bsResult}
          bsStatus={bsMatchStatus}
        />

        <p className="text-center text-gray-600 text-xs mt-8">
          BattleScribe data © BSData contributors —{' '}
          <a href="https://github.com/BSData/wh40k-10e" className="underline hover:text-gray-400">
            github.com/BSData/wh40k-10e
          </a>
        </p>
      </div>
    </div>
  )
}
