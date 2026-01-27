/**
 * Localizador de archivos en Google Drive
 * Reemplaza la búsqueda local con acceso a la nube
 */

import { listDriveFiles } from '../google-drive' // Asegúrate de que la ruta sea correcta

export interface FileLocation {
  path: string // Ahora será el File ID de Google Drive
  name: string
  size: number
  type: 'pdf' | 'excel' | 'csv' | 'json'
}

const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '1HzMCXiH5OcRZ2ZO58xOXjRejDvgco2hO'

/**
 * Busca archivos PDF en la carpeta de Google Drive
 */
export async function findPDFFiles(): Promise<FileLocation[]> {
  try {
    const files = await listDriveFiles(GOOGLE_DRIVE_FOLDER_ID)
    
    // Agregamos (f: any) para que Netlify no falle por tipos implícitos
    return files
      .filter((f: any) => f.name?.toLowerCase().endsWith('.pdf'))
      .map((f: any) => ({
        path: f.id || '',
        name: f.name || 'Sin nombre',
        size: parseInt(f.size || '0'),
        type: 'pdf',
      }))
  } catch (error) {
    console.error('Error en findPDFFiles (Google Drive):', error)
    return []
  }
}

/**
 * Busca archivos de base de datos en Google Drive
 */
export async function findDatabaseFiles(): Promise<FileLocation[]> {
  try {
    const files = await listDriveFiles(GOOGLE_DRIVE_FOLDER_ID)
    const extensions = ['.xlsx', '.xls', '.csv', '.json']

    return files
      .filter((f: any) => {
        const name = f.name?.toLowerCase() || ''
        return extensions.some(ext => name.endsWith(ext))
      })
      .map((f: any) => {
        const name = f.name || ''
        const ext = name.toLowerCase().substring(name.lastIndexOf('.'))
        
        let type: 'excel' | 'csv' | 'json' = 'excel'
        if (ext === '.csv') type = 'csv'
        else if (ext === '.json') type = 'json'

        return {
          path: f.id || '',
          name: name,
          size: parseInt(f.size || '0'),
          type,
        }
      })
  } catch (error) {
    console.error('Error en findDatabaseFiles (Google Drive):', error)
    return []
  }
}

/**
 * Busca un archivo específico por nombre en Google Drive
 */
export async function findFileByName(fileName: string): Promise<FileLocation | null> {
  try {
    const files = await listDriveFiles(GOOGLE_DRIVE_FOLDER_ID)
    const file = files.find((f: any) => f.name?.toLowerCase() === fileName.toLowerCase())

    if (!file) return null

    const name = file.name || ''
    const ext = name.toLowerCase().substring(name.lastIndexOf('.'))
    let type: 'pdf' | 'excel' | 'csv' | 'json' = 'pdf'
    if (ext === '.xlsx' || ext === '.xls') type = 'excel'
    else if (ext === '.csv') type = 'csv'
    else if (ext === '.json') type = 'json'

    return {
      path: file.id || '',
      name: name,
      size: parseInt(file.size || '0'),
      type,
    }
  } catch (error) {
    console.error('Error en findFileByName (Google Drive):', error)
    return null
  }
}