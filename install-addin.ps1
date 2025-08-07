# Nutrient DWS Word Add-in Installation Script
# Run this script as Administrator

Write-Host "🌿 Nutrient DWS Word Add-in Installation Script" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script requires Administrator privileges. Please run as Administrator." -ForegroundColor Red
    exit 1
}

# Download the manifest
Write-Host "📥 Downloading add-in manifest..." -ForegroundColor Yellow
$manifestUrl = "https://nutrient-dws-api.vercel.app/word-addin/manifest.xml"
$manifestPath = "$env:USERPROFILE\Desktop\nutrient-addin-manifest.xml"

try {
    Invoke-WebRequest -Uri $manifestUrl -OutFile $manifestPath
    Write-Host "✅ Manifest downloaded to: $manifestPath" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to download manifest: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Check if Word is installed
Write-Host "🔍 Checking for Microsoft Word installation..." -ForegroundColor Yellow
$wordPath = Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\WINWORD.EXE" -ErrorAction SilentlyContinue

if (-not $wordPath) {
    Write-Host "❌ Microsoft Word not found. Please install Microsoft Word first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Microsoft Word found" -ForegroundColor Green

# Instructions for manual installation
Write-Host ""
Write-Host "📋 Manual Installation Steps:" -ForegroundColor Cyan
Write-Host "1. Open Microsoft Word" -ForegroundColor White
Write-Host "2. Go to File → Options → Trust Center → Trust Center Settings" -ForegroundColor White
Write-Host "3. Click 'Trusted Add-in Catalogs'" -ForegroundColor White
Write-Host "4. Add this URL: https://nutrient-dws-api.vercel.app/word-addin/" -ForegroundColor White
Write-Host "5. Check 'Show in Menu' and click OK" -ForegroundColor White
Write-Host "6. Restart Word" -ForegroundColor White
Write-Host "7. Go to Insert → My Add-ins → Shared Folder" -ForegroundColor White
Write-Host "8. Find 'Nutrient Document Processor' and click Add" -ForegroundColor White

Write-Host ""
Write-Host "🎯 Alternative Method:" -ForegroundColor Cyan
Write-Host "1. Open Word" -ForegroundColor White
Write-Host "2. Go to Insert → My Add-ins → Upload My Add-in" -ForegroundColor White
Write-Host "3. Browse to: $manifestPath" -ForegroundColor White
Write-Host "4. Click Upload" -ForegroundColor White

Write-Host ""
Write-Host "✅ Installation script completed!" -ForegroundColor Green
Write-Host "📁 Manifest saved to: $manifestPath" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Quick Links:" -ForegroundColor Cyan
Write-Host "- Add-in Homepage: https://nutrient-dws-api.vercel.app/word-addin/index.html" -ForegroundColor White
Write-Host "- API Endpoint: https://nutrient-dws-api.vercel.app/api/upload" -ForegroundColor White
Write-Host "- Viewer: https://nutrient-dws-api.vercel.app/viewer.html" -ForegroundColor White

Write-Host ""
Write-Host "🎉 Ready to install! Follow the manual steps above to complete the installation." -ForegroundColor Green 