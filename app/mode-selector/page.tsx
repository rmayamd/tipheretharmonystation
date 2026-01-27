'use client'

import { User, Stethoscope, Sparkles, Database } from 'lucide-react'
import Link from 'next/link'

export default function ModeSelectorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zen-primary via-zen-secondary to-luxury-accent flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        {/* Logo y Título Central */}
        <div className="text-center mb-12">
          <div className="inline-block bg-white rounded-full p-6 shadow-2xl mb-6">
            <Sparkles className="w-16 h-16 text-zen-primary" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Maya Harmony Station
          </h1>
          <p className="text-xl text-white/90">
            Estación de Bioingeniería Humana
          </p>
          <p className="text-sm text-white/70 mt-2">
            Sistema Superior de Análisis y Optimización Epigenética
          </p>
        </div>
        
        {/* Selector de Modos */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Modo Paciente */}
          <Link href="/patient-app">
            <div className="group bg-white rounded-3xl p-10 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-transparent hover:border-luxury-accent">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <User className="w-16 h-16 text-blue-600" />
                </div>
                
                <h2 className="text-3xl font-bold text-zen-primary mb-3">
                  Modo Paciente
                </h2>
                
                <p className="text-luxury-dark/70 mb-6">
                  Tu Espejo Biológico Personal
                </p>
                
                <div className="space-y-3 text-left mb-8">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p className="text-sm text-luxury-dark">
                      <strong>Maya Bio-Mirror:</strong> Edad biológica vs cronológica en tiempo real
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <p className="text-sm text-luxury-dark">
                      <strong>Proporción Áurea:</strong> Tu potencial de simetría facial
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p className="text-sm text-luxury-dark">
                      <strong>Chat IA:</strong> Respuestas basadas en 50+ tratados
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                    <p className="text-sm text-luxury-dark">
                      <strong>Plan Personalizado:</strong> Protocolo epigenético exclusivo
                    </p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-bold group-hover:from-blue-600 group-hover:to-purple-600 transition-colors">
                  Acceder como Paciente →
                </div>
                
                <p className="text-xs text-luxury-dark/50 mt-4">
                  Interfaz aspiracional con neuro-estética
                </p>
              </div>
            </div>
          </Link>
          
          {/* Modo Doctor */}
          <Link href="/dashboard">
            <div className="group bg-white rounded-3xl p-10 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-transparent hover:border-zen-primary">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Stethoscope className="w-16 h-16 text-zen-primary" />
                </div>
                
                <h2 className="text-3xl font-bold text-zen-primary mb-3">
                  Modo Doctor
                </h2>
                
                <p className="text-luxury-dark/70 mb-6">
                  Centro de Control Biológico
                </p>
                
                <div className="space-y-3 text-left mb-8">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-zen-primary rounded-full mt-2"></div>
                    <p className="text-sm text-luxury-dark">
                      <strong>Dashboard Maestro:</strong> Análisis 3 niveles completo
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-zen-secondary rounded-full mt-2"></div>
                    <p className="text-sm text-luxury-dark">
                      <strong>Maya-Vision:</strong> Connell + Obagi + Análisis profundo
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-luxury-accent rounded-full mt-2"></div>
                    <p className="text-sm text-luxury-dark">
                      <strong>Cerebro Maya:</strong> Síntesis cruzada de 50+ tratados
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <p className="text-sm text-luxury-dark">
                      <strong>CRM Luxury:</strong> Neuroventas automatizadas
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p className="text-sm text-luxury-dark">
                      <strong>Sistema Interdrogas:</strong> Órdenes automáticas WhatsApp
                    </p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-zen-primary to-zen-secondary text-white py-4 rounded-xl font-bold group-hover:from-zen-secondary group-hover:to-zen-primary transition-colors">
                  Acceder como Doctor →
                </div>
                
                <p className="text-xs text-luxury-dark/50 mt-4">
                  Centro de control de datos biológicos masivos
                </p>
              </div>
            </div>
          </Link>
        </div>
        
        {/* Características Compartidas */}
        <div className="mt-12 bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Database className="w-8 h-8" />
            <h3 className="text-2xl font-bold">Sistema Completo Integrado</h3>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 text-center text-sm">
            <div>
              <p className="text-3xl font-bold mb-2">50+</p>
              <p className="opacity-80">Tratados Médicos</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-2">15+</p>
              <p className="opacity-80">Módulos Integrados</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-2">3</p>
              <p className="opacity-80">Niveles de Análisis</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-2">100%</p>
              <p className="opacity-80">Propietario</p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-white/70 text-sm">
          <p>Maya Harmony Station © 2026</p>
          <p className="mt-1">El futuro de la bioingeniería humana</p>
        </div>
      </div>
    </div>
  )
}
