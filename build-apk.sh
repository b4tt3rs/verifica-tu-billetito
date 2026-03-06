#!/bin/bash
set -e

KEYSTORE="billcheck-release.jks"
ALIAS="billcheck"
PASSWORD="billcheck2026"
APK_DIR="android/app/build/outputs/apk/release"
APKSIGNER="$HOME/Android/Sdk/build-tools/35.0.0/apksigner"

echo "▶ 1/4  Build Angular..."
npx ng build --configuration production

echo "▶ 2/4  Sync Capacitor..."
npx cap sync android

echo "▶ 3/4  Compilar APK..."
(cd android && ./gradlew assembleRelease)

echo "▶ 4/4  Firmar APK..."
$APKSIGNER sign \
  --ks "$KEYSTORE" \
  --ks-key-alias "$ALIAS" \
  --ks-pass "pass:$PASSWORD" \
  --key-pass "pass:$PASSWORD" \
  --out "$APK_DIR/app-release-signed.apk" \
  "$APK_DIR/app-release-unsigned.apk"

echo ""
echo "✔ APK listo: $APK_DIR/app-release-signed.apk"
echo "  Tamaño: $(du -h "$APK_DIR/app-release-signed.apk" | cut -f1)"
