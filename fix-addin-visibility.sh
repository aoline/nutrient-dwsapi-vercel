#!/bin/bash

# Fix Add-in Visibility Script
# This script helps troubleshoot and fix add-in visibility issues

echo "🔧 Fixing Add-in Visibility Issue..."
echo "===================================="

# Check if Word is running
echo "🔍 Checking if Word is running..."
if pgrep -x "Microsoft Word" > /dev/null; then
    echo "⚠️  Word is currently running. Please close Word first."
    echo "   Close Word and run this script again."
    exit 1
else
    echo "✅ Word is not running - good!"
fi

# Clear Word cache
echo "🧹 Clearing Word cache..."
CACHE_DIR="$HOME/Library/Containers/com.microsoft.Word/Data/Library/Caches"
if [ -d "$CACHE_DIR" ]; then
    rm -rf "$CACHE_DIR"/*
    echo "✅ Word cache cleared"
else
    echo "⚠️  Cache directory not found"
fi

# Clear Wef cache
echo "🧹 Clearing Wef cache..."
WEF_DIR="$HOME/Library/Containers/com.microsoft.Word/Data/Library/Application Support/Microsoft/Office/16.0/Wef"
if [ -d "$WEF_DIR" ]; then
    # Backup existing Wef folder
    BACKUP_DIR="$HOME/Desktop/wef-backup-$(date +%Y%m%d-%H%M%S)"
    echo "📁 Creating backup of Wef folder: $BACKUP_DIR"
    cp -r "$WEF_DIR" "$BACKUP_DIR"
    
    # Clear Wef cache but keep structure
    find "$WEF_DIR" -name "*.db" -delete 2>/dev/null
    find "$WEF_DIR" -name "*.db-*" -delete 2>/dev/null
    echo "✅ Wef cache cleared"
else
    echo "⚠️  Wef directory not found"
fi

# Check manifest files
echo "📄 Checking manifest files..."
DESKTOP_DIR="$HOME/Desktop"
MANIFEST_FILES=(
    "nutrient-hello-world-manifest.xml"
    "nutrient-hello-world-working-manifest.xml"
    "nutrient-addin-manifest.xml"
)

for manifest in "${MANIFEST_FILES[@]}"; do
    if [ -f "$DESKTOP_DIR/$manifest" ]; then
        echo "✅ Found: $manifest"
        # Check if manifest is valid
        if grep -q "OfficeApp" "$DESKTOP_DIR/$manifest"; then
            echo "   ✅ Valid Office add-in manifest"
        else
            echo "   ❌ Invalid manifest content"
        fi
    else
        echo "❌ Missing: $manifest"
    fi
done

# Test URLs
echo "🌐 Testing add-in URLs..."
URLS=(
    "https://nutrient-dws-api.vercel.app/word-addin/index.html"
    "https://nutrient-dws-api.vercel.app/word-addin/manifest.xml"
    "https://nutrient-dws-api.vercel.app/word-addin/assets/icon-32.png"
)

for url in "${URLS[@]}"; do
    if curl -s -I "$url" | head -1 | grep -q "200"; then
        echo "✅ $url - Accessible"
    else
        echo "❌ $url - Not accessible"
    fi
done

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo "1. Open Microsoft Word"
echo "2. Go to Word menu → Preferences (Cmd + ,)"
echo "3. Click 'Security & Privacy'"
echo "4. Click 'Trusted Add-in Catalogs'"
echo "5. Add this URL: https://nutrient-dws-api.vercel.app/word-addin/"
echo "6. Check 'Show in Menu' and click OK"
echo "7. Restart Word"
echo "8. Go to Insert → My Add-ins → Shared Folder"
echo "9. Find 'Nutrient.io Hello World' and click Add"
echo ""
echo "Alternative Method:"
echo "1. Open Word"
echo "2. Go to Insert → My Add-ins → Upload My Add-in"
echo "3. Browse to Desktop and select: nutrient-hello-world-working-manifest.xml"
echo "4. Click Upload"
echo ""
echo "🔧 If still not working:"
echo "- Check Word version (needs 16.0+)"
echo "- Try clearing all Word preferences"
echo "- Restart your Mac"
echo "- Check internet connection"
echo ""
echo "📁 Working manifest saved to: ~/Desktop/nutrient-hello-world-working-manifest.xml"
echo "📁 Backup created at: $BACKUP_DIR" 