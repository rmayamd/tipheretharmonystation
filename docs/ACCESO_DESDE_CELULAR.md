# 📱 ACCESO A TIPHERET DESDE CELULAR/TABLET

## ⚠️ **REQUISITO PREVIO: NODE.JS INSTALADO**

**SIN NODE.JS INSTALADO, NADA FUNCIONARÁ** (ni en PC ni en celular).

**Primero instala Node.js:** https://nodejs.org/

---

## 🌐 **CONFIGURACIÓN PARA ACCESO EN RED LOCAL**

### **Paso 1: Asegurar que PC y celular estén en la misma red WiFi**

Tu PC y tu celular **DEBEN** estar conectados a la **misma red WiFi**.

Ejemplos:
- ✅ Ambos en: "WiFi_Casa"
- ✅ Ambos en: "MOVISTAR_1234"
- ❌ PC en WiFi, celular en datos móviles
- ❌ PC en WiFi casa, celular en WiFi vecino

---

### **Paso 2: Obtener la IP local de tu PC**

**En Windows:**

1. Presiona **Windows + R**
2. Escribe: `cmd`
3. Presiona Enter
4. Escribe:
```bash
ipconfig
```

5. Busca la sección que dice:
```
Wireless LAN adapter Wi-Fi:

   Connection-specific DNS Suffix  . :
   IPv4 Address. . . . . . . . . . . : 192.168.1.105
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1
```

**ANOTA el número IPv4 Address** (ejemplo: `192.168.1.105`)

**Tu IP será algo como:**
- `192.168.1.X` (más común)
- `192.168.0.X`
- `10.0.0.X`

---

### **Paso 3: Configurar Firewall de Windows**

Windows puede bloquear conexiones entrantes. Necesitas permitir Node.js:

1. Presiona **Windows + R**
2. Escribe: `firewall.cpl`
3. Click en **"Permitir una aplicación o característica a través de Firewall de Windows"**
4. Click en **"Cambiar la configuración"**
5. Click en **"Permitir otra aplicación..."**
6. Click en **"Examinar..."**
7. Navega a donde está instalado Node.js (usualmente):
   ```
   C:\Program Files\nodejs\node.exe
   ```
8. Selecciona `node.exe`
9. Click **"Agregar"**
10. **MARCA AMBAS CASILLAS:** "Privada" y "Pública"
11. Click **"Aceptar"**

---

### **Paso 4: Iniciar el servidor en modo red**

El archivo `INICIAR_SERVIDOR.bat` ya está configurado para modo red.

1. Haz **doble clic** en:
```
INICIAR_SERVIDOR.bat
```

2. Espera a ver:
```
✓ Ready in X.Xs
○ Local:        http://localhost:3000
○ Network:      http://192.168.1.105:3000
```

**ANOTA la dirección "Network"** - esa es la que usarás en el celular.

---

### **Paso 5: Acceder desde el celular**

En tu celular:

1. Abre el navegador (Chrome, Safari, Firefox, etc.)
2. En la barra de dirección, escribe:
```
http://TU_IP_LOCAL:3000/maya-bio-mirror
```

**Ejemplo real:**
```
http://192.168.1.105:3000/maya-bio-mirror
```

3. Presiona Enter

**Deberías ver TIPHERET HARMONY STATION** ✨

---

## 🔧 **SOLUCIÓN DE PROBLEMAS**

### **Problema 1: "No se puede acceder al sitio"**

**Verificar:**
- ✅ ¿PC y celular en la misma WiFi?
- ✅ ¿El servidor está corriendo en la PC?
- ✅ ¿La IP es correcta?
- ✅ ¿Escribiste `:3000` después de la IP?
- ✅ ¿Firewall configurado?

**Solución rápida:**
```bash
# En CMD de la PC, ejecuta:
ipconfig
ping 192.168.1.105 (tu IP)
```

---

### **Problema 2: "ERR_CONNECTION_REFUSED"**

**Causa:** El servidor no está corriendo o está bloqueado.

