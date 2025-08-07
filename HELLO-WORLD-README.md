# 🌿 Nutrient.io Hello World Office Add-in

A simple, beautiful "Hello World" Office sidebar add-in with Nutrient.io branding.

## 🎯 Features

- **Simple Interface**: Clean, modern UI with Nutrient.io branding
- **Hello World Function**: Insert formatted text into Word documents
- **Document Info**: Get document statistics and information
- **Beautiful Design**: Gradient backgrounds and smooth animations
- **Responsive**: Works on different screen sizes

## 🚀 Quick Start

### Installation

1. **Run the installation script:**
   ```bash
   ./install-hello-world.sh
   ```

2. **Or download manually:**
   ```bash
   cd ~/Desktop
   curl -o nutrient-hello-world-manifest.xml https://nutrient-dws-api.vercel.app/hello-world-addin/manifest.xml
   ```

### Install in Word

**Method 1: Sideloading (Recommended)**
1. Open Microsoft Word
2. Go to **Word menu** → **Preferences** (`Cmd + ,`)
3. Click **Security & Privacy** → **Trusted Add-in Catalogs**
4. Add URL: `https://nutrient-dws-api.vercel.app/hello-world-addin/`
5. Check **Show in Menu** → **OK**
6. Restart Word
7. Go to **Insert** → **My Add-ins** → **Shared Folder**
8. Find **"Nutrient.io Hello World"** → **Add**

**Method 2: Direct Upload**
1. Open Microsoft Word
2. Go to **Insert** → **My Add-ins** → **Upload My Add-in**
3. Browse to Desktop → **nutrient-hello-world-manifest.xml**
4. Click **Upload**

## 🎨 What You'll See

### Add-in Interface
- 🌿 **Nutrient.io Logo**: Animated leaf icon
- 👋 **Welcome Message**: Friendly greeting
- 🎯 **Action Buttons**: 
  - **Insert Hello World**: Adds formatted text to document
  - **Get Document Info**: Shows document statistics
- 📊 **Info Cards**: Display document information and status
- 🔗 **Footer**: Links to Nutrient.io

### Features
- **Insert Text**: Adds "Hello World from Nutrient.io! 🌿" with green formatting
- **Document Info**: Shows title, word count, character count, and selected text
- **Status Updates**: Real-time feedback on actions
- **Animations**: Smooth hover effects and button interactions

## 🛠️ Technical Details

### Files Structure
```
hello-world-addin/
├── manifest.xml          # Office add-in manifest
├── index.html            # Main add-in interface
├── app.js                # JavaScript functionality
├── styles.css            # CSS styling
├── commands.html         # Command handlers
└── assets/               # Icon files
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-64.png
    └── icon-80.png
```

### Technologies Used
- **Office.js**: Microsoft Office JavaScript API
- **Fluent UI**: Office UI Fabric Core
- **CSS3**: Modern styling with gradients and animations
- **ES6+**: Modern JavaScript features

### URLs
- **Add-in Homepage**: `https://nutrient-dws-api.vercel.app/hello-world-addin/index.html`
- **Manifest**: `https://nutrient-dws-api.vercel.app/hello-world-addin/manifest.xml`
- **Nutrient.io**: `https://www.nutrient.io`

## 🎯 Usage

1. **Open the Add-in**: Click the "Hello World" button in the Home tab
2. **Insert Text**: Click "Insert Hello World" to add formatted text
3. **Get Info**: Click "Get Document Info" to see document statistics
4. **Watch Status**: See real-time updates in the status section

## 🎨 Design Features

### Visual Elements
- **Gradient Backgrounds**: Beautiful color transitions
- **Nutrient.io Green**: Brand-consistent color scheme (#28a745)
- **Smooth Animations**: Hover effects and transitions
- **Modern Typography**: Clean, readable fonts
- **Responsive Layout**: Adapts to different screen sizes

### Interactive Elements
- **Animated Logo**: Pulsing leaf icon
- **Button Hover Effects**: Scale and shadow animations
- **Status Indicators**: Color-coded success/error messages
- **Loading States**: Visual feedback during operations

## 🔧 Customization

### Colors
The add-in uses Nutrient.io brand colors:
- **Primary Green**: `#28a745`
- **Secondary Green**: `#20c997`
- **Background Gradients**: Purple to blue transitions

### Text
- **Inserted Text**: "Hello World from Nutrient.io! 🌿"
- **Formatting**: Bold, green, 16px font size
- **Branding**: Consistent Nutrient.io references

## 🚀 Deployment

The add-in is deployed on Vercel and accessible at:
- **Production URL**: `https://nutrient-dws-api.vercel.app/hello-world-addin/`

## 📝 Development

### Local Development
1. Clone the repository
2. Navigate to `public/hello-world-addin/`
3. Edit files as needed
4. Deploy to Vercel

### File Modifications
- **HTML**: Edit `index.html` for structure changes
- **CSS**: Modify `styles.css` for styling updates
- **JavaScript**: Update `app.js` for functionality changes
- **Manifest**: Edit `manifest.xml` for Office integration

## 🎉 Success Indicators

✅ **Add-in appears in Word ribbon**
✅ **Task pane opens when clicked**
✅ **Hello World text inserts correctly**
✅ **Document info displays properly**
✅ **Status updates work**
✅ **Animations are smooth**

## 🌿 About Nutrient.io

This add-in showcases Nutrient.io's commitment to:
- **Simple, effective solutions**
- **Beautiful user interfaces**
- **Modern web technologies**
- **Office integration expertise**

## 📞 Support

For questions or issues:
1. Check the troubleshooting section
2. Verify all URLs are accessible
3. Test with a simple document first
4. Check browser console for errors

---

**🎉 Ready to use!** Your Nutrient.io Hello World add-in is ready to bring some green to your Word documents! 🌿 