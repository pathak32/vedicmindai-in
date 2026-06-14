@echo off
echo ================================================
echo VedicMindAI APK Signing Fix
echo ================================================
echo.

REM Step 1: Go to TWA folder
cd C:\vedicmind-twa

REM Step 2: Generate new upload keystore
echo Generating new keystore...
keytool -genkey -v ^
  -keystore vedicmind-upload.jks ^
  -alias vedicmind ^
  -keyalg RSA ^
  -keysize 2048 ^
  -validity 10000 ^
  -dname "CN=VedicMind Admin, OU=Engineering, O=VedicMindAI, L=Lucknow, S=UP, C=IN" ^
  -storepass VedicMind@2026 ^
  -keypass VedicMind@2026

echo.
echo Keystore created!
echo.

REM Step 3: Get SHA1 fingerprint
echo Getting fingerprint...
keytool -list -v ^
  -keystore vedicmind-upload.jks ^
  -alias vedicmind ^
  -storepass VedicMind@2026

echo.
echo ================================================
echo DONE! Copy the SHA1 fingerprint above
echo ================================================
pause
