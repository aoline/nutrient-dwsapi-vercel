# 🍎 Mac Quick Install Guide

## 🚀 **3-Minute Installation**

### Option 1: Automated Script
```bash
# Download and run the installation script
curl -s https://raw.githubusercontent.com/your-repo/nutrient-dwsapi-vercel/main/install-addin-mac.sh | bash
```

### Option 2: Manual Installation

#### Step 1: Download Manifest
```bash
cd ~/Desktop
curl -o nutrient-addin-manifest.xml https://nutrient-dws-api.vercel.app/word-addin/manifest.xml
```

#### Step 2: Install in Word
1. **Open Word** → **Word menu** → **Preferences** (`Cmd + ,`)
2. **Security & Privacy** → **Trusted Add-in Catalogs**
3. **Add URL:** `https://nutrient-dws-api.vercel.app/word-addin/`
4. **Check "Show in Menu"** → **OK**
5. **Restart Word**
6. **Insert** → **My Add-ins** → **Shared Folder**
7. **Find "Nutrient Document Processor"** → **Add**

## 🎯 **What You Get**

- ✅ **"Nutrient Processor"** group in Home tab
- ✅ **"Process Document"** button
- ✅ **Task pane** with processing options:
  - 📄 Extract Text
  - 🔄 Convert to PDF
  - 💧 Add Watermark
  - 🔍 OCR Processing

## 🔗 **Quick Links**

- **Add-in:** `https://nutrient-dws-api.vercel.app/word-addin/index.html`
- **Manifest:** `https://nutrient-dws-api.vercel.app/word-addin/manifest.xml`
- **API:** `https://nutrient-dws-api.vercel.app/api/upload`

## 🆘 **Troubleshooting**

**Add-in not appearing?**
```bash
# Clear Word cache
rm -rf ~/Library/Containers/com.microsoft.Word/Data/Library/Caches/*
```

**Use direct upload instead:**
1. **Insert** → **My Add-ins** → **Upload My Add-in**
2. **Browse to Desktop** → **nutrient-addin-manifest.xml**
3. **Upload**

---

**🎉 Ready to process documents!** 🍎 