import { useState } from 'react'
import ApiKeyInput from './components/ApiKeyInput'
import ImageInput from './components/ImageInput'
import DatasheetCard from './components/DatasheetCard'
import RawUnitDisplay from './components/RawUnitDisplay' // kept for debug
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
    if (!apiKey.trim()) { setError('// ERROR: NO API KEY SUPPLIED'); return }
    if (!selectedModel) { setError('// ERROR: NO MODEL SELECTED — LOAD MODELS FIRST'); return }
    if (!selectedFile) { setError('// ERROR: NO IMAGE LOADED'); return }

    setError('')
    setGeminiResult(null)
    setBsResult(null)
    setBsMatchStatus('')

    try {
      setStatusMsg('// TRANSMITTING IMAGE TO GEMINI COGITATOR...')
      const result = await identify(selectedFile, apiKey.trim())
      setGeminiResult(result)

      if (!result.unitName) {
        setBsMatchStatus('// WARNING: UNIT NAME UNRESOLVED — SKIPPING DATABANK QUERY')
        setStatusMsg('')
        return
      }

      setStatusMsg('// QUERYING BATTLESCRIBE DATABANKS...')
      const match = await lookup(result.unitName, result.faction)

      if (match) {
        setBsMatchStatus(`// MATCH CONFIRMED: "${match.name}"`)
        setBsResult(match)
      } else {
        setBsMatchStatus(`// WARNING: NO RECORD FOUND FOR "${result.unitName}"`)
      }
    } catch (err) {
      setError(`// SYSTEM FAULT: ${err.message || String(err)}`)
    } finally {
      setStatusMsg('')
    }
  }

  const canIdentify = !!apiKey.trim() && !!selectedFile && !!selectedModel && !loading

  return (
    <div className="min-h-screen scanlines font-mono-ph p-4"
         style={{ background: 'var(--ph-bg)', color: 'var(--ph-mid)' }}>
      <div className="max-w-2xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-8 pt-4">
          <div className="font-mono-ph text-xs mb-2 tracking-widest"
               style={{ color: 'var(--ph-dim)' }}>
            // IMPERIAL AUSPEX TERMINAL v10.0 // UNIT IDENTIFICATION SYSTEM //
          </div>
          <div className="font-gothic ph-glow-bright"
               style={{ color: 'var(--ph-bright)', fontSize: 'clamp(1.8rem, 6vw, 2.8rem)', lineHeight: 1 }}>
            WH40K Datasheet Lookup
          </div>
          <div className="font-mono-ph text-xs mt-2 tracking-widest"
               style={{ color: 'var(--ph-dim)' }}>
            GEMINI VISION COGITATOR · BATTLESCRIBE DATABANK ACCESS
          </div>
          <div className="mt-3 mx-auto" style={{ height: '2px', background: 'var(--ph-border)', maxWidth: '400px' }} />
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

        {/* ── Identify button ── */}
        <button
          onClick={handleIdentify}
          disabled={!canIdentify}
          className="w-full py-3 font-mono-ph text-sm uppercase tracking-widest transition-all"
          style={canIdentify ? {
            background: 'rgba(0,122,31,0.15)',
            border: '2px solid var(--ph-bright)',
            color: 'var(--ph-bright)',
            textShadow: '0 0 8px var(--ph-bright)',
            boxShadow: '0 0 12px var(--ph-dim)',
          } : {
            background: 'rgba(0,122,31,0.04)',
            border: '2px solid var(--ph-dim)',
            color: 'var(--ph-dim)',
            cursor: 'not-allowed',
          }}
        >
          {loading ? '// SCANNING... //' : '[ INITIATE AUSPEX SCAN ]'}
        </button>

        {/* ── Loading status ── */}
        {(statusMsg || bsStatus) && (
          <div className="mt-4 font-mono-ph text-xs text-center py-2"
               style={{ color: 'var(--ph-mid)', borderTop: '1px solid var(--ph-dim)', borderBottom: '1px solid var(--ph-dim)' }}>
            <span className="inline-block mr-2 animate-pulse">▌</span>
            {statusMsg || bsStatus}
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="mt-4 p-3 font-mono-ph text-xs"
               style={{ border: '1px solid #7a0000', background: 'rgba(122,0,0,0.15)', color: '#ff4444' }}>
            {error}
          </div>
        )}

        <DatasheetCard
          geminiResult={geminiResult}
          bsResult={bsResult}
          bsStatus={bsMatchStatus}
        />

        {/* ── Footer ── */}
        <div className="text-center font-mono-ph text-xs mt-8 pb-4"
             style={{ color: 'var(--ph-dim)', borderTop: '1px solid var(--ph-dim)', paddingTop: '1rem' }}>
          BATTLESCRIBE DATA © BSDATA CONTRIBUTORS //&nbsp;
          <a href="https://github.com/BSData/wh40k-10e"
             style={{ color: 'var(--ph-mid)' }}
             className="underline hover:ph-glow-mid">
            github.com/BSData/wh40k-10e
          </a>
        </div>
      </div>
    </div>
  )
}
