# Verifica tu billetito

🇪🇸 **Español** | 🇬🇧 [**English**](README.md)

Aplicación Ionic/Angular para verificar si un billete boliviano está en la lista de billetes inhabilitados por el Banco Central de Bolivia (BCB).

## 📋 Requisitos

- **Node.js** 18+ ([descargar](https://nodejs.org/))
- **Java JDK** 17+ ([descargar](https://www.oracle.com/java/technologies/downloads/))
- **Android SDK** con API 34+ ([más info](https://developer.android.com/studio))
- **Gradle** 8.0+ (incluido en Android Studio)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd billcheck
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Instalar Capacitor CLI (global, opcional)

```bash
npm install -g @capacitor/cli
```

## 💻 Desarrollo Local

### Servir en navegador

```bash
ng serve
```

Abre http://localhost:4200 en tu navegador. La app se recargará automáticamente al realizar cambios.

### Compilar para desarrollo

```bash
ng build
```

## 📱 Construir APK para Android

### Opción 1: Script Automatizado (Recomendado)

**Linux/macOS:**
```bash
./build-apk.sh
```

**Windows:**
```cmd
build-apk.bat
```

El script automáticamente:
1. Compila Angular en modo producción
2. Sincroniza Capacitor con Android
3. Compila el APK con Gradle
4. Firma el APK con la keystore

**Resultado:** `android/app/build/outputs/apk/release/app-release-signed.apk`

### Opción 2: Pasos Manuales

```bash
# 1. Compilar Angular
ng build --configuration production

# 2. Sincronizar Capacitor
npx cap sync android

# 3. Abrir Android Studio (opcional)
npx cap open android

# 4. Compilar desde Android Studio o CLI
cd android && ./gradlew assembleRelease

# 5. Firmar APK (ver sección de .jks abajo)
```

## 🔐 Generar Archivo .jks (Keystore)

> **IMPORTANTE:** El archivo `.jks` no debe subirse a Git. Ya está en `.gitignore`.

### Si necesitas recrear la keystore:

```bash
keytool -genkey -v -keystore billcheck-release.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias billcheck \
  -storepass billcheck2026 \
  -keypass billcheck2026 \
  -dname "CN=Verifica tu billetito, OU=Development, O=Verifica tu billetito, L=La Paz, S=La Paz, C=BO"
```

**Parámetros:**
- `-alias billcheck` - Nombre del alias (debe coincidir en `build-apk.sh`)
- `-storepass billcheck2026` - Contraseña de la keystore
- `-keypass billcheck2026` - Contraseña de la clave privada
- `-validity 10000` - Días de validez (~27 años)
- `-dname` - Información del desarrollador (CN=nombre, OU=unidad, O=organización, L=ciudad, S=estado, C=país)

### Verificar la keystore:

```bash
keytool -list -v -keystore billcheck-release.jks -storepass billcheck2026
```

### ⚠️ Configuración en build-apk.sh

El script usa estos valores. Si cambiaste la contraseña o alias, actualiza:

```bash
KEYSTORE="billcheck-release.jks"
ALIAS="billcheck"
PASSWORD="billcheck2026"
```

## 📂 Estructura del Proyecto

```
billcheck/
├── src/
│   ├── app/
│   │   ├── pages/          # Páginas de la app
│   │   ├── services/       # Servicios (cámara, verificación)
│   │   ├── constants/      # Constantes y strings
│   │   ├── models/         # Tipos e interfaces
│   │   └── app.routes.ts   # Rutas
│   ├── assets/             # Imágenes, iconos
│   ├── global.css          # Estilos globales
│   └── main.ts             # Punto de entrada
├── android/                # Proyecto Android nativo
├── capacitor.config.ts     # Configuración de Capacitor
├── package.json            # Dependencias
├── angular.json            # Configuración de Angular
├── tsconfig.json           # Configuración de TypeScript
├── build-apk.sh            # Script de construcción APK (Linux/macOS)
├── build-apk.bat           # Script de construcción APK (Windows)
└── billcheck-release.jks   # Keystore (NO subir a Git ⚠️)
```

