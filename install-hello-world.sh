#!/bin/bash

# Nutrient.io Hello World Add-in Installation Script
# Run this script in Terminal

echo "🌿 Nutrient.io Hello World Add-in Installation Script"
echo "===================================================="

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ This script is designed for macOS only."
    exit 1
fi

# Check if curl is available
if ! command -v curl &> /dev/null; then
    echo "❌ curl is not installed. Please install it first."
    echo "You can install it using Homebrew: brew install curl"
    exit 1
fi

# Create Desktop directory if it doesn't exist
DESKTOP_DIR="$HOME/Desktop"
if [ ! -d "$DESKTOP_DIR" ]; then
    echo "📁 Creating Desktop directory..."
    mkdir -p "$DESKTOP_DIR"
fi

# Download the manifest
echo "📥 Downloading Hello World add-in manifest..."
MANIFEST_URL="https://nutrient-dws-api.vercel.app/hello-world-addin/manifest.xml"
MANIFEST_PATH="$DESKTOP_DIR/nutrient-hello-world-manifest.xml"

if curl -s -o "$MANIFEST_PATH" "$MANIFEST_URL"; then
    echo "✅ Manifest downloaded successfully!"
    echo "📁 Location: $MANIFEST_PATH"
else
    echo "❌ Failed to download manifest. Please check your internet connection."
    exit 1
fi

# Check if Word is installed
echo "🔍 Checking for Microsoft Word installation..."
if [ -d "/Applications/Microsoft Word.app" ]; then
    echo "✅ Microsoft Word found in Applications"
elif [ -d "$HOME/Applications/Microsoft Word.app" ]; then
    echo "✅ Microsoft Word found in user Applications"
else
    echo "⚠️  Microsoft Word not found in standard locations."
    echo "   Please ensure Microsoft Word is installed from the App Store or Microsoft."
fi

# Display installation instructions
echo ""
echo "📋 Installation Instructions:"
echo "============================="
echo ""
echo "Method 1 - Sideloading (Recommended):"
echo "1. Open Microsoft Word for Mac"
echo "2. Go to Word menu → Preferences (or press Cmd + ,)"
echo "3. Click 'Security & Privacy'"
echo "4. Click 'Trusted Add-in Catalogs'"
echo "5. Add this URL: https://nutrient-dws-api.vercel.app/hello-world-addin/"
echo "6. Check 'Show in Menu' and click OK"
echo "7. Restart Word"
echo "8. Go to Insert → My Add-ins → Shared Folder"
echo "9. Find 'Nutrient.io Hello World' and click Add"
echo ""
echo "Method 2 - Direct Upload:"
echo "1. Open Microsoft Word"
echo "2. Go to Insert → My Add-ins → Upload My Add-in"
echo "3. Browse to Desktop and select: nutrient-hello-world-manifest.xml"
echo "4. Click Upload"
echo ""

# Display quick links
echo "🔗 Quick Links:"
echo "==============="
echo "- Add-in Homepage: https://nutrient-dws-api.vercel.app/hello-world-addin/index.html"
echo "- Manifest: https://nutrient-dws-api.vercel.app/hello-world-addin/manifest.xml"
echo "- Nutrient.io: https://www.nutrient.io"
echo ""

# Test add-in accessibility
echo "🌐 Testing add-in accessibility..."
if curl -s -I "https://nutrient-dws-api.vercel.app/hello-world-addin/index.html" | head -1 | grep -q "200"; then
    echo "✅ Add-in homepage is accessible"
else
    echo "⚠️  Add-in homepage might not be accessible. Please check your internet connection."
fi

echo ""
echo "🎉 Installation script completed!"
echo "📁 Manifest saved to: $MANIFEST_PATH"
echo ""
echo "🎯 Next Steps:"
echo "1. Follow the installation instructions above"
echo "2. Test the add-in with the 'Hello World' button"
echo "3. Try the 'Get Document Info' feature"
echo ""
echo "🌿 Features:"
echo "- Insert 'Hello World from Nutrient.io!' text"
echo "- Get document information (title, word count, etc.)"
echo "- Beautiful Nutrient.io branding"
echo ""
echo "🍎 Ready to install! Follow the manual steps above to complete the installation." 