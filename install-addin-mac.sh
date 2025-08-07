#!/bin/bash

# Nutrient DWS Word Add-in Installation Script for Mac
# Run this script in Terminal

echo "🍎 Nutrient DWS Word Add-in Installation Script for Mac"
echo "======================================================"

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
echo "📥 Downloading add-in manifest..."
MANIFEST_URL="https://nutrient-dws-api.vercel.app/word-addin/manifest.xml"
MANIFEST_PATH="$DESKTOP_DIR/nutrient-addin-manifest.xml"

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
echo "5. Add this URL: https://nutrient-dws-api.vercel.app/word-addin/"
echo "6. Check 'Show in Menu' and click OK"
echo "7. Restart Word"
echo "8. Go to Insert → My Add-ins → Shared Folder"
echo "9. Find 'Nutrient Document Processor' and click Add"
echo ""
echo "Method 2 - Direct Upload:"
echo "1. Open Microsoft Word"
echo "2. Go to Insert → My Add-ins → Upload My Add-in"
echo "3. Browse to Desktop and select: nutrient-addin-manifest.xml"
echo "4. Click Upload"
echo ""

# Display quick links
echo "🔗 Quick Links:"
echo "==============="
echo "- Add-in Homepage: https://nutrient-dws-api.vercel.app/word-addin/index.html"
echo "- API Endpoint: https://nutrient-dws-api.vercel.app/api/upload"
echo "- Viewer: https://nutrient-dws-api.vercel.app/viewer.html"
echo ""

# Test API connectivity
echo "🌐 Testing API connectivity..."
if curl -s -I "https://nutrient-dws-api.vercel.app/api/upload" | head -1 | grep -q "200\|302"; then
    echo "✅ API is accessible"
else
    echo "⚠️  API might not be accessible. Please check your internet connection."
fi

echo ""
echo "🎉 Installation script completed!"
echo "📁 Manifest saved to: $MANIFEST_PATH"
echo ""
echo "🎯 Next Steps:"
echo "1. Follow the installation instructions above"
echo "2. Test the add-in with a sample document"
echo "3. Check the troubleshooting section if you encounter issues"
echo ""
echo "📖 For detailed instructions, see: MAC-INSTALLATION-GUIDE.md"
echo ""
echo "🍎 Ready to install! Follow the manual steps above to complete the installation." 