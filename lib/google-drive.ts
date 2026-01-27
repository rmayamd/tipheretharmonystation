import { google } from 'googleapis';

/**
 * MOTOR NEURONAL TIPHERETH - CONEXIÓN DRIVE
 * Versión blindada contra errores de argumentos (v2026)
 */
export async function getGoogleDriveClient() {
  const email = process.env.GOOGLE_CLIENT_EMAIL; 
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!email || !key) {
    throw new Error('CONFIGURACIÓN INCOMPLETA: Faltan llaves de Google en el servidor.');
  }

  // REFACTORIZACIÓN: Uso de objeto único para evitar error de argumentos
  const auth = new google.auth.JWT({
    email: email,
    key: key,
    scopes: ['https://www.googleapis.com/auth/drive.readonly']
  });

  return google.drive({ version: 'v3', auth });
}

/**
 * Función Genérica para listar archivos (La que busca file-locator.ts)
 */
export async function listDriveFiles(folderId: string) {
  try {
    const drive = await getGoogleDriveClient();
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, size, mimeType)',
    });

    return response.data.files || [];
  } catch (error) {
    console.error('ERROR LISTANDO DRIVE:', error);
    return [];
  }
}

/**
 * Escanea la carpeta de libros (Mantenemos esta por compatibilidad)
 */
export async function listMedicalLibrary() {
  try {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    if (!folderId) return [];
    return await listDriveFiles(folderId);
  } catch (error) {
    console.error('ERROR EN MOTOR LIBROS:', error);
    return [];
  }
}