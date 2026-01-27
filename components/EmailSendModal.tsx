'use client'

import { useState } from 'react'
import { X, Send } from 'lucide-react'

interface EmailSendModalProps {
  patientName: string
  patientId: string
  biologicalAge: number
  chronologicalAge: number
  symmetryScore: number
  skinQuality: number
  laxityScore: number
  onClose: () => void
}

export function EmailSendModal({
  patientName,
  patientId,
  biologicalAge,
  chronologicalAge,
  symmetryScore,
  skinQuality,
  laxityScore,
  onClose
}: EmailSendModalProps) {
  const [recipientEmail, setRecipientEmail] = useState('')
  const [ccEmail, setCcEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
  
  const handleSend = () => {
    if (!recipientEmail) {
      alert('⚠️ Por favor ingresa un email de destino')
      return
    }
    
    if (!validateEmail(recipientEmail)) {
      alert('⚠️ El email de destino no es válido')
      return
    }
    
    if (ccEmail && !validateEmail(ccEmail)) {
      alert('⚠️ El email CC no es válido')
      return
    }
    
    setSending(true)
    
    // Construir el cuerpo del email
    const subject = encodeURIComponent(`Pasaporte de Inmortalidad - ${patientName}`)
    
    const body = encodeURIComponent(`Hola ${patientName},

Adjunto encontrarás tu Pasaporte de Inmortalidad generado por Maya Harmony Station.

📊 RESUMEN DE TU DIAGNÓSTICO:

Edad Biológica: ${biologicalAge} años (cronológica: ${chronologicalAge})
Diferencia: ${chronologicalAge - biologicalAge} años más joven 🎉

Métricas Faciales:
• Simetría (Golden Ratio): ${symmetryScore}/100
• Calidad de Piel (Obagi): ${skinQuality}/100
• Laxitud Facial (Connell): ${laxityScore}/100

${message ? `\nMENSAJE ADICIONAL:\n${message}\n` : ''}
---

Por favor descarga el PDF completo desde la aplicación Maya Bio-Mirror para ver tu plan de tratamiento personalizado, visualizaciones tipo VISIA y calculadora de ROI.

Para agendar tu consulta o solicitar tu kit de nutraceuticos de Interdrogas, contáctanos al: 6024873000

Saludos,
Dr. Maya - Director de Bioingeniería Humana
Maya Harmony Station`)
    
    // Construir mailto URL con CC si está presente
    let mailtoUrl = `mailto:${recipientEmail}?subject=${subject}&body=${body}`
    
    if (ccEmail) {
      mailtoUrl += `&cc=${ccEmail}`
    }
    
    // Abrir cliente de email
    window.location.href = mailtoUrl
    
    // Esperar un momento y cerrar
    setTimeout(() => {
      setSending(false)
      alert('✅ Se abrió tu cliente de email.\n\n💡 Recuerda adjuntar el PDF descargado antes de enviar.')
      onClose()
    }, 1000)
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-bold">📧 Enviar por Email</h3>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-sm text-white/90">Envía el diagnóstico a cualquier email</p>
        </div>
        
        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Email destinatario */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Para (Email destino) *
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="ejemplo@email.com"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          
          {/* CC (opcional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              CC (Copia - Opcional)
            </label>
            <input
              type="email"
              value={ccEmail}
              onChange={(e) => setCcEmail(e.target.value)}
              placeholder="copia@email.com"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          
          {/* Mensaje adicional */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mensaje Adicional (Opcional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Agrega un mensaje personalizado..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            />
          </div>
          
          {/* Preview del asunto */}
          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <div className="text-xs font-semibold text-blue-700 mb-1">ASUNTO:</div>
            <div className="text-sm text-blue-900 font-medium">
              Pasaporte de Inmortalidad - {patientName}
            </div>
          </div>
          
          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={sending}
              className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-bold transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleSend}
              disabled={sending}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              {sending ? 'Abriendo...' : 'Enviar Email'}
            </button>
          </div>
          
          {/* Nota importante */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
            <div className="text-xs font-semibold text-amber-800 mb-1">💡 IMPORTANTE:</div>
            <div className="text-sm text-amber-900">
              Se abrirá tu cliente de email (Outlook, Gmail, etc.). Recuerda adjuntar el PDF descargado antes de enviar.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
