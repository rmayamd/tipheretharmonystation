'use client'

import { useState } from 'react'
import { Send, Bot, User, Sparkles, Phone } from 'lucide-react'
import Link from 'next/link'

interface Message {
  role: 'user' | 'ai' | 'doctor'
  content: string
  timestamp: Date
  sources?: string[]
}

export default function PatientChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: '¡Hola! Soy el Asistente Maya, potenciado por 50+ tratados médicos. ¿En qué puedo ayudarte hoy? Puedo responder sobre: recuperación post-operatoria, protocolos nutricionales, cuidados de la piel, y más.',
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  const knowledgeBase = {
    'cirugía connell': {
      response: 'El protocolo de recuperación Deep Plane de Connell requiere:\n\n1. Dormir con cabeza elevada 45° por 2 semanas\n2. No presión lateral en la cara por 3 semanas\n3. Evitar ejercicio intenso por 4-6 semanas\n4. Aplicar protocolo anti-tensión Ogawa desde día 3\n\nEs fundamental seguir el protocolo de silicona médica para prevenir queloides.',
      sources: ['Bruce Connell - Deep Plane Facelift', 'Rei Ogawa - Scar Management'],
    },
    'dormir': {
      response: 'Para optimizar tu recuperación post-cirugía:\n\n✓ Dormir boca arriba con 2-3 almohadas\n✓ Inclinación de 30-45 grados\n✓ Mantener por 14-21 días\n✓ Usar almohada en forma de U para evitar giros\n\nEsto reduce inflamación y mejora drenaje linfático según protocolo ERAS.',
      sources: ['ERAS Complete Protocols', 'Handbook of Perioperative Care'],
    },
    'nutricion': {
      response: 'Tu protocolo de nutrición epigenética incluye:\n\n🥗 ALIMENTOS CLAVE:\n- Vegetales crucíferos (brócoli, coliflor) - Activación Nrf2\n- Pescado azul 3x/semana - Omega-3\n- Proteína completa 1.6g/kg - Síntesis muscular\n\n💊 SUPLEMENTOS ESENCIALES:\n- BCAA + Leucina pre-entrenamiento\n- Vitamina C 1000mg - Síntesis colágeno\n- Zinc 15mg - Cicatrización',
      sources: ['Byung Pal Yu - Nutrition and Epigenetics', 'Manual de Nutrigenómica'],
    },
    'piel obagi': {
      response: 'El protocolo Obagi para preparación quirúrgica:\n\n🧴 PRODUCTOS ESENCIALES:\n1. Obagi Professional-C Serum 20%\n2. Obagi Retinol 0.5-1.0%\n3. Obagi SPF 50+ (OBLIGATORIO)\n\n📅 TIMELINE:\n- Semanas 1-4: Limpiador + Vitamina C + SPF\n- Semanas 5-8: Agregar Retinol (empezar 0.5%)\n- Semanas 9-12: Aumentar a Retinol 1.0%\n\nEsto optimiza grosor dérmico y síntesis de colágeno.',
      sources: ['Zein Obagi - Skin Health Restoration'],
    },
  }
  
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return
    
    // Agregar mensaje del usuario
    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)
    
    // Simular respuesta de IA
    setTimeout(() => {
      const lowerInput = inputMessage.toLowerCase()
      let aiResponse: Message
      
      // Buscar en base de conocimiento
      const matchedKey = Object.keys(knowledgeBase).find(key =>
        lowerInput.includes(key)
      )
      
      if (matchedKey) {
        const knowledge = knowledgeBase[matchedKey as keyof typeof knowledgeBase]
        aiResponse = {
          role: 'ai',
          content: knowledge.response,
          timestamp: new Date(),
          sources: knowledge.sources,
        }
      } else if (lowerInput.includes('precio') || lowerInput.includes('costo') || lowerInput.includes('cuanto')) {
        // Preguntas complejas → transferir a doctor
        aiResponse = {
          role: 'doctor',
          content: 'Esta consulta requiere evaluación personalizada del Dr. Maya. He adjuntado tu reporte completo (InBody + Quantum + Maya-Vision) y te estoy conectando directamente. Un momento...',
          timestamp: new Date(),
        }
      } else {
        aiResponse = {
          role: 'ai',
          content: 'Entiendo tu pregunta. Te puedo ayudar con temas específicos como:\n\n• Recuperación post-operatoria\n• Protocolos nutricionales\n• Cuidados de la piel Obagi\n• Ejercicios post-cirugía\n• Prevención de queloides\n\n¿Sobre cuál te gustaría saber más?\n\nSi necesitas una consulta más específica, puedo conectarte directamente con el Dr. Maya.',
          timestamp: new Date(),
        }
      }
      
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }
  
  const quickQuestions = [
    '¿Cómo debo dormir después de cirugía Connell?',
    '¿Qué alimentos debo comer?',
    '¿Cuál es mi protocolo Obagi?',
    '¿Cuándo puedo hacer ejercicio?',
  ]
  
  return (
    <div className="min-h-screen bg-luxury-light">
      {/* Header */}
      <header className="bg-gradient-to-r from-zen-primary to-zen-secondary text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">Asistente Maya</h1>
              <p className="text-xs opacity-90">Potenciado por 50+ Tratados Médicos</p>
            </div>
          </div>
          <Link href="/patient-app">
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm">
              ← Volver
            </button>
          </Link>
        </div>
      </header>
      
      <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-120px)] flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-zen-primary text-white'
                    : message.role === 'doctor'
                    ? 'bg-luxury-accent text-white'
                    : 'bg-white shadow-md'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.role !== 'user' && (
                    <div className={`flex-shrink-0 ${
                      message.role === 'doctor' ? 'text-white' : 'text-zen-primary'
                    }`}>
                      {message.role === 'doctor' ? (
                        <User className="w-5 h-5" />
                      ) : (
                        <Bot className="w-5 h-5" />
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className={`text-sm whitespace-pre-line ${
                      message.role === 'user' ? 'text-white' : 'text-luxury-dark'
                    }`}>
                      {message.content}
                    </p>
                    
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-zen-primary/20">
                        <p className="text-xs text-luxury-dark/60 flex items-center space-x-1 mb-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Fuentes científicas:</span>
                        </p>
                        {message.sources.map((source, idx) => (
                          <p key={idx} className="text-xs text-luxury-dark/70">
                            • {source}
                          </p>
                        ))}
                      </div>
                    )}
                    
                    {message.role === 'doctor' && (
                      <a
                        href="https://wa.me/576024873000?text=Hola%20Dr.%20Maya,%20el%20Asistente%20Maya%20me%20transfiri%C3%B3%20para%20consulta%20personalizada"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3"
                      >
                        <button className="bg-white text-luxury-accent px-4 py-2 rounded-lg text-sm font-bold hover:bg-luxury-light transition-colors flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>Conectar con Dr. Maya</span>
                        </button>
                      </a>
                    )}
                  </div>
                </div>
                
                <p className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-white/70' : 'text-luxury-dark/50'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white shadow-md rounded-2xl p-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-zen-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-zen-primary rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-zen-primary rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Quick Questions */}
        <div className="mb-4">
          <p className="text-xs text-luxury-dark/60 mb-2">Preguntas rápidas:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(question)}
                className="bg-white text-zen-primary px-3 py-2 rounded-lg text-xs hover:bg-zen-primary hover:text-white transition-colors shadow-sm"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
        
        {/* Input Area */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe tu pregunta..."
              className="flex-1 px-4 py-3 border border-zen-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-zen-primary"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="bg-zen-primary text-white px-6 py-3 rounded-xl hover:bg-zen-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-xs text-luxury-dark/50 mt-2 text-center">
            🔬 Respuestas basadas en evidencia científica de 50+ tratados médicos
          </p>
        </div>
      </div>
    </div>
  )
}
