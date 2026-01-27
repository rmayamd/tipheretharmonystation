'use client'

import { useState, useEffect } from 'react'
import { Activity, Eye, Users, Shield, TrendingUp, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalPatients: number
  pendingProcedures: number
  blockedProcedures: number
  activeProtocols: number
  todayAnalyses: number
  recoveryMonitoring: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    pendingProcedures: 0,
    blockedProcedures: 0,
    activeProtocols: 0,
    todayAnalyses: 0,
    recoveryMonitoring: 0,
  })

  useEffect(() => {
    // En producción, esto cargaría datos reales de Supabase
    setStats({
      totalPatients: 247,
      pendingProcedures: 12,
      blockedProcedures: 5,
      activeProtocols: 8,
      todayAnalyses: 3,
      recoveryMonitoring: 15,
    })
  }, [])

  return (
    <div className="min-h-screen zen-gradient p-8">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zen-dark mb-2">
            Dashboard Maestro
          </h1>
          <p className="text-lg text-zen-secondary">
            Panel de Control - Estación de Bioingeniería Humana
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="luxury-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-luxury-dark/70 mb-1">Total Pacientes</p>
                <p className="text-3xl font-bold text-zen-primary">{stats.totalPatients}</p>
              </div>
              <Users className="w-12 h-12 text-zen-primary opacity-50" />
            </div>
          </div>

          <div className="luxury-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-luxury-dark/70 mb-1">Procedimientos Pendientes</p>
                <p className="text-3xl font-bold text-zen-secondary">{stats.pendingProcedures}</p>
              </div>
              <Activity className="w-12 h-12 text-zen-secondary opacity-50" />
            </div>
          </div>

          <div className="luxury-card border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-luxury-dark/70 mb-1">Procedimientos Bloqueados</p>
                <p className="text-3xl font-bold text-red-600">{stats.blockedProcedures}</p>
                <p className="text-xs text-red-600 mt-1">Requieren Protocolo</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-red-600 opacity-50" />
            </div>
          </div>

          <div className="luxury-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-luxury-dark/70 mb-1">Protocolos Activos</p>
                <p className="text-3xl font-bold text-zen-primary">{stats.activeProtocols}</p>
              </div>
              <Shield className="w-12 h-12 text-zen-primary opacity-50" />
            </div>
          </div>

          <div className="luxury-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-luxury-dark/70 mb-1">Análisis Hoy</p>
                <p className="text-3xl font-bold text-zen-secondary">{stats.todayAnalyses}</p>
              </div>
              <Eye className="w-12 h-12 text-zen-secondary opacity-50" />
            </div>
          </div>

          <div className="luxury-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-luxury-dark/70 mb-1">Monitoreo Recuperación</p>
                <p className="text-3xl font-bold text-zen-primary">{stats.recoveryMonitoring}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-zen-primary opacity-50" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/diagnosis" className="zen-button text-center py-4">
            Nuevo Diagnóstico 3 Niveles
          </Link>
          <Link href="/maya-vision" className="zen-button text-center py-4">
            Análisis Maya-Vision
          </Link>
          <Link href="/crm" className="zen-button text-center py-4">
            CRM Inteligente
          </Link>
          <Link href="/interdrogas" className="luxury-button text-center py-4">
            Generar Orden Interdrogas
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="luxury-card">
          <h2 className="text-2xl font-bold mb-4">Actividad Reciente</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-zen-primary pl-4 py-2">
              <p className="font-semibold">Análisis Bio-Cuántico completado</p>
              <p className="text-sm text-luxury-dark/70">Paciente: María González - Protocolo de colágeno activado</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <p className="font-semibold">Procedimiento bloqueado</p>
              <p className="text-sm text-luxury-dark/70">Paciente: Juan Pérez - Inflamación NFkB elevada (65%)</p>
            </div>
            <div className="border-l-4 border-zen-secondary pl-4 py-2">
              <p className="font-semibold">Orden Interdrogas generada</p>
              <p className="text-sm text-luxury-dark/70">Paciente: Ana Martínez - Total: $1,450,000 COP</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
