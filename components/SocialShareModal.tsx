'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface SocialShareModalProps {
  patientName: string
  patientId: string
  biologicalAge: number
  chronologicalAge: number
  symmetryScore: number
  onClose: () => void
}

export function SocialShareModal({
  patientName,
  patientId,
  biologicalAge,
  chronologicalAge,
  symmetryScore,
  onClose
}: SocialShareModalProps) {
  const [copying, setCopying] = useState(false)
  
  const shareText = `Mi análisis biológico Maya Harmony:\n\n✨ Edad Biológica: ${biologicalAge} años\n💎 Simetría: ${symmetryScore}/100\n🧬 Sistema: Maya Harmony Station`
  
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  
  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(shareText + `\n\n${shareUrl}`)
    window.open(`https://wa.me/?text=${encoded}`, '_blank')
  }
  
  const handleFacebook = () => {
    const encoded = encodeURIComponent(shareUrl)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encoded}`, '_blank')
  }
  
  const handleTwitter = () => {
    const encoded = encodeURIComponent(shareText)
    window.open(`https://twitter.com/intent/tweet?text=${encoded}&url=${encodeURIComponent(shareUrl)}`, '_blank')
  }
  
  const handleInstagram = async () => {
    alert('📸 Instagram:\n\n1. Toma captura de pantalla de tus resultados\n2. Abre Instagram\n3. Crea una nueva historia\n4. Sube la captura\n\n💡 El texto se ha copiado al portapapeles para que lo pegues en tu historia.')
    await copyToClipboard()
  }
  
  const handleTikTok = () => {
    alert('🎵 TikTok:\n\n1. Descarga el PDF de tus resultados\n2. Abre TikTok\n3. Crea un nuevo video mostrando tus resultados\n4. Usa el hashtag #MayaHarmony\n\n💡 El texto se ha copiado al portapapeles.')
    copyToClipboard()
  }
  
  const handleKakaoTalk = () => {
    if (typeof window !== 'undefined' && (window as any).Kakao) {
      (window as any).Kakao.Link.sendDefault({
        objectType: 'text',
        text: shareText,
        link: {
          webUrl: shareUrl,
          mobileWebUrl: shareUrl
        }
      })
    } else {
      alert('⚠️ KakaoTalk no está disponible en este dispositivo.\n\nEl texto se ha copiado al portapapeles para que lo compartas manualmente.')
      copyToClipboard()
    }
  }
  
  const handleLinkedIn = () => {
    const encoded = encodeURIComponent(shareUrl)
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`, '_blank')
  }
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText + `\n\n${shareUrl}`)
      setCopying(true)
      setTimeout(() => setCopying(false), 2000)
      return true
    } catch (error) {
      console.error('Error al copiar:', error)
      return false
    }
  }
  
  const handleCopyLink = async () => {
    const success = await copyToClipboard()
    if (success) {
      alert('✅ Texto y enlace copiados al portapapeles')
    } else {
      alert('❌ No se pudo copiar. Intenta manualmente.')
    }
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-bold">📱 Compartir Resultados</h3>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-sm text-white/90">Elige dónde compartir tu diagnóstico</p>
        </div>
        
        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Preview del mensaje */}
          <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
            <div className="text-xs font-semibold text-gray-500 mb-2">VISTA PREVIA:</div>
            <div className="text-sm text-gray-700 whitespace-pre-line">
              {shareText}
            </div>
          </div>
          
          {/* Grid de redes sociales */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-all"
            >
              <span className="text-xl">💬</span>
              WhatsApp
            </button>
            
            <button
              onClick={handleInstagram}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl font-semibold transition-all"
            >
              <span className="text-xl">📸</span>
              Instagram
            </button>
            
            <button
              onClick={handleFacebook}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all"
            >
              <span className="text-xl">👥</span>
              Facebook
            </button>
            
            <button
              onClick={handleTikTok}
              className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-semibold transition-all"
            >
              <span className="text-xl">🎵</span>
              TikTok
            </button>
            
            <button
              onClick={handleTwitter}
              className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-xl font-semibold transition-all"
            >
              <span className="text-xl">🐦</span>
              Twitter
            </button>
            
            <button
              onClick={handleKakaoTalk}
              className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-3 rounded-xl font-semibold transition-all"
            >
              <span className="text-xl">💬</span>
              Kakao
            </button>
            
            <button
              onClick={handleLinkedIn}
              className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold transition-all"
            >
              <span className="text-xl">💼</span>
              LinkedIn
            </button>
            
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-all"
            >
              <span className="text-xl">{copying ? '✅' : '📋'}</span>
              {copying ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
