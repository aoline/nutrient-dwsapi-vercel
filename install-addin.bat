@echo off
echo 🌿 Nutrient DWS Word Add-in Installation
echo =========================================

echo.
echo 📥 Downloading add-in manifest...

powershell -Command "& {Invoke-WebRequest -Uri 'https://nutrient-dws-api.vercel.app/word-addin/manifest.xml' -OutFile '%USERPROFILE%\Desktop\nutrient-addin-manifest.xml'}"

if exist "%USERPROFILE%\Desktop\nutrient-addin-manifest.xml" (
    echo ✅ Manifest downloaded successfully!
    echo 📁 Location: %USERPROFILE%\Desktop\nutrient-addin-manifest.xml
) else (
    echo ❌ Failed to download manifest
    pause
    exit /b 1
)

echo.
echo 📋 Installation Instructions:
echo.
echo Method 1 - Sideloading:
echo 1. Open Microsoft Word
echo 2. Go to File → Options → Trust Center → Trust Center Settings
echo 3. Click "Trusted Add-in Catalogs"
echo 4. Add URL: https://nutrient-dws-api.vercel.app/word-addin/
echo 5. Check "Show in Menu" and click OK
echo 6. Restart Word
echo 7. Go to Insert → My Add-ins → Shared Folder
echo 8. Find "Nutrient Document Processor" and click Add
echo.
echo Method 2 - Direct Upload:
echo 1. Open Microsoft Word
echo 2. Go to Insert → My Add-ins → Upload My Add-in
echo 3. Browse to: %USERPROFILE%\Desktop\nutrient-addin-manifest.xml
echo 4. Click Upload
echo.
echo 🔗 Quick Links:
echo - Add-in Homepage: https://nutrient-dws-api.vercel.app/word-addin/index.html
echo - API Endpoint: https://nutrient-dws-api.vercel.app/api/upload
echo - Viewer: https://nutrient-dws-api.vercel.app/viewer.html
echo.
echo 🎉 Ready to install! Follow the instructions above.
echo.
pause 