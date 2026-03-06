@echo off
setlocal enabledelayedexpansion

set KEYSTORE=billcheck-release.jks
set ALIAS=billcheck
set PASSWORD=billcheck2026
set APK_DIR=android\app\build\outputs\apk\release
set APKSIGNER=%USERPROFILE%\Android\Sdk\build-tools\35.0.0\apksigner.bat

echo.
echo === Verifica tu billetito - APK Builder ===
echo.

echo [1/4] Compilar Angular...
call ng build --configuration production
if errorlevel 1 goto error
echo OK: Angular compilado
echo.

echo [2/4] Sincronizar Capacitor...
call npx cap sync android
if errorlevel 1 goto error
echo OK: Capacitor sincronizado
echo.

echo [3/4] Compilar APK...
cd android
call gradlew assembleRelease
if errorlevel 1 (
  cd ..
  goto error
)
cd ..
echo OK: APK compilado
echo.

echo [4/4] Firmar APK...
call %APKSIGNER% sign ^
  --ks %KEYSTORE% ^
  --ks-key-alias %ALIAS% ^
  --ks-pass "pass:%PASSWORD%" ^
  --key-pass "pass:%PASSWORD%" ^
  --out "%APK_DIR%\app-release-signed.apk" ^
  "%APK_DIR%\app-release-unsigned.apk"
if errorlevel 1 goto error
echo OK: APK firmado
echo.

echo.
echo === EXITO ===
echo APK listo: %APK_DIR%\app-release-signed.apk
echo.
pause
goto end

:error
echo.
echo !!! ERROR !!!
echo El build fallo. Verifica los errores arriba.
echo.
pause

:end
endlocal
