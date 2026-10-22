# SaveConvert
🔐 **Your files stay in your browser, not on our server.**  Turn photos into PDFs and Word docs into PDFs without uploading your files to a custom backend. Your documents stay on your device during conversion — more privacy, less stress. 


**Convert your files, not your privacy.**

SafeConvert is a browser-based file conversion tool that lets you convert multiple photos into a single PDF and Word documents (`.docx`) into PDFs.

Your files are processed in your browser without being uploaded to a custom backend.

## Features

- **Photos to PDF:** Combine multiple photos into one PDF.
- **Word to PDF:** Convert `.docx` documents using your browser's print dialog.
- **Photo Preview:** Preview selected photos before conversion.
- **Privacy-focused:** File contents are processed locally in the browser rather than sent to an application server.
- **Simple Interface:** Easy to use, with no complicated setup.

## Tech Stack

- HTML
- CSS
- JavaScript
- [jsPDF](https://github.com/parallax/jsPDF)
- [docx-preview](https://github.com/VolodymyrBaydalka/docxjs)
- [JSZip](https://github.com/Stuk/jszip)

## Getting Started

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Replace the placeholder with your repository URL.

### 2. Open the Project

Open the project folder in Visual Studio Code.

### 3. Run the Website

Open `index.html` in your browser, or use the Live Server extension in VS Code.

## How to Use

### Photos to PDF
1. Select the photo-to-PDF tool.
2. Choose the photos you want to combine.
3. Preview your selected photos.
4. Convert them into a single PDF.

### Word to PDF
1. Select the Word-to-PDF tool.
2. Choose a `.docx` file.
3. Start the conversion.
4. Select **Save as PDF** in the browser's print dialog.

## Privacy

SafeConvert is designed to process files locally in the browser without uploading their contents to a custom application backend.

The current version loads JavaScript libraries from external CDNs, which make network requests. The project has not undergone an independent security audit, so absolute privacy cannot be guaranteed.

## Limitations

- Complex Word document formatting may vary in the generated PDF.
- An internet connection may be needed to load the external libraries.
- Conversion behavior may vary across browsers.

## Project Goal

To make everyday file conversion simple, accessible, and more privacy-conscious by processing files directly in the browser.

## Author

Developed as a web development project using HTML, CSS, and JavaScript.
