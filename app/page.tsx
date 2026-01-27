/**
 * Tipheret Harmony Station - Home (redirige a landing pública)
 */

import { redirect } from 'next/navigation'

export default function Home() {
  // Redirigir automáticamente a la landing page pública
  redirect('/landing')
}
