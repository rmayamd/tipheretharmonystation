# 🔌 Guía de Integración Real - De Simulación a Producción

## 🎯 Objetivo
Convertir las simulaciones en conexiones reales con hardware médico, base de datos, y servicios externos.

---

## 📋 ESTADO ACTUAL vs OBJETIVO

| Componente | Ahora (Simulado) | Objetivo (Real) |
|------------|------------------|-----------------|
| InBody H30 | `Math.random()` | API/Serial del dispositivo |
| Quantum Analyzer | Datos fake | Lectura serial real |
| Base de Datos | Sin conectar | Supabase configurado |
| Notificaciones | Console.log | Firebase FCM real |
| PDFs | Rutas hardcoded | Procesador PDF real |
| WhatsApp | Links básicos | WhatsApp Business API |
| Maya-Vision | Simulación | Procesamiento de imágenes real |

---

## 🔧 PASO 1: SUPABASE - BASE DE DATOS REAL

### A. Crear Proyecto Supabase

1. **Ir a**: https://supabase.com
2. **Crear cuenta** (gratis)
3. **New Project**:
   - Nombre: `maya-harmony-station`
   - Database Password: (guardar bien)
   - Región: `South America (São Paulo)` (más cercana)

### B. Ejecutar Migraciones

1. En Supabase, ir a **SQL Editor**
2. Copiar **TODO** el contenido de: `lib/supabase/migrations/001_initial_schema.sql`
3. Pegar y **Run**
4. ✅ Deberías ver: "Success. No rows returned"

### C. Configurar Credenciales

1. En Supabase, ir a **Settings** → **API**
2. Copiar:
   - `Project URL`
   - `anon public` key (NO service_role)

3. Crear archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

4. **Reiniciar el servidor**: Detener (Ctrl+C) y ejecutar `npm run dev`

### D. Conectar el Código

**Archivo ya listo**: `lib/supabase/client.ts`

Para usarlo en cualquier página:

```typescript
import { supabase } from '@/lib/supabase/client'

// Insertar paciente
const { data, error } = await supabase
  .from('patients')
  .insert({
    name: 'Juan Pérez',
    age: 45,
    email: 'juan@example.com'
  })

// Consultar pacientes
const { data: patients } = await supabase
  .from('patients')
  .select('*')
```

### E. Verificar Conexión

Agregar en `app/patient-app/page.tsx`:

```typescript
useEffect(() => {
  async function testConnection() {
    const { data, error } = await supabase
      .from('patients')
      .select('count')
    
    if (error) {
      console.error('❌ Error Supabase:', error)
    } else {
      console.log('✅ Supabase conectado. Pacientes:', data)
    }
  }
  testConnection()
}, [])
```

---

## 🔧 PASO 2: INBODY H30 - LECTURA REAL

### A. Conexión Serial

El InBody H30 se conecta por:
- **USB Serial** (más común)
- **Bluetooth** (algunos modelos)
- **WiFi** (modelos recientes)

### B. Instalar Librerías

```bash
npm install serialport
npm install @serialport/parser-readline
```

### C. Crear API Route para Lectura

**Archivo**: `app/api/inbody/read/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
// @ts-ignore
import { SerialPort } from 'serialport'
// @ts-ignore
import { ReadlineParser } from '@serialport/parser-readline'

export async function GET(request: NextRequest) {
  try {
    // Encontrar puerto del InBody (ajustar según tu dispositivo)
    const port = new SerialPort({
      path: 'COM3', // Windows: COM3, Mac: /dev/tty.usbserial, Linux: /dev/ttyUSB0
      baudRate: 9600,
    })
    
    const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))
    
    return new Promise((resolve) => {
      parser.on('data', (data: string) => {
        // Parsear datos del InBody
        const inbodyData = parseInBodyData(data)
        
        resolve(NextResponse.json({
          success: true,
          data: inbodyData,
        }))
        
        port.close()
      })
      
      // Timeout de 10 segundos
      setTimeout(() => {
        port.close()
        resolve(NextResponse.json({
          success: false,
          error: 'Timeout - No se recibieron datos del InBody',
        }, { status: 408 }))
      }, 10000)
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}

function parseInBodyData(rawData: string) {
  // El formato depende de tu modelo InBody
  // Ejemplo genérico:
  const lines = rawData.split('\n')
  
  return {
    bodyWeight: parseFloat(lines[0]) || 0,
    muscleMass: parseFloat(lines[1]) || 0,
    bodyFatPercentage: parseFloat(lines[2]) || 0,
    // ... más campos según tu dispositivo
  }
}
```

### D. Alternativa: API HTTP (si InBody tiene WiFi)

Si tu InBody tiene módulo WiFi:

```typescript
// app/api/inbody/read/route.ts
export async function GET() {
  try {
    const response = await fetch('http://192.168.1.100/api/data', {
      headers: {
        'Authorization': 'Bearer YOUR_INBODY_TOKEN'
      }
    })
    
    const inbodyData = await response.json()
    
    return NextResponse.json({
      success: true,
      data: inbodyData,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}
```

### E. Usar en el Frontend

```typescript
// En app/patient-app/page.tsx
const [inbodyData, setInbodyData] = useState(null)

async function readInBody() {
  const response = await fetch('/api/inbody/read')
  const result = await response.json()
  
  if (result.success) {
    setInbodyData(result.data)
    // Guardar en Supabase
    await supabase.from('inbody_analysis').insert({
      patient_id: currentPatientId,
      body_weight: result.data.bodyWeight,
      muscle_mass: result.data.muscleMass,
      // ... más campos
    })
  }
}
```

---

## 🔧 PASO 3: ANALIZADOR CUÁNTICO - LECTURA REAL

Similar al InBody, el Quantum Analyzer se conecta por USB Serial.

### A. Identificar Puerto

En Windows:
1. Device Manager → Ports (COM & LPT)
2. Buscar el puerto del Quantum Analyzer (ej: COM4)

### B. Crear API Route

**Archivo**: `app/api/quantum/read/route.ts`

```typescript
import { NextResponse } from 'next/server'
// @ts-ignore
import { SerialPort } from 'serialport'

export async function GET() {
  try {
    const port = new SerialPort({
      path: 'COM4', // Ajustar según tu dispositivo
      baudRate: 115200, // Quantum suele usar 115200
    })
    
    // El Quantum envía datos en formato binario
    let buffer = Buffer.alloc(0)
    
    return new Promise((resolve) => {
      port.on('data', (chunk: Buffer) => {
        buffer = Buffer.concat([buffer, chunk])
        
        // Cuando tengamos suficientes datos (ajustar según tu dispositivo)
        if (buffer.length >= 1024) {
          const quantumData = parseQuantumData(buffer)
          
          resolve(NextResponse.json({
            success: true,
            data: quantumData,
          }))
          
          port.close()
        }
      })
      
      setTimeout(() => {
        port.close()
        resolve(NextResponse.json({
          success: false,
          error: 'Timeout',
        }, { status: 408 }))
      }, 15000)
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}

function parseQuantumData(buffer: Buffer) {
  // El formato depende de tu modelo Quantum Analyzer
  // Usualmente vienen 53 parámetros en bytes específicos
  
  return {
    vitamins: {
      vitaminA: buffer.readFloatLE(0),
      vitaminB1: buffer.readFloatLE(4),
      vitaminB2: buffer.readFloatLE(8),
      // ... continuar según especificación
    },
    epigenetics: {
      collagenSynthesis: buffer.readFloatLE(200),
      nfkbInflammation: buffer.readFloatLE(204),
      // ... más campos
    },
    // ... resto de datos
  }
}
```

---

## 🔧 PASO 4: FIREBASE - NOTIFICACIONES PUSH REALES

### A. Crear Proyecto Firebase

1. **Ir a**: https://console.firebase.google.com
2. **Agregar proyecto**: `maya-harmony-station`
3. **Cloud Messaging** → Habilitar

### B. Obtener Credenciales

1. En Firebase Console → **Project Settings**
2. **General** → Your apps → **Web app** → Copiar config
3. **Cloud Messaging** → **Web Push certificates** → Generate key pair

### C. Configurar en el Proyecto

Agregar a `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=maya-harmony-station
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=tu_vapid_key
```

### D. Instalar SDK

```bash
npm install firebase
```

### E. Inicializar Firebase

**Archivo**: `lib/patient-app/firebase-config.ts`

```typescript
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

export { messaging }

// Solicitar permiso y obtener token
export async function requestPermissionAndGetToken() {
  try {
    const permission = await Notification.requestPermission()
    
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      })
      
      console.log('✅ FCM Token:', token)
      return token
    }
  } catch (error) {
    console.error('Error obteniendo token:', error)
  }
  return null
}

// Escuchar notificaciones en foreground
export function setupMessageListener(callback: (payload: any) => void) {
  onMessage(messaging, (payload) => {
    console.log('📬 Notificación recibida:', payload)
    callback(payload)
  })
}
```

### F. Enviar Push desde Backend

**Archivo**: `app/api/push/send/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import admin from 'firebase-admin'

// Inicializar Firebase Admin (solo backend)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

export async function POST(request: NextRequest) {
  try {
    const { tokens, title, body, deepLink } = await request.json()
    
    const message = {
      notification: {
        title,
        body,
      },
      data: {
        deepLink,
      },
      tokens, // Array de FCM tokens
    }
    
    const response = await admin.messaging().sendEachForMulticast(message)
    
    return NextResponse.json({
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}
```

---

## 🔧 PASO 5: PROCESADOR DE PDFs REAL

### A. Instalar Librería

```bash
npm install pdf-parse
```

### B. Crear Procesador

**Archivo**: `lib/knowledge/pdf-processor-real.ts`

```typescript
import pdf from 'pdf-parse'
import { readFile } from 'fs/promises'

export async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    const dataBuffer = await readFile(filePath)
    const data = await pdf(dataBuffer)
    
    return data.text
  } catch (error) {
    console.error('Error procesando PDF:', error)
    return ''
  }
}

export async function indexPDFContent(filePath: string) {
  const text = await extractTextFromPDF(filePath)
  
  // Extraer conceptos clave
  const concepts = extractKeyConcepts(text)
  
  // Guardar en base de datos
  const fileName = filePath.split('/').pop()
  
  await supabase.from('pdf_library').insert({
    file_name: fileName,
    file_path: filePath,
    content: text,
    concepts: concepts,
    indexed_at: new Date(),
  })
  
  return concepts
}

function extractKeyConcepts(text: string): string[] {
  const concepts: string[] = []
  
  // Palabras clave médicas
  const keywords = [
    'colágeno', 'collagen',
    'epigenética', 'epigenetic',
    'inflamación', 'inflammation',
    'simetría', 'symmetry',
    // ... agregar más
  ]
  
  keywords.forEach(keyword => {
    const regex = new RegExp(`${keyword}[^.]*\\.`, 'gi')
    const matches = text.match(regex)
    if (matches) {
      concepts.push(...matches)
    }
  })
  
  return concepts
}
```

### C. API para Procesar PDFs

**Archivo**: `app/api/pdfs/process/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { indexPDFContent } from '@/lib/knowledge/pdf-processor-real'
import { BOOK_PATHS } from '@/lib/knowledge/book-paths'

export async function POST(request: NextRequest) {
  try {
    const { bookKey } = await request.json()
    
    // Obtener ruta del libro
    const bookPath = BOOK_PATHS[bookKey as keyof typeof BOOK_PATHS]
    
    if (!bookPath) {
      return NextResponse.json({
        success: false,
        error: 'Libro no encontrado',
      }, { status: 404 })
    }
    
    // Procesar PDF
    const concepts = await indexPDFContent(bookPath as string)
    
    return NextResponse.json({
      success: true,
      bookKey,
      conceptsFound: concepts.length,
      concepts: concepts.slice(0, 10), // Primeros 10 como muestra
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}
```

---

## 🔧 PASO 6: WHATSAPP BUSINESS API

### Opción A: WhatsApp Business API Oficial (Complejo pero oficial)

1. **Crear cuenta**: https://business.whatsapp.com
2. **Solicitar acceso** a Business API
3. **Verificar negocio**
4. **Obtener credenciales**

### Opción B: Twilio (Más fácil, recomendado)

```bash
npm install twilio
```

**Archivo**: `app/api/whatsapp/send/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json()
    
    const result = await client.messages.create({
      from: 'whatsapp:+14155238886', // Twilio Sandbox
      to: `whatsapp:+57${to}`,
      body: message,
    })
    
    return NextResponse.json({
      success: true,
      messageSid: result.sid,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}
```

### Opción C: Baileys (Open Source, sin límites)

```bash
npm install @whiskeysockets/baileys
```

Requiere configuración más compleja pero es completamente gratis.

---

## 📊 PLAN DE IMPLEMENTACIÓN GRADUAL

### Fase 1: BASE DE DATOS (1-2 días)
- ✅ Configurar Supabase
- ✅ Ejecutar migraciones
- ✅ Conectar frontend
- ✅ Probar CRUD pacientes

### Fase 2: HARDWARE MÉDICO (3-5 días)
- ⏳ Conectar InBody H30
- ⏳ Conectar Quantum Analyzer
- ⏳ Guardar lecturas en Supabase
- ⏳ Validar datos

### Fase 3: NOTIFICACIONES (2-3 días)
- ⏳ Configurar Firebase
- ⏳ Implementar FCM
- ⏳ Probar pushes
- ⏳ Integrar scheduler

### Fase 4: PROCESAMIENTO PDFs (2-3 días)
- ⏳ Instalar pdf-parse
- ⏳ Procesar libros principales
- ⏳ Indexar contenido
- ⏳ Mejorar búsqueda

### Fase 5: WHATSAPP (1-2 días)
- ⏳ Configurar Twilio o Baileys
- ⏳ Integrar envío automático
- ⏳ Probar órdenes Interdrogas

### Fase 6: MAYA-VISION REAL (5-7 días)
- ⏳ Procesamiento de imágenes
- ⏳ Análisis facial real
- ⏳ Integración IA/ML

---

## 🎯 PRIORIDADES INMEDIATAS

### Esta Semana:
1. ✅ **Supabase** - Base de datos funcional
2. ⏳ **InBody** - Lectura real del dispositivo
3. ⏳ **Guardar pacientes** - CRUD completo

### Próxima Semana:
4. ⏳ **Firebase** - Notificaciones reales
5. ⏳ **Quantum** - Lectura del dispositivo
6. ⏳ **PDFs** - Procesamiento básico

---

## 📝 CHECKLIST DE INTEGRACIÓN

```
SUPABASE
[ ] Proyecto creado
[ ] Migraciones ejecutadas
[ ] .env.local configurado
[ ] Conexión verificada
[ ] Primera inserción exitosa

INBODY H30
[ ] Dispositivo conectado
[ ] Puerto serial identificado
[ ] Lectura exitosa
[ ] Datos guardados en Supabase

QUANTUM ANALYZER
[ ] Dispositivo conectado
[ ] Puerto serial identificado
[ ] Lectura exitosa
[ ] 53 parámetros capturados

FIREBASE FCM
[ ] Proyecto creado
[ ] SDK instalado
[ ] Token FCM obtenido
[ ] Primera notificación enviada

PDFs
[ ] pdf-parse instalado
[ ] Primer PDF procesado
[ ] Contenido indexado

WHATSAPP
[ ] Cuenta configurada
[ ] Primer mensaje enviado
[ ] Orden a Interdrogas enviada
```

---

**¿Por dónde empezamos? Te recomiendo SUPABASE primero** 💪
