/**
 * TIPHERETH HARMONY STATION - Motor de Conocimiento en la Nube
 * Este archivo reemplaza el acceso a disco local (D:\) por Google Drive API.
 */

export const GOOGLE_DRIVE_LIBRARY_ID = '1HzMCXiH5OcRZ2ZO58xOXjRejDvgco2hO';

export interface MedicalBook {
  id: string;
  name: string;
  category: 'anatomy' | 'dermatology' | 'aesthetics' | 'epigenetics';
  driveId?: string; // Se llena dinámicamente desde la API
}

// Estructura de la biblioteca (IDs de archivos específicos si se conocen, 
// o se pueden buscar por nombre dentro del folder ID)
export const MEDICAL_LIBRARY: MedicalBook[] = [
  { id: 'obagi_skin', name: 'Obagi - Skin Health', category: 'dermatology' },
  { id: 'connell_facelift', name: 'Connell - Facelift Technique', category: 'aesthetics' },
  { id: 'park_rhinoplasty', name: 'Park - Asian Rhinoplasty', category: 'anatomy' },
  // La IA de Cursor puede ayudarte a expandir esta lista con los 600 títulos
];

/**
 * Utility para obtener el contenido de un libro desde la API de Drive.
 * NOTA: Ya no usamos 'fs'. Usamos fetch a una API Route de Next.js.
 */
export async function fetchBookMetadata(bookId: string) {
  try {
    const response = await fetch(`/api/drive/books?folderId=${GOOGLE_DRIVE_LIBRARY_ID}&bookId=${bookId}`);
    if (!response.ok) throw new Error('Error consultando la biblioteca en la nube');
    return await response.json();
  } catch (error) {
    console.error('Error en Cerebro Maya:', error);
    return null;
  }
}
