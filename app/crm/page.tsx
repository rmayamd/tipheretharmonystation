'use client'

import { useState, useEffect } from 'react'
import { Users, MessageSquare, Filter, Search } from 'lucide-react'

interface Patient {
  id: string
  name: string
  age: number
  segment: 'joven' | 'maduro' | 'longevidad'
  status: string
  lastContact?: string
}

export default function CRMPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [filter, setFilter] = useState<'all' | 'joven' | 'maduro' | 'longevidad'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // En producción, esto cargaría datos reales de Supabase
    setPatients([
      { id: '1', name: 'María González', age: 28, segment: 'joven', status: 'active' },
      { id: '2', name: 'Juan Pérez', age: 42, segment: 'maduro', status: 'active' },
      { id: '3', name: 'Ana Martínez', age: 58, segment: 'longevidad', status: 'active' },
      { id: '4', name: 'Carlos Rodríguez', age: 35, segment: 'joven', status: 'active' },
      { id: '5', name: 'Laura Sánchez', age: 52, segment: 'longevidad', status: 'active' },
    ])
  }, [])

  const filteredPatients = patients.filter((patient) => {
    const matchesFilter = filter === 'all' || patient.segment === filter
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getSegmentMessage = (segment: string, age: number) => {
    if (segment === 'joven' || age < 35) {
      return 'Mensaje: Optimización preventiva y fitness. Tu cuerpo tiene máxima capacidad de regeneración.'
    } else if (segment === 'maduro' || (age >= 35 && age < 50)) {
      return 'Mensaje: Regeneración epigenética. Activa mecanismos de longevidad que tu cuerpo aún conserva.'
    } else {
      return 'Mensaje: Actualización epigenética. Revertir marcadores de envejecimiento y añadir años de vida saludable.'
    }
  }

  return (
    <div className="min-h-screen zen-gradient p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zen-dark mb-2">
            CRM Inteligente
          </h1>
          <p className="text-lg text-zen-secondary">
            Base de Datos Luxury con Automatización de Mensajería
          </p>
        </div>

        {/* Filters */}
        <div className="luxury-card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-luxury-dark/50" />
                <input
                  type="text"
                  placeholder="Buscar paciente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg ${
                  filter === 'all' ? 'bg-zen-primary text-white' : 'bg-white text-zen-primary'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilter('joven')}
                className={`px-4 py-2 rounded-lg ${
                  filter === 'joven' ? 'bg-zen-primary text-white' : 'bg-white text-zen-primary'
                }`}
              >
                Jóvenes
              </button>
              <button
                onClick={() => setFilter('maduro')}
                className={`px-4 py-2 rounded-lg ${
                  filter === 'maduro' ? 'bg-zen-primary text-white' : 'bg-white text-zen-primary'
                }`}
              >
                Maduros
              </button>
              <button
                onClick={() => setFilter('longevidad')}
                className={`px-4 py-2 rounded-lg ${
                  filter === 'longevidad' ? 'bg-zen-primary text-white' : 'bg-white text-zen-primary'
                }`}
              >
                Longevidad
              </button>
            </div>
          </div>
        </div>

        {/* Patients List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="luxury-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{patient.name}</h3>
                  <p className="text-sm text-luxury-dark/70">
                    Edad: {patient.age} años
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  patient.segment === 'joven'
                    ? 'bg-blue-100 text-blue-700'
                    : patient.segment === 'maduro'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {patient.segment}
                </span>
              </div>

              <div className="space-y-3">
                <div className="bg-zen-light p-3 rounded-lg">
                  <p className="text-xs text-luxury-dark/70 mb-1">
                    Mensaje Automatizado:
                  </p>
                  <p className="text-sm italic">
                    {getSegmentMessage(patient.segment, patient.age)}
                  </p>
                </div>

                <button className="zen-button w-full text-sm py-2">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Enviar Mensaje
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="luxury-card text-center py-12">
            <Users className="w-16 h-16 text-luxury-dark/30 mx-auto mb-4" />
            <p className="text-luxury-dark/70">No se encontraron pacientes</p>
          </div>
        )}
      </div>
    </div>
  )
}
