# Verifica tu billetito

🇬🇧 **English** | 🇪🇸 [**Español**](README.es.md)

Ionic/Angular application to verify if a Bolivian banknote is on the list of banknotes disabled by the Central Bank of Bolivia (BCB).

## 📋 Requirements

- **Node.js** 18+ ([download](https://nodejs.org/))
- **Java JDK** 17+ ([download](https://www.oracle.com/java/technologies/downloads/))
- **Android SDK** with API 34+ ([more info](https://developer.android.com/studio))
- **Gradle** 8.0+ (included in Android Studio)

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd billcheck
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Capacitor CLI (global, optional)

```bash
npm install -g @capacitor/cli
```

## 💻 Local Development

### Serve in browser

```bash
ng serve
```

Open http://localhost:4200 in your browser. The app will automatically reload when you make changes.

### Build for development

```bash
ng build
```

## 📱 Build for Android

### Automated Release Build

Build and sign APK and Android App Bundle for production (Play Store):

**Linux/macOS:**
```bash
./build-release.sh
```

**Windows:**
```cmd
build-release.bat
```

The script automatically:
1. Compiles Angular in production mode
2. Syncs Capacitor with Android
3. Compiles APK and AAB with Gradle
4. Signs both artifacts with the keystore

**Results:**
- `android/app/build/outputs/apk/release/app-release-signed.apk`
- `android/app/build/outputs/bundle/release/app-release.aab`

### Manual Steps

```bash
# 1. Compile Angular
ng build --configuration production

# 2. Sync Capacitor
npx cap sync android

# 3. Open Android Studio (optional)
npx cap open android

# 4. Build from Android Studio or CLI
cd android && ./gradlew assembleRelease

# 5. Sign APK (see .jks section below)
```

## 🔐 Generate .jks File (Keystore)

> **IMPORTANT:** The `.jks` file should not be uploaded to Git. It's already in `.gitignore`.

### If you need to recreate the keystore:

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

**Parameters:**
- `-alias billcheck` - Alias name (must match in `build-release.sh`)
- `-storepass billcheck2026` - Keystore password
- `-keypass billcheck2026` - Private key password
- `-validity 10000` - Days of validity (~27 years)
- `-dname` - Developer information (CN=name, OU=unit, O=organization, L=city, S=state, C=country)

### Verify the keystore:

```bash
keytool -list -v -keystore billcheck-release.jks -storepass billcheck2026
```

### ⚠️ Configuration in build-release.sh

The script uses these values. If you changed the password or alias, update:

```bash
KEYSTORE="billcheck-release.jks"
ALIAS="billcheck"
PASSWORD="billcheck2026"
```

## 📂 Project Structure

```
billcheck/
├── src/
│   ├── app/
│   │   ├── pages/          # App pages
│   │   ├── services/       # Services (camera, verification)
│   │   ├── constants/      # Constants and strings
│   │   ├── models/         # Types and interfaces
│   │   └── app.routes.ts   # Routes
│   ├── assets/             # Images, icons
│   ├── global.css          # Global styles
│   └── main.ts             # Entry point
├── android/                # Native Android project
├── capacitor.config.ts     # Capacitor configuration
├── package.json            # Dependencies
├── angular.json            # Angular configuration
├── tsconfig.json           # TypeScript configuration
├── build-release.sh        # Release build script (Linux/macOS)
├── build-release.bat       # Release build script (Windows)
└── billcheck-release.jks   # Keystore (DO NOT upload to Git ⚠️)
```
