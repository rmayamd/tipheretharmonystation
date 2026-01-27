import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

/**
 * API Route para consultar la biblioteca de Google Drive (Lado del Servidor)
 * Esto soluciona el error de 'fs' al mover la lógica fuera del navegador.
 */
export async function GET(request: NextRequest) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  const drive = google.drive({ version: 'v3', auth });

  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId') || '1HzMCXiH5OcRZ2ZO58xOXjRejDvgco2hO';
    const bookId = searchParams.get('bookId');

    let query = `'${folderId}' in parents and trashed = false`;
    if (bookId) {
      query += ` and name contains '${bookId}'`;
    }

    const response = await drive.files.list({
      q: query,
      fields: 'files(id, name, webViewLink, iconLink)',
    });

    // Si se pidió un libro específico, devolver solo el primero o un objeto
    if (bookId && response.data.files && response.data.files.length > 0) {
      return NextResponse.json(response.data.files[0]);
    }

    return NextResponse.json(response.data.files || []);
  } catch (error: any) {
    console.error('Error en API Drive:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
