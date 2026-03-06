@echo off
setlocal enabledelayedexpansion

REM Configuration
set KEYSTORE=billcheck-release.jks
set ALIAS=billcheck
set PASSWORD=billcheck2026
set APK_DIR=android\app\build\outputs\apk\release
set AAB_DIR=android\app\build\outputs\bundle\release
set APKSIGNER=%USERPROFILE%\Android\Sdk\build-tools\35.0.0\apksigner.bat

echo.
echo ====================================
echo   Verifica tu billetito - Release
echo ====================================
echo.

REM Check if keystore exists
if not exist "%KEYSTORE%" (
  echo WARNING: Keystore not found: %KEYSTORE%
  echo Skipping signing step (CI/CD environment?)
  set SKIP_SIGNING=1
)

REM Step 1: Build Angular
echo [1/5] Build Angular (production)...
call ng build --configuration production
if errorlevel 1 goto error
echo OK: Angular built
echo.

REM Step 2: Sync Capacitor
echo [2/5] Sync Capacitor...
call npx cap sync android
if errorlevel 1 goto error
echo OK: Capacitor synced
echo.

REM Step 3: Build APK
echo [3/5] Build APK (release)...
cd android
call gradlew assembleRelease
if errorlevel 1 (
  cd ..
  goto error
)
cd ..
echo OK: APK built
echo.

REM Step 4: Build AAB
echo [4/5] Build AAB (release)...
cd android
call gradlew bundleRelease
if errorlevel 1 (
  cd ..
  goto error
)
cd ..
echo OK: AAB built
echo.

REM Step 5: Sign artifacts
if "%SKIP_SIGNING%"=="1" (
  echo [5/5] Sign artifacts... (skipped)
  echo OK: Skipped signing
) else (
  echo [5/5] Sign artifacts...

  REM Sign APK
  if exist "%APK_DIR%\app-release-unsigned.apk" (
    echo   Signing APK...
    call %APKSIGNER% sign ^
      --ks %KEYSTORE% ^
      --ks-key-alias %ALIAS% ^
      --ks-pass "pass:%PASSWORD%" ^
      --key-pass "pass:%PASSWORD%" ^
      --out "%APK_DIR%\app-release-signed.apk" ^
      "%APK_DIR%\app-release-unsigned.apk"
    if errorlevel 1 goto error
    echo   OK: APK signed
  ) else (
    echo   ERROR: APK not found: %APK_DIR%\app-release-unsigned.apk
  )

  REM Sign AAB
  if exist "%AAB_DIR%\app-release.aab" (
    echo   Signing AAB...
    jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 ^
      -keystore %KEYSTORE% ^
      -storepass %PASSWORD% ^
      -keypass %PASSWORD% ^
      %AAB_DIR%\app-release.aab ^
      %ALIAS%
    if errorlevel 1 goto error
    echo   OK: AAB signed
  )

  echo OK: Artifacts signed
)

echo.
echo ====================================
echo   Release completed
echo ====================================
echo.

if exist "%APK_DIR%\app-release-signed.apk" (
  for %%A in ("%APK_DIR%\app-release-signed.apk") do (
    echo APK: %APK_DIR%\app-release-signed.apk
    echo Size: %%~zA bytes
  )
)

if exist "%AAB_DIR%\app-release.aab" (
  for %%A in ("%AAB_DIR%\app-release.aab") do (
    echo AAB: %AAB_DIR%\app-release.aab
    echo Size: %%~zA bytes
  )
)

echo.
goto end

:error
echo.
echo !!! ERROR !!!
echo The build failed. Check the errors above.
echo.
pause

:end
endlocal
