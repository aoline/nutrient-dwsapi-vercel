# 🌿 Nutrient DWS Word Add-in Installation Guide

## 📋 Prerequisites

- Microsoft Word (Desktop version - Windows or Mac)
- Internet connection
- Admin privileges (for some installation methods)

## 🚀 Installation Methods

### Method 1: Sideloading (Recommended for Development/Testing)

#### Step 1: Download the Manifest
1. **Copy the manifest URL:**
   ```
   https://nutrient-dws-api.vercel.app/word-addin/manifest.xml
   ```

2. **Or download the manifest file:**
   - Right-click this link: [Download Manifest](https://nutrient-dws-api.vercel.app/word-addin/manifest.xml)
   - Save as `nutrient-addin-manifest.xml` to your computer

#### Step 2: Install in Word

**For Windows:**
1. Open Microsoft Word
2. Go to **File** → **Options** → **Trust Center** → **Trust Center Settings**
3. Click **Trusted Add-in Catalogs**
4. In the **Catalog URL** field, enter: `https://nutrient-dws-api.vercel.app/word-addin/`
5. Check **Show in Menu** and click **OK**
6. Restart Word
7. Go to **Insert** → **My Add-ins** → **Shared Folder**
8. Find "Nutrient Document Processor" and click **Add**

**For Mac:**
1. Open Microsoft Word
2. Go to **Word** → **Preferences** → **Security & Privacy**
3. Click **Trusted Add-in Catalogs**
4. Add: `https://nutrient-dws-api.vercel.app/word-addin/`
5. Restart Word
6. Go to **Insert** → **My Add-ins** → **Shared Folder**
7. Find "Nutrient Document Processor" and click **Add**

### Method 2: Direct Manifest Installation

1. **Download the manifest:**
   ```bash
   curl -o nutrient-addin-manifest.xml https://nutrient-dws-api.vercel.app/word-addin/manifest.xml
   ```

2. **Install via Word:**
   - Open Word
   - Go to **Insert** → **My Add-ins** → **Upload My Add-in**
   - Browse and select the `nutrient-addin-manifest.xml` file
   - Click **Upload**

### Method 3: Office 365 Admin Center (For Organizations)

1. **Access Admin Center:**
   - Go to [Microsoft 365 Admin Center](https://admin.microsoft.com)
   - Navigate to **Show all** → **Settings** → **Integrated apps**

2. **Upload Add-in:**
   - Click **Upload custom apps**
   - Choose **Upload from file**
   - Select the manifest file
   - Follow the deployment wizard

## 🎯 Verification Steps

### Step 1: Check Add-in Installation
1. Open Microsoft Word
2. Look for the **"Nutrient Processor"** group in the **Home** tab
3. You should see a **"Process Document"** button

### Step 2: Test the Add-in
1. Create a new Word document or open an existing one
2. Click the **"Process Document"** button in the Home tab
3. The add-in task pane should open on the right side
4. You should see options for:
   - 📄 Extract Text
   - 🔄 Convert to PDF
   - 💧 Add Watermark
   - 🔍 OCR Processing

### Step 3: Test Document Processing
1. **Upload a document** using the file upload button
2. **Select an operation** (e.g., "Convert to PDF")
3. **Click "Process Document"**
4. **Check the results** - you should see:
   - Processing status
   - Download links
   - Viewer links

## 🔧 Troubleshooting

### Issue: Add-in Not Appearing
**Solution:**
1. Check if the manifest URL is accessible:
   ```
   https://nutrient-dws-api.vercel.app/word-addin/manifest.xml
   ```
2. Clear Word cache and restart
3. Try Method 2 (Direct Manifest Installation)

### Issue: Add-in Loads But Functions Don't Work
**Solution:**
1. Check internet connection
2. Verify the API is accessible:
   ```
   https://nutrient-dws-api.vercel.app/api/upload
   ```
3. Check browser console for errors (F12)

### Issue: CORS Errors
**Solution:**
1. The add-in is configured to work with the deployed API
2. If testing locally, ensure CORS is properly configured
3. Use the production URL: `https://nutrient-dws-api.vercel.app`

### Issue: Viewer Not Loading
**Solution:**
1. The viewer now shows a fallback page with options
2. Click **"Open in External Viewer"** to view documents
3. This is expected behavior due to CORS restrictions

## 📁 File Structure

```
word-addin/
├── manifest.xml              # Add-in manifest
├── index.html               # Main add-in interface
├── app.js                   # Add-in functionality
├── styles.css               # Styling
├── commands.html            # Command handlers
└── assets/                  # Icons and images
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-64.png
    ├── icon-80.png
    └── logo-filled.png
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

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all URLs are accessible
3. Test with a simple document first
4. Check browser console for errors

## 🔄 Updates

The add-in is automatically updated when deployed to Vercel. To get the latest version:
1. Remove the existing add-in
2. Reinstall using the steps above
3. Or restart Word to refresh the add-in

---

**🎯 Ready to use!** Your Nutrient DWS Word Add-in should now be fully functional and ready to process documents! 