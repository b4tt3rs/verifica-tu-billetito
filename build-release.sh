#!/bin/bash
set -e

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
KEYSTORE="${KEYSTORE:-billcheck-release.jks}"
ALIAS="${ALIAS:-billcheck}"
PASSWORD="${PASSWORD:-billcheck2026}"

# Paths
APK_DIR="android/app/build/outputs/apk/release"
AAB_DIR="android/app/build/outputs/bundle/release"

# Detect build tools path
if [ -z "$ANDROID_SDK_ROOT" ]; then
  ANDROID_SDK_ROOT="$HOME/Android/Sdk"
fi
APKSIGNER="$ANDROID_SDK_ROOT/build-tools/35.0.0/apksigner"

# Check if keystore exists
if [ ! -f "$KEYSTORE" ]; then
  echo -e "${YELLOW}⚠ Keystore not found: $KEYSTORE${NC}"
  echo "Skipping signing step (CI/CD environment?)"
  SKIP_SIGNING=true
fi

echo ""
echo -e "${BLUE}====================================${NC}"
echo -e "${BLUE}  Verifica tu billetito - Release${NC}"
echo -e "${BLUE}====================================${NC}"
echo ""

# Step 1: Build Angular
echo -e "${BLUE}▶ 1/5  Build Angular (production)...${NC}"
npx ng build --configuration production
echo -e "${GREEN}✔ Angular built${NC}"
echo ""

# Step 2: Sync Capacitor
echo -e "${BLUE}▶ 2/5  Sync Capacitor...${NC}"
npx cap sync android
echo -e "${GREEN}✔ Capacitor synced${NC}"
echo ""

# Step 3: Build APK
echo -e "${BLUE}▶ 3/5  Build APK (release)...${NC}"
(cd android && ./gradlew assembleRelease)
echo -e "${GREEN}✔ APK built${NC}"
echo ""

# Step 4: Build AAB
echo -e "${BLUE}▶ 4/5  Build AAB (release)...${NC}"
(cd android && ./gradlew bundleRelease)
echo -e "${GREEN}✔ AAB built${NC}"
echo ""

# Step 5: Sign artifacts
if [ "$SKIP_SIGNING" != "true" ]; then
  echo -e "${BLUE}▶ 5/5  Sign artifacts...${NC}"

  # Sign APK
  if [ -f "$APK_DIR/app-release-unsigned.apk" ]; then
    echo "  Signing APK..."
    $APKSIGNER sign \
      --ks "$KEYSTORE" \
      --ks-key-alias "$ALIAS" \
      --ks-pass "pass:$PASSWORD" \
      --key-pass "pass:$PASSWORD" \
      --out "$APK_DIR/app-release-signed.apk" \
      "$APK_DIR/app-release-unsigned.apk"
    echo "  ✓ APK signed"
  else
    echo "  ✗ APK not found: $APK_DIR/app-release-unsigned.apk"
  fi

  # Sign AAB
  if [ -f "$AAB_DIR/app-release.aab" ]; then
    echo "  Signing AAB..."
    jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
      -keystore "$KEYSTORE" \
      -storepass "$PASSWORD" \
      -keypass "$PASSWORD" \
      "$AAB_DIR/app-release.aab" \
      "$ALIAS"
    echo "  ✓ AAB signed"
  fi

  echo -e "${GREEN}✔ Artifacts signed${NC}"
else
  echo -e "${BLUE}▶ 5/5  Sign artifacts... (skipped)${NC}"
  echo -e "${GREEN}✔ Signing skipped${NC}"
fi

echo ""
echo -e "${GREEN}====================================${NC}"
echo -e "${GREEN}  ✔ Release completed${NC}"
echo -e "${GREEN}====================================${NC}"
echo ""

# Show results
if [ -f "$APK_DIR/app-release-signed.apk" ]; then
  echo -e "${GREEN}APK:${NC}  $APK_DIR/app-release-signed.apk"
  echo "  Size: $(du -h "$APK_DIR/app-release-signed.apk" | cut -f1)"
fi

if [ -f "$AAB_DIR/app-release.aab" ]; then
  echo -e "${GREEN}AAB:${NC}  $AAB_DIR/app-release.aab"
  echo "  Size: $(du -h "$AAB_DIR/app-release.aab" | cut -f1)"
fi

echo ""