**Solución:**
1. Reinicia el servidor en la PC
2. Verifica el Firewall
3. Temporalmente, **desactiva el Firewall** para probar:
   - Windows + R
   - Escribe: `firewall.cpl`
   - Click en "Activar o desactivar Firewall de Windows"
   - Desactiva temporalmente
   - Prueba acceder desde celular
   - **Si funciona:** El problema es el Firewall, configúralo como en Paso 3
   - **Vuelve a activar el Firewall después**

---

### **Problema 3: "Página en blanco"**

**Causa:** El servidor está corriendo pero hay errores de compilación.

**Solución:**
1. Mira la ventana CMD donde corre el servidor
2. ¿Hay errores en rojo?
3. Si los hay, copia el error y consúltalo

---

### **Problema 4: "Muy lento desde el celular"**

**Causa:** Red WiFi lenta o saturada.

**Solución:**
- Acércate al router
- Reinicia el router
- Cierra otras apps que usen internet en el celular

---

## 📱 **AGREGAR A PANTALLA DE INICIO (PWA)**

Una vez que funcione, puedes agregarlo como "app" en tu celular:

### **Android (Chrome):**
1. Abre el sitio
2. Menú (3 puntos arriba a la derecha)
3. "Agregar a pantalla de inicio"
4. Dale un nombre: "Tipheret"
5. Ahora tendrás un ícono como una app

### **iOS (Safari):**
1. Abre el sitio
2. Botón de compartir (cuadro con flecha)
3. "Agregar a pantalla de inicio"
4. Dale un nombre: "Tipheret"
5. Listo

---

## 🌍 **ACCESO DESDE INTERNET (NO SOLO RED LOCAL)**

Si quieres acceder desde **CUALQUIER LUGAR** (no solo tu WiFi):

### **Opciones:**

#### **Opción 1: Ngrok (Gratis y fácil)**
```bash
# 1. Instalar ngrok: https://ngrok.com/download
# 2. Ejecutar:
ngrok http 3000

# 3. Te dará una URL como:
# https://abc123.ngrok.io
# Esta URL funciona desde cualquier lugar del mundo
```

#### **Opción 2: Cloudflare Tunnel (Gratis)**
```bash
npm install -g cloudflared
cloudflared tunnel --url http://localhost:3000
```

#### **Opción 3: Deploy en producción**
- Vercel (recomendado para Next.js)
- Netlify
- Railway
- Render

---

## 🔒 **SEGURIDAD**

### **⚠️ IMPORTANTE:**

Cuando expongas el servidor en red local:

1. **NO lo uses con datos reales de pacientes** (a menos que sea producción segura)
2. **Agrega autenticación** para red local
3. **Usa HTTPS** para producción
4. **No expongas directamente a internet** sin seguridad

---

## ✅ **CHECKLIST RÁPIDO**

Para acceso desde celular:

- [ ] Node.js instalado en PC
- [ ] PC y celular en misma WiFi
- [ ] IP local de PC anotada (ej: 192.168.1.105)
- [ ] Firewall configurado (node.exe permitido)
- [ ] Servidor corriendo (INICIAR_SERVIDOR.bat)
- [ ] En celular: http://IP_PC:3000/maya-bio-mirror
- [ ] ¡Funciona! ✨

---

## 📞 **COMANDOS ÚTILES**

```bash
# Ver IP de la PC
ipconfig

# Verificar que el servidor esté escuchando
netstat -an | findstr :3000

# Ping a tu propia IP (verificar conectividad)
ping 192.168.1.105

# Verificar firewall (PowerShell como admin)
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*Node*"}
```

---

## 🎯 **RESUMEN VISUAL**

```
┌─────────────────────┐
│   PC (Servidor)     │
│                     │
│  192.168.1.105:3000 │ ⬅─── Servidor corriendo
│  Node.js + Next.js  │
└──────────┬──────────┘
           │
           │ WiFi: "CASA_123"
           │
     ┌─────┴─────┐
     │           │
┌────▼────┐ ┌───▼────┐
│ Celular │ │ Tablet │
│         │ │        │
│ Safari  │ │ Chrome │
└─────────┘ └────────┘

Todos acceden a: http://192.168.1.105:3000
```

---

**Creado para Tipheret Harmony Station**  
*Acceso multiplataforma para diagnóstico estético* 📱✨

Φ = 1.618 ∞ תפארת
