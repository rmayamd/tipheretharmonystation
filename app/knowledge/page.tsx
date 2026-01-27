'use client'

import { useState, useEffect } from 'react'
import { Book, Database, Cloud, CheckCircle, Folder, ExternalLink } from 'lucide-react'

export default function KnowledgePage() {
  const [driveFiles, setDriveFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDriveFiles()
  }, [])

  const fetchDriveFiles = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/files/pdfs')
      const data = await response.json()
      if (data.success) {
        setDriveFiles(data.files)
      }
    } catch (error) {
      console.error('Error cargando archivos de Drive:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen zen-gradient p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zen-dark mb-2">
            Centro de Conocimiento (Nube)
          </h1>
          <p className="text-lg text-zen-secondary">
            Biblioteca Tipheret sincronizada con Google Drive
          </p>
        </div>

        {/* Información sobre Google Drive */}
        <div className="luxury-card mb-6 bg-blue-50 border-l-4 border-blue-500">
          <h3 className="font-bold mb-2 flex items-center text-blue-900">
            <Cloud className="w-5 h-5 mr-2" />
            Sincronización con Google Drive
          </h3>
          <p className="text-sm text-blue-800 mb-4">
            Los archivos se leen directamente de tu carpeta compartida en Google Drive (tipherethcenter.com).
            No es necesario subir archivos localmente.
          </p>
          <a 
            href="https://drive.google.com/drive/u/2/folders/1B_QKZO7NYmip_uPy_Md3z0fi-yzsw_ah" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-bold flex items-center text-blue-600 hover:text-blue-800"
          >
            Abrir Carpeta en Google Drive <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>

        {/* Lista de Libros en Drive */}
        <div className="luxury-card mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Book className="w-6 h-6 mr-2" />
            Biblioteca en la Nube
          </h2>
          <p className="text-sm text-luxury-dark/70 mb-4">
            Libros detectados en tu carpeta de Google Drive
          </p>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin text-zen-primary mb-2">⚙️</div>
              <p className="text-sm text-gray-500">Sincronizando con Drive...</p>
            </div>
          ) : driveFiles.length > 0 ? (
            <div className="space-y-2">
              {driveFiles.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <div className="font-semibold text-sm">{file.name}</div>
                      <div className="text-xs text-gray-500">ID: {file.path}</div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">
                    PDF
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <p className="text-gray-500">No se encontraron archivos en la carpeta de Drive.</p>
              <button 
                onClick={fetchDriveFiles}
                className="mt-4 text-sm font-bold text-zen-primary hover:underline"
              >
                Reintentar sincronización
              </button>
            </div>
          )}
        </div>

        {/* Instrucciones Nube */}
        <div className="luxury-card bg-zen-light">
          <h3 className="font-bold mb-2">📋 Cómo funciona:</h3>
          <div className="space-y-3 text-sm">
            <p>
              1. <strong>Sube tus archivos</strong> a la carpeta de Google Drive indicada arriba.
            </p>
            <p>
              2. <strong>Recarga esta página</strong> y el sistema detectará automáticamente los nuevos libros.
            </p>
            <p>
              3. <strong>Análisis Automático:</strong> El Cerebro Maya consultará estos archivos en tiempo real para generar diagnósticos basados en la evidencia de Obagi, Connell, Yu, etc.
            </p>
            <div className="bg-luxury-gold/20 p-3 rounded-lg mt-4">
              <p className="font-semibold">🔐 Seguridad:</p>
              <p>El acceso es privado y seguro usando las credenciales de tipherethcenter.com.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
