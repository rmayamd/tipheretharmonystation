'use client'

import { useState } from 'react'
import { HardDrive, Search, FileText } from 'lucide-react'

export default function ExternalBooksPage() {
  const [drivePath, setDrivePath] = useState('')
  const [foundPDFs, setFoundPDFs] = useState<string[]>([])

  const handleSearch = async () => {
    if (!drivePath.trim()) {
      alert('Por favor ingresa la ruta del disco externo')
      return
    }

    // En producción, esto llamaría a la API para buscar PDFs
    alert(`Buscando PDFs en: ${drivePath}\n\nEn producción, esto buscaría automáticamente todos los PDFs en esa ubicación.`)
  }

  return (
    <div className="min-h-screen zen-gradient p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zen-dark mb-2">
            Leer Libros desde Disco Externo
          </h1>
          <p className="text-lg text-zen-secondary">
            Proporciona la ruta de tu disco duro externo
          </p>
        </div>

        <div className="luxury-card mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <HardDrive className="w-6 h-6 mr-2" />
            Ruta del Disco Externo
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Ruta Completa (ejemplo: E:\libros o D:\Documents\books)
              </label>
              <input
                type="text"
                value={drivePath}
                onChange={(e) => setDrivePath(e.target.value)}
                placeholder="E:\libros o D:\Documents\books"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <button
              onClick={handleSearch}
              className="zen-button w-full"
            >
              <Search className="w-5 h-5 inline mr-2" />
              Buscar PDFs en esta Ruta
            </button>
          </div>

          <div className="mt-6 bg-zen-light p-4 rounded-lg">
            <p className="font-semibold mb-2">Ejemplos de rutas comunes:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><code>E:\</code> - Raíz del disco E</li>
              <li><code>E:\libros</code> - Carpeta libros en disco E</li>
              <li><code>D:\Documents\books</code> - Carpeta books en disco D</li>
              <li><code>F:\PDFs</code> - Carpeta PDFs en disco F</li>
            </ul>
          </div>
        </div>

        <div className="luxury-card bg-luxury-gold/10">
          <h3 className="font-bold mb-2">💡 Instrucciones:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Conecta tu disco duro externo</li>
            <li>Copia la ruta completa donde están los PDFs (ejemplo: <code>E:\libros</code>)</li>
            <li>Pégala en el campo de arriba</li>
            <li>O simplemente dime la ruta aquí en el chat y yo leeré los archivos directamente</li>
          </ol>
          <p className="mt-4 text-sm font-semibold">
            ⚡ <strong>Más fácil:</strong> Solo dime la ruta aquí en el chat, por ejemplo:<br/>
            <code className="bg-white px-2 py-1 rounded">"Lee los PDFs de E:\libros"</code><br/>
            Y yo los leeré automáticamente.
          </p>
        </div>
      </div>
    </div>
  )
}
