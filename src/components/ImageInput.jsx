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
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer mb-6 transition-all ${
        dragging
          ? 'border-yellow-400 bg-yellow-400/8'
          : 'border-gray-600 hover:border-yellow-400 hover:bg-yellow-400/5'
      }`}
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
        <img
          src={preview}
          alt="Selected miniature"
          className="max-h-48 mx-auto rounded-lg border border-gray-600"
        />
      ) : (
        <>
          <div className="text-5xl mb-3">📸</div>
          <p className="text-gray-300 font-semibold">Tap to upload or take a photo</p>
          <p className="text-gray-500 text-sm mt-1">Supports JPG, PNG, WebP</p>
        </>
      )}
    </div>
  )
}
