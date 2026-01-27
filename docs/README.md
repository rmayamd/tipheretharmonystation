# Documentación Técnica - Maya Harmony Station

## Cómo Agregar Libros PDF

### Opción 1: En la Carpeta del Proyecto (Más Fácil) ⭐
1. Coloca los PDFs directamente en la carpeta **"maya harmony station"**
2. Puedes ponerlos en la raíz o en `docs/books/`
3. Yo los encontraré automáticamente

**Ejemplo:** Si tienes `obagi.pdf` en la carpeta del proyecto, simplemente dime:
- "Lee obagi.pdf"
- O "Lee el archivo obagi.pdf del proyecto"

### Opción 2: En tu Escritorio
1. Coloca los PDFs directamente en tu escritorio
2. Dime los nombres de los archivos
3. Yo los leeré automáticamente desde: `C:\Users\usuario\Desktop\nombre_archivo.pdf`

**Ejemplo:** Si tienes `obagi.pdf` en el escritorio, simplemente dime:
- "Lee obagi.pdf del escritorio"
- O "Lee el archivo obagi.pdf"

### Opción 3: Usar el Explorador de Archivos
1. Navega a la carpeta del proyecto
2. Ve a `docs/books/`
3. Copia y pega tus archivos PDF ahí

### Opción 4: Desde Terminal
```bash
# Desde la raíz del proyecto
cp ruta/a/tu/libro.pdf docs/books/
```

## Archivos Esperados

Coloca los siguientes PDFs en `docs/books/`:

- **Obagi**: Libro sobre calidad de piel
- **Connell**: Libro sobre laxitud y Deep Plane
- **Triana**: Libro sobre estética íntima
- **Garcia Jr**: Libro sobre VASER
- **Ogawa**: Libro sobre prevención de queloides y tensión
- **Byung Pal Yu**: PDF de Epigenética
- **Base de Datos Luxury**: Archivo con datos de pacientes (CSV, JSON, o Excel)

## Estructura Recomendada

```
docs/
├── books/
│   ├── obagi.pdf
│   ├── connell.pdf
│   ├── triana.pdf
│   ├── garcia_jr.pdf
│   ├── ogawa.pdf
│   ├── yu_epigenetics.pdf
│   └── luxury_database.xlsx (o .csv, .json)
└── README.md (este archivo)
```

## Nota

Una vez que agregues los PDFs, la IA podrá:
- Leer y extraer información técnica
- Integrar conceptos en el código
- Mejorar los algoritmos de análisis
- Personalizar protocolos según los métodos descritos
