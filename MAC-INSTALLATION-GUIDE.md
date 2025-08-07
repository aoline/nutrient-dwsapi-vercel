# 🍎 Mac Installation Guide for Nutrient DWS Word Add-in

## 📋 Prerequisites

- **macOS** (10.15 Catalina or later recommended)
- **Microsoft Word for Mac** (version 16.0 or later)
- **Internet connection**
- **Admin privileges** (for some installation methods)

## 🚀 Installation Methods

### Method 1: Sideloading (Recommended)

#### Step 1: Download the Manifest
1. **Open Terminal** (Applications → Utilities → Terminal)
2. **Download the manifest:**
   ```bash
   cd ~/Desktop
   curl -o nutrient-addin-manifest.xml https://nutrient-dws-api.vercel.app/word-addin/manifest.xml
   ```

3. **Verify download:**
   ```bash
   ls -la nutrient-addin-manifest.xml
   ```

#### Step 2: Configure Word for Add-ins

1. **Open Microsoft Word for Mac**
2. **Go to Word menu** → **Preferences** (or press `Cmd + ,`)
3. **Click "Security & Privacy"**
4. **Click "Trusted Add-in Catalogs"**
5. **Add the catalog URL:**
   ```
   https://nutrient-dws-api.vercel.app/word-addin/
   ```
6. **Check "Show in Menu"**
7. **Click "OK"**
8. **Restart Word**

#### Step 3: Install the Add-in

1. **Open Word** (after restarting)
2. **Go to "Insert" tab**
3. **Click "My Add-ins"**
4. **Click "Shared Folder"**
5. **Find "Nutrient Document Processor"**
6. **Click "Add"**

### Method 2: Direct Manifest Upload

1. **Download the manifest** (if not already done):
   ```bash
   cd ~/Desktop
   curl -o nutrient-addin-manifest.xml https://nutrient-dws-api.vercel.app/word-addin/manifest.xml
   ```

2. **Open Microsoft Word**
3. **Go to "Insert" tab**
4. **Click "My Add-ins"**
5. **Click "Upload My Add-in"**
6. **Browse to Desktop** and select `nutrient-addin-manifest.xml`
7. **Click "Upload"**

### Method 3: Using Safari to Download

1. **Open Safari**
2. **Navigate to:** `https://nutrient-dws-api.vercel.app/word-addin/manifest.xml`
3. **Right-click** on the page
4. **Select "Save As..."**
5. **Save to Desktop** as `nutrient-addin-manifest.xml`
6. **Follow Method 2** steps 2-7

## 🎯 Verification Steps

### Step 1: Check Add-in Installation
1. **Open Word**
2. **Look for "Nutrient Processor"** in the **Home** tab
3. **You should see a "Process Document" button**

### Step 2: Test the Add-in
1. **Create a new document** or open an existing one
2. **Click "Process Document"** button
3. **Task pane should open** on the right side
4. **Verify options:**
   - 📄 Extract Text
   - 🔄 Convert to PDF
   - 💧 Add Watermark
   - 🔍 OCR Processing

### Step 3: Test Document Processing
1. **Upload a document** using the file upload button
2. **Select an operation** (e.g., "Convert to PDF")
3. **Click "Process Document"**
4. **Check results:**
   - Processing status
   - Download links
   - Viewer links

## 🔧 Troubleshooting

### Issue: Add-in Not Appearing
**Solutions:**
1. **Check manifest accessibility:**
   ```bash
   curl -I https://nutrient-dws-api.vercel.app/word-addin/manifest.xml
   ```

2. **Clear Word cache:**
   - Quit Word
   - Open Terminal
   - Run: `rm -rf ~/Library/Containers/com.microsoft.Word/Data/Library/Caches/*`
   - Restart Word

3. **Try Method 2** (Direct Upload)

### Issue: "Trusted Add-in Catalogs" Not Found
**Solution:**
- This option might not be available in all Word versions
- Use **Method 2** (Direct Upload) instead

### Issue: Add-in Loads But Functions Don't Work
**Solutions:**
1. **Check internet connection**
2. **Verify API accessibility:**
   ```bash
   curl -I https://nutrient-dws-api.vercel.app/api/upload
   ```

3. **Check browser console:**
   - Open Word
   - Press `Cmd + Option + I` (if available)
   - Look for errors in Console tab

### Issue: CORS Errors
**Solution:**
- The add-in is configured for the production API
- Use: `https://nutrient-dws-api.vercel.app`

### Issue: Viewer Not Loading
**Solution:**
- The viewer shows a fallback page with options
- Click **"Open in External Viewer"** to view documents
- This is expected due to CORS restrictions

## 🛠️ Advanced Installation

### Using Homebrew (if available)
```bash
# Install curl if not available
brew install curl

# Download manifest
curl -o ~/Desktop/nutrient-addin-manifest.xml https://nutrient-dws-api.vercel.app/word-addin/manifest.xml
```

### Using Python (if available)
```bash
# Download manifest using Python
python3 -c "
import urllib.request
urllib.request.urlretrieve('https://nutrient-dws-api.vercel.app/word-addin/manifest.xml', 'nutrient-addin-manifest.xml')
print('Manifest downloaded successfully!')
"
```

## 📁 File Locations

### Default Locations
- **Desktop:** `~/Desktop/nutrient-addin-manifest.xml`
- **Downloads:** `~/Downloads/nutrient-addin-manifest.xml`
- **Word Cache:** `~/Library/Containers/com.microsoft.Word/Data/Library/Caches/`

### Check File Location
```bash
# Find the manifest file
find ~ -name "nutrient-addin-manifest.xml" 2>/dev/null
```

## 🌐 URLs

- **Add-in Homepage:** `https://nutrient-dws-api.vercel.app/word-addin/index.html`
- **Manifest:** `https://nutrient-dws-api.vercel.app/word-addin/manifest.xml`
- **API Endpoint:** `https://nutrient-dws-api.vercel.app/api/upload`
- **Viewer:** `https://nutrient-dws-api.vercel.app/viewer.html`

## 🎉 Success Indicators

✅ **Add-in appears in Word ribbon**
✅ **Task pane opens when clicked**
✅ **Document upload works**
✅ **Processing operations complete**
✅ **Results display correctly**
✅ **Viewer links work**

## 📞 Support

### Common Mac Issues
1. **Permission denied:** Run Terminal commands with `sudo` if needed
2. **Word not found:** Ensure Microsoft Word is installed from App Store or Microsoft
3. **Cache issues:** Clear Word cache as shown above
4. **Network issues:** Check firewall settings

### Getting Help
1. **Check troubleshooting section above**
2. **Verify all URLs are accessible**
3. **Test with a simple document first**
4. **Check Terminal for error messages**

## 🔄 Updates

The add-in updates automatically when deployed. To get the latest version:
1. **Remove existing add-in** from Word
2. **Reinstall** using the steps above
3. **Or restart Word** to refresh

## 🎯 Quick Commands

### Download Manifest
```bash
cd ~/Desktop && curl -o nutrient-addin-manifest.xml https://nutrient-dws-api.vercel.app/word-addin/manifest.xml
```

### Check Installation
```bash
ls -la ~/Desktop/nutrient-addin-manifest.xml
```

### Test API
```bash
curl -I https://nutrient-dws-api.vercel.app/api/upload
```

---

**🎉 Ready to install!** Your Nutrient DWS Word Add-in is fully functional and ready to process documents on your Mac! 🍎 