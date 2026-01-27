# 🚀 Setup Completo - Maya Harmony Station

Guía paso a paso para configurar el sistema desde cero.

## ✅ Prerequisitos

- Node.js 18+ instalado
- Cuenta en Supabase (gratis)
- Editor de código (VS Code recomendado)

## 📦 Paso 1: Instalación

```bash
# Clonar o crear proyecto
cd maya-harmony-station

# Instalar dependencias
npm install
```

## 🗄️ Paso 2: Configurar Supabase

### 2.1 Crear Proyecto

1. Ir a [supabase.com](https://supabase.com)
2. Crear cuenta o iniciar sesión
3. Click "New Project"
4. Nombre: `maya-harmony-station`
5. Crear contraseña fuerte
6. Elegir región (más cercana a ti)

### 2.2 Ejecutar Migraciones

1. En Supabase, ir a: **SQL Editor**
2. Click "+ New Query"
3. Copiar **TODO** el contenido de:
   ```
   lib/supabase/migrations/001_initial_schema.sql
   ```
4. Pegar en el editor
5. Click "Run" (esquina inferior derecha)
6. ✅ Deberías ver: "Success. No rows returned"

### 2.3 Verificar Tablas

1. Ir a: **Table Editor** (menú lateral)
2. Deberías ver 15+ tablas:
   - patients
   - quantum_analysis
   - inbody_analysis
   - aesthetic_analysis
   - procedures
   - epigenetic_protocols
   - recovery_monitoring
   - interdrogas_orders
   - patient_journey
   - vital_value_calculations
   - image_tracking
   - crm_luxury
   - neurosales_tracking
   - maya_recommendations

### 2.4 Copiar Credenciales

1. Ir a: **Settings** → **API**
2. Copiar:
   - `Project URL`
   - `anon public` key

## 🔐 Paso 3: Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui

# Interdrogas (opcional, ya está hardcodeado)
INTERDROGAS_PHONE=6024873000
```

## 🎨 Paso 4: Verificar Instalación

```bash
# Ejecutar en modo desarrollo
npm run dev
```

Debería ver:
```
✓ Ready in X seconds
○ Local: http://localhost:3000
```

## 🧪 Paso 5: Probar Funcionalidades

### 5.1 Dashboard
1. Abrir: `http://localhost:3000`
2. Deberías ver la página principal con enlaces a todos los módulos

### 5.2 Cerebro Maya
1. Ir a: `http://localhost:3000/maya-brain`
2. Ingresar datos de prueba de InBody
3. Click "Analizar"
4. ✅ Deberías ver recomendaciones generadas

### 5.3 CRM
1. Ir a: `http://localhost:3000/crm`
2. Ver segmentos de pacientes
3. ✅ Scripts de neuroventas visibles

### 5.4 Maya-Vision
1. Ir a: `http://localhost:3000/maya-vision`
2. Subir imagen de prueba (cualquier foto)
3. ✅ Ver análisis simulado

## 📚 Paso 6: Agregar Libros PDF (Opcional)

### Opción A: Carpeta del Proyecto
```bash
# Crear carpeta books
mkdir docs/books

# Copiar PDFs allí
cp /ruta/a/tus/pdfs/*.pdf docs/books/
```

### Opción B: Rutas Absolutas
El sistema también busca en:
- `D:\` (disco D)
- `C:\Users\usuario\Desktop`
- `C:\Users\usuario\Downloads`

Los libros se documentan en:
- `docs/books/LIBROS_ENCONTRADOS.md`
- `docs/books/DESCARGAS_ENCONTRADOS.md`

## 🔍 Paso 7: API Routes

Probar endpoints API:

```bash
# Buscar en biblioteca
curl http://localhost:3000/api/search?q=collagen

# Buscar PDFs
curl http://localhost:3000/api/files/pdfs

# Buscar bases de datos
curl http://localhost:3000/api/files/database
```

## 🎯 Paso 8: Insertar Datos de Prueba

En Supabase SQL Editor:

```sql
-- Insertar paciente de prueba
INSERT INTO patients (name, email, phone, age, gender, segment, luxury_tier)
VALUES (
  'Juan Pérez',
  'juan@example.com',
  '3001234567',
  45,
  'M',
  'profesionales-activos',
  'premium'
);

-- Insertar análisis InBody
INSERT INTO inbody_analysis (
  patient_id,
  body_fat_percentage,
  muscle_mass,
  extracellular_water,
  phase_angle
)
VALUES (
  (SELECT id FROM patients WHERE email = 'juan@example.com'),
  22.5,
  32.8,
  0.38,
  6.2
);
```

## 🚀 Paso 9: Build para Producción

```bash
# Build
npm run build

# Ejecutar producción localmente
npm start
```

## ✅ Checklist de Verificación

- [ ] Node.js instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Proyecto Supabase creado
- [ ] Migraciones SQL ejecutadas
- [ ] Tablas visibles en Supabase
- [ ] `.env.local` creado con credenciales
- [ ] `npm run dev` funciona
- [ ] Dashboard carga correctamente
- [ ] Cerebro Maya genera recomendaciones
- [ ] API routes responden

## 🔧 Troubleshooting

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: "Supabase connection failed"
1. Verificar `.env.local` tiene las credenciales correctas
2. Verificar URL no tiene espacios o saltos de línea
3. Verificar anon key es la correcta (no la service_role)

### Error: "Table does not exist"
1. Ir a Supabase SQL Editor
2. Re-ejecutar `001_initial_schema.sql`
3. Verificar en Table Editor que las tablas existen

### Puerto 3000 ya en uso
```bash
# Usar otro puerto
npm run dev -- -p 3001
```

## 📖 Siguientes Pasos

1. **Leer documentación completa**: `docs/SISTEMA_COMPLETO.md`
2. **Explorar módulos**: Cada carpeta en `app/` y `lib/`
3. **Personalizar UI**: Modificar colores en `app/globals.css`
4. **Agregar más tratados**: Expandir `lib/maya-brain/comprehensive-knowledge.ts`
5. **Configurar producción**: Ver docs de Next.js para deploy

## 📞 Soporte

Si tienes problemas:
1. Revisar esta guía completa
2. Verificar `docs/SISTEMA_COMPLETO.md`
3. Contactar: soporte@mayaharmonystation.com

---

**¡Listo! Tu sistema Maya Harmony Station está funcionando 🎉**
