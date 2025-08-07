# 🚀 Manual Word Add-in Sideload Guide

## 📋 **Prerequisites**

Before sideloading, ensure you have:
- Microsoft Word (Desktop or Online)
- Internet connection
- The manifest file downloaded

## 🎯 **Method 1: Word Online (Recommended)**

### **Step 1: Download the Manifest**
```bash
# Download the manifest file
curl -o nutrient-addin-manifest.xml https://nutrient-dws-api.vercel.app/word-addin/manifest.xml
```

**Or manually:**
1. Go to: https://nutrient-dws-api.vercel.app/word-addin/manifest.xml
2. Right-click and "Save As" → `nutrient-addin-manifest.xml`

### **Step 2: Open Word Online**
1. Go to [office.com](https://office.com)
2. Sign in with your Microsoft account
3. Click on **Word** to open Word Online

### **Step 3: Create or Open a Document**
1. Create a new document or open an existing one
2. This gives you access to the full Word interface

### **Step 4: Access Add-ins**
1. Click on the **Insert** tab in the ribbon
2. Look for **Add-ins** in the ribbon
3. Click on **Add-ins** → **My Add-ins**

### **Step 5: Upload the Add-in**
1. In the Add-ins dialog, click **Upload My Add-in**
2. Click **Browse** and select your `nutrient-addin-manifest.xml` file
3. Click **Upload**
4. If prompted, click **Trust it** to allow the add-in

### **Step 6: Use the Add-in**
1. Look for **"Nutrient Processor"** in the Home tab
2. Click **"Process Document"** to open the add-in
3. The add-in will appear in a task pane on the right

---

## 🖥️ **Method 2: Word Desktop (Windows)**

### **Step 1: Download the Manifest**
```bash
# Download the manifest file
curl -o nutrient-addin-manifest.xml https://nutrient-dws-api.vercel.app/word-addin/manifest.xml
```

### **Step 2: Open Word Desktop**
1. Open Microsoft Word on your Windows computer
2. Create a new document or open an existing one

### **Step 3: Access Add-ins**
1. Click on the **Insert** tab
2. Look for **Add-ins** in the ribbon
3. Click **Add-ins** → **My Add-ins**

### **Step 4: Upload the Add-in**
1. Click **Upload My Add-in**
2. Browse to your `nutrient-addin-manifest.xml` file
3. Click **Upload**
4. Click **Trust it** if prompted

### **Step 5: Use the Add-in**
1. Find **"Nutrient Processor"** in the Home tab
2. Click **"Process Document"** to launch

---

## 🍎 **Method 3: Word Desktop (Mac)**

### **Step 1: Download the Manifest**
```bash
# Download the manifest file
curl -o nutrient-addin-manifest.xml https://nutrient-dws-api.vercel.app/word-addin/manifest.xml
```

### **Step 2: Open Word Desktop**
1. Open Microsoft Word on your Mac
2. Create a new document or open an existing one

### **Step 3: Access Add-ins**
1. Click on the **Insert** tab
2. Look for **Add-ins** in the ribbon
3. Click **Add-ins** → **My Add-ins**

### **Step 4: Upload the Add-in**
1. Click **Upload My Add-in**
2. Browse to your `nutrient-addin-manifest.xml` file
3. Click **Upload**
4. Click **Trust it** if prompted

### **Step 5: Use the Add-in**
1. Find **"Nutrient Processor"** in the Home tab
2. Click **"Process Document"** to launch

---

## 🔧 **Method 4: Using Office Developer Tools**

### **Step 1: Install Office Developer Tools**
```bash
# Install Office Developer Tools (if not already installed)
npm install -g office-addin-debugging
```

### **Step 2: Download and Prepare**
```bash
# Download the manifest
curl -o nutrient-addin-manifest.xml https://nutrient-dws-api.vercel.app/word-addin/manifest.xml

# Create a sideload directory
mkdir nutrient-addin-sideload
mv nutrient-addin-manifest.xml nutrient-addin-sideload/
```

### **Step 3: Sideload Using Command Line**
```bash
# Navigate to the sideload directory
cd nutrient-addin-sideload

# Sideload the add-in (Windows)
office-addin-debugging start --manifest nutrient-addin-manifest.xml --app word

# Sideload the add-in (Mac)
office-addin-debugging start --manifest nutrient-addin-manifest.xml --app word
```

---

## 🎯 **Method 5: Using Office Scripts (Advanced)**

### **Step 1: Create Sideload Script**
Create a file called `sideload.ps1` (Windows PowerShell):

```powershell
# Sideload script for Windows
$manifestPath = "nutrient-addin-manifest.xml"
$registryPath = "HKCU:\Software\Microsoft\Office\16.0\Wef\Developer"

# Create registry key if it doesn't exist
if (!(Test-Path $registryPath)) {
    New-Item -Path $registryPath -Force
}

# Add the manifest to the registry
Set-ItemProperty -Path $registryPath -Name "WefAllowedAddins" -Value $manifestPath

Write-Host "Add-in sideloaded successfully!"
Write-Host "Restart Word to see the changes."
```

### **Step 2: Run the Script**
```powershell
# Run as Administrator
.\sideload.ps1
```

---

## 🔍 **Troubleshooting**

### **Common Issues:**

#### **1. "Add-in not found" Error**
- **Solution**: Ensure the manifest file is downloaded correctly
- **Check**: File size should be ~4KB
- **Verify**: Open the file and check it contains XML content

#### **2. "Permission denied" Error**
- **Solution**: Run Word as Administrator (Windows)
- **Alternative**: Use Word Online instead of Desktop

#### **3. "Cannot load add-in" Error**
- **Solution**: Check internet connection
- **Verify**: API is accessible: https://nutrient-dws-api.vercel.app/api/test
- **Try**: Different browser or Word version

#### **4. Add-in doesn't appear in ribbon**
- **Solution**: Restart Word completely
- **Check**: Look in Insert → Add-ins → My Add-ins
- **Verify**: Add-in is listed in My Add-ins

### **Debug Steps:**

#### **Step 1: Verify Manifest**
```bash
# Check manifest content
curl -s https://nutrient-dws-api.vercel.app/word-addin/manifest.xml | head -10
```

#### **Step 2: Test API Access**
```bash
# Test API health
curl https://nutrient-dws-api.vercel.app/api/test
```

#### **Step 3: Check Browser Console**
1. Open Word Online
2. Press F12 to open Developer Tools
3. Look for any error messages in Console tab

---

## ✅ **Verification Steps**

### **After Sideloading, Verify:**

1. **✅ Add-in Appears**: Look for "Nutrient Processor" in Home tab
2. **✅ Button Works**: Click "Process Document" opens task pane
3. **✅ Interface Loads**: Task pane shows the add-in interface
4. **✅ File Upload**: Can select and upload files
5. **✅ API Connection**: Processing works without errors

### **Test the Add-in:**

1. **Upload a PDF**: Use Default.pdf or any small PDF
2. **Select Operation**: Choose "Extract Text"
3. **Process**: Click "Upload & Process"
4. **Verify Results**: Should see processing results

---

## 🌐 **Alternative: Direct URL Access**

If sideloading doesn't work, you can test the add-in directly:

1. **Open**: https://nutrient-dws-api.vercel.app/word-addin/index.html
2. **Test**: Upload files and process them
3. **Verify**: All functionality works in browser

---

## 📞 **Support**

### **If Still Having Issues:**

1. **Check System Requirements**:
   - Word 2016 or later
   - Modern browser (Chrome, Edge, Firefox)
   - Stable internet connection

2. **Try Different Methods**:
   - Word Online (most reliable)
   - Word Desktop
   - Different browser

3. **Contact Support**:
   - Check the test page: https://nutrient-dws-api.vercel.app/word-addin-test.html
   - Verify API status: https://nutrient-dws-api.vercel.app/api/test

---

## 🎉 **Success Indicators**

✅ **Manifest downloaded successfully**  
✅ **Add-in appears in Word ribbon**  
✅ **"Process Document" button works**  
✅ **Task pane opens without errors**  
✅ **File upload functionality works**  
✅ **Processing completes successfully**  

**Once you see all these indicators, your Word Add-in is successfully sideloaded and ready to use!** 🚀 