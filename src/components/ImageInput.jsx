import { useRef, useState } from 'react'

export default function ImageInput({ onFileSelect }) {
  const fileInputRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [dragging, setDragging] = useState(false)

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    setPreview(URL.createObjectURL(file))
    onFileSelect(file)
  }

  return (
    <div
      onClick={() => fileInputRef.current.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
      className="p-6 text-center cursor-pointer mb-4 font-mono-ph transition-all"
      style={{
        border: dragging
          ? '2px dashed var(--ph-bright)'
          : '2px dashed var(--ph-border)',
        background: dragging
          ? 'rgba(0,255,65,0.06)'
          : 'rgba(0,122,31,0.04)',
        boxShadow: dragging ? '0 0 12px var(--ph-dim)' : 'none',
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={e => handleFile(e.target.files[0])}
      />
      {preview ? (
        <div>
          <img
            src={preview}
            alt="Selected miniature"
            className="max-h-48 mx-auto"
            style={{ border: '1px solid var(--ph-border)' }}
          />
          <div className="text-xs mt-2" style={{ color: 'var(--ph-dim)' }}>
            // IMAGE LOADED — CLICK TO REPLACE
          </div>
        </div>
      ) : (
        <>
          <div className="text-2xl mb-2 ph-glow-mid" style={{ color: 'var(--ph-mid)' }}>
            [ + ]
          </div>
          <div className="text-xs tracking-widest mb-1" style={{ color: 'var(--ph-mid)' }}>
            UPLOAD PICT-CAPTURE OR DRAG-AND-DROP
          </div>
          <div className="text-xs" style={{ color: 'var(--ph-dim)' }}>
            // ACCEPTED FORMATS: JPG · PNG · WEBP
          </div>
        </>
      )}
    </div>
  )
}
