import { useState } from 'react'

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function useGemini() {
  const [loading, setLoading] = useState(false)
  const [models, setModels] = useState([])
  const [selectedModel, setSelectedModel] = useState('')
  const [modelsLoading, setModelsLoading] = useState(false)

  async function loadModels(apiKey) {
    setModelsLoading(true)
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=100`
      )
      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        throw new Error(`${res.status}: ${e?.error?.message || res.statusText}`)
      }
      const data = await res.json()

      const vision = (data.models || [])
        .filter(m =>
          (m.supportedGenerationMethods || []).includes('generateContent') &&
          (m.name || '').includes('gemini')
        )
        .map(m => ({
          id: m.name.replace('models/', ''),
          displayName: m.displayName || m.name.replace('models/', ''),
        }))

      setModels(vision)
      // Pre-select first flash model, or first model
      const flash = vision.find(m => m.id.includes('flash'))
      setSelectedModel((flash || vision[0])?.id || '')
      return vision
    } finally {
      setModelsLoading(false)
    }
  }

  async function identify(file, apiKey) {
    if (!selectedModel) throw new Error('No model selected — load models first.')
    setLoading(true)
    try {
      const base64 = await fileToBase64(file)
      const mimeType = file.type

      const body = {
        contents: [{
          parts: [
            { inlineData: { mimeType, data: base64 } },
            {
              text: `You are an expert in Warhammer 40,000 miniatures.
Look at this image and identify the Warhammer 40K unit shown.

Respond with ONLY a JSON object in this exact format (no markdown, no explanation):
{
  "unit_name": "exact unit name (e.g. Intercessor Squad)",
  "faction": "faction name (e.g. Adeptus Astartes)",
  "confidence": "high|medium|low",
  "notes": "any relevant notes about the identification"
}

If you cannot identify a Warhammer 40K miniature, set unit_name to null.`
            }
          ]
        }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 300 }
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
      )

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(`Gemini API error ${res.status}: ${errData?.error?.message || res.statusText}`)
      }

      const data = await res.json()
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

      let unitName = null
      let faction = null
      try {
        const jsonStr = rawText.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim()
        const parsed = JSON.parse(jsonStr)
        unitName = parsed.unit_name || null
        faction = parsed.faction || null
      } catch {
        const uMatch = rawText.match(/"unit_name"\s*:\s*"([^"]+)"/)
        const fMatch = rawText.match(/"faction"\s*:\s*"([^"]+)"/)
        unitName = uMatch?.[1] || null
        faction = fMatch?.[1] || null
      }

      return { raw: rawText, unitName, faction }
    } finally {
      setLoading(false)
    }
  }

  return { identify, loading, loadModels, models, selectedModel, setSelectedModel, modelsLoading }
}
