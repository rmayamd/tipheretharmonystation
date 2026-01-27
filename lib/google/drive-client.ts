import { google } from 'googleapis'

/**
 * Cliente de Google Drive para acceder a la biblioteca en la nube
 */
export async function getDriveClient() {
  // Verificación de seguridad para variables de entorno
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    throw new Error('⚠️ Faltan credenciales de Google Drive en las variables de entorno');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  })

  // Retornamos el cliente tipado como any para evitar conflictos de versiones en el build
  return google.drive({ version: 'v3', auth }) as any;
}

/**
 * Lista los archivos de una carpeta específica en Google Drive
 */
export async function listDriveFiles(folderId: string) {
  try {
    const drive = await getDriveClient()
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, size, mimeType)',
    })

    return response.data.files || []
  } catch (error) {
    console.error('Error listando archivos de Google Drive:', error)
    return []; // Retornamos arreglo vacío en lugar de romper el flujo
  }
}

/**
 * Descarga o lee el contenido de un archivo de Google Drive
 */
export async function getFileContent(fileId: string) {
  try {
    const drive = await getDriveClient()
    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    )
    return response.data
  } catch (error) {
    console.error('Error obteniendo contenido del archivo:', error)
    throw error
  }
}