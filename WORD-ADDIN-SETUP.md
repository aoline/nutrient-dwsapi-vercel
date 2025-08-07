# 🚀 Word Add-in Setup Guide

## ✅ **Word Add-in is Ready to Run!**

The Word Add-in has been deployed and is now accessible at:
**https://nutrient-dws-api.vercel.app/word-addin/**

## 📋 **Step-by-Step Setup Instructions**

### **Step 1: Download the Manifest File**
1. Download the manifest file from: `https://nutrient-dws-api.vercel.app/word-addin/manifest.xml`
2. Save it to your computer (e.g., Desktop)

### **Step 2: Sideload the Add-in in Word**

#### **Option A: Using Word Online (Recommended)**
1. Open Word Online at [office.com](https://office.com)
2. Open or create a document
3. Go to **Insert** → **Add-ins** → **My Add-ins**
4. Click **Upload My Add-in**
5. Browse and select the downloaded `manifest.xml` file
6. Click **Upload**

#### **Option B: Using Word Desktop (Windows/Mac)**
1. Open Microsoft Word
2. Go to **Insert** → **Add-ins** → **My Add-ins**
3. Click **Upload My Add-in**
4. Browse and select the downloaded `manifest.xml` file
5. Click **Upload**

### **Step 3: Use the Add-in**
1. Once loaded, you'll see a new **"Nutrient Processor"** button in the Home tab
2. Click **"Process Document"** to open the add-in
3. The add-in will appear in a task pane on the right side

## 🎯 **Available Features**

### **📄 Text Extraction**
- Extract text from the current Word document
- Get structured data and key-value pairs

### **🔄 Format Conversion**
- Convert Word documents to PDF
- Process uploaded PDFs

### **💧 Watermark Addition**
- Add watermarks to PDF documents
- Customize opacity and position

### **👁️ OCR Processing**
- Perform OCR on PDF documents
- Extract text from scanned documents

## 🔧 **Troubleshooting**

### **If the Add-in Doesn't Load:**
1. Check that you're using a supported version of Word
2. Ensure the manifest file was downloaded correctly
3. Try refreshing the page (Word Online) or restarting Word (Desktop)

### **If Features Don't Work:**
1. Check your internet connection
2. Verify the API is accessible: https://nutrient-dws-api.vercel.app/api/test
3. Ensure you have the necessary permissions

### **Common Issues:**
- **"Add-in not found"**: Re-upload the manifest file
- **"Permission denied"**: Check Word's security settings
- **"API error"**: Verify the backend is running

## 🌐 **Live URLs**

- **📱 Add-in Interface**: https://nutrient-dws-api.vercel.app/word-addin/index.html
- **📄 Manifest File**: https://nutrient-dws-api.vercel.app/word-addin/manifest.xml
- **🔧 API Health Check**: https://nutrient-dws-api.vercel.app/api/test
- **📊 Main Web UI**: https://nutrient-dws-api.vercel.app

## 🎉 **Success Indicators**

✅ **Add-in loads without errors**
✅ **"Process Document" button appears in Home tab**
✅ **Task pane opens when clicked**
✅ **File upload works**
✅ **API calls succeed**

## 📞 **Support**

If you encounter issues:
1. Check the browser console for errors
2. Verify the API endpoints are responding
3. Test with the web UI first: https://nutrient-dws-api.vercel.app

---

**🎯 The Word Add-in is now ready to use! Follow the steps above to get started.** 