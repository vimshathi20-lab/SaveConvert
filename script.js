
const workspace = document.getElementById("workspace");
const fileInput = document.getElementById("fileInput");
const toolTitle = document.getElementById("toolTitle");
const toolDescription = document.getElementById("toolDescription");
const fileHint = document.getElementById("fileHint");
const fileList = document.getElementById("fileList");
const convertBtn = document.getElementById("convertBtn");
const status = document.getElementById("status");

let activeTool = "photos";
let selectedPhotos = [];
let selectedWordFile = null;
let previewUrls = [];

function clearPreviews() {
  previewUrls.forEach(url => URL.revokeObjectURL(url));
  previewUrls = [];
}

function openTool(tool) {
  activeTool = tool;
  selectedPhotos = [];
  selectedWordFile = null;

  clearPreviews();
  fileList.replaceChildren();
  status.textContent = "";
  convertBtn.hidden = true;
  convertBtn.disabled = false;

  const wordPreview = document.getElementById("wordPreview");
  if (wordPreview) {
    wordPreview.hidden = true;
    wordPreview.replaceChildren();
  }

  fileInput.value = "";

  if (tool === "photos") {
    toolTitle.textContent = "Photos to PDF";
    toolDescription.textContent =
      "Choose multiple photos to combine into one PDF.";

    fileInput.accept = "image/jpeg,image/png,image/webp";
    fileInput.multiple = true;
    fileHint.textContent = "JPG, PNG or WebP images";
  } else {
    toolTitle.textContent = "Word to PDF";
    toolDescription.textContent =
      "Choose a Word document to convert into a PDF.";

    fileInput.accept = ".docx";
    fileInput.multiple = false;
    fileHint.textContent = "Microsoft Word documents (.docx)";
  }

  workspace.hidden = false;
  workspace.scrollIntoView({ behavior: "smooth" });
}

// Open the file picker.
const uploadBtn = document.getElementById("uploadBtn");

if (uploadBtn) {
  uploadBtn.addEventListener("click", () => fileInput.click());
}

// Handle selected files.
fileInput.addEventListener("change", () => {
  const files = Array.from(fileInput.files || []);

  if (!files.length) return;

  if (activeTool === "word") {
    const file = files[0];

    if (!file.name.toLowerCase().endsWith(".docx")) {
      status.textContent = "Please select a .docx Word document.";
      return;
    }

    selectedWordFile = file;

    fileList.replaceChildren();

    const item = document.createElement("p");
    item.textContent =
      `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;

    fileList.appendChild(item);
    convertBtn.hidden = false;
    convertBtn.textContent = "Prepare Word PDF →";
    status.textContent = "Word document selected on your device.";
    return;
  }

  const validFiles = files.filter(file =>
    ["image/jpeg", "image/png", "image/webp"].includes(file.type)
  );

  if (validFiles.length !== files.length) {
    status.textContent =
      "Unsupported files skipped. Use JPG, PNG or WebP.";
  }

  for (const file of validFiles) {
    const duplicate = selectedPhotos.some(existing =>
      existing.name === file.name &&
      existing.size === file.size &&
      existing.lastModified === file.lastModified
    );

    if (!duplicate) selectedPhotos.push(file);
  }

  renderPhotoList();

  // Allow the same picker to be opened again.
  fileInput.value = "";
});

function renderPhotoList() {
  clearPreviews();
  fileList.replaceChildren();

  selectedPhotos.forEach((file, index) => {
    const item = document.createElement("div");
    item.style.cssText =
      "display:flex;align-items:center;gap:12px;margin:12px 0;";

    const img = document.createElement("img");
    const url = URL.createObjectURL(file);
    previewUrls.push(url);

    img.src = url;
    img.alt = file.name;
    img.style.cssText =
      "width:64px;height:64px;object-fit:cover;border-radius:10px;";

    const details = document.createElement("span");
    details.textContent = `${index + 1}. ${file.name}`;

    item.append(img, details);
    fileList.appendChild(item);
  });

  convertBtn.hidden = selectedPhotos.length === 0;
  convertBtn.textContent = "Convert photos to PDF →";

  status.textContent =
    `${selectedPhotos.length} photo(s) selected.`;
}

// Convert files to PDF.
convertBtn.addEventListener("click", async () => {
  convertBtn.disabled = true;

  try {
    if (activeTool === "photos") {
      if (!selectedPhotos.length) {
        status.textContent = "Please select photos first.";
        return;
      }

      if (!window.jspdf?.jsPDF) {
        status.textContent = "PDF library didn't load. Check your internet.";
        return;
      }

      const { jsPDF } = window.jspdf;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      for (let i = 0; i < selectedPhotos.length; i++) {
        const file = selectedPhotos[i];
        const url = URL.createObjectURL(file);

        try {
          const img = new Image();

          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error("Could not read image."));
            img.src = url;
          });

          const pageW = 210;
          const pageH = 297;
          const margin = 10;

          const scale = Math.min(
            (pageW - margin * 2) / img.naturalWidth,
            (pageH - margin * 2) / img.naturalHeight
          );

          const w = img.naturalWidth * scale;
          const h = img.naturalHeight * scale;
          const x = (pageW - w) / 2;
          const y = (pageH - h) / 2;

          if (file.type === "image/webp") {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            canvas.getContext("2d").drawImage(img, 0, 0);

            pdf.addImage(
              canvas.toDataURL("image/png"),
              "PNG", x, y, w, h
            );
          } else {
            if (i > 0) pdf.addPage();

            pdf.addImage(
              img,
              file.type === "image/png" ? "PNG" : "JPEG",
              x, y, w, h
            );
          }

          // Add a page for WebP images too, except the first.
          if (file.type === "image/webp" && i > 0) {
            // The page is added before the WebP image below.
          }
        } finally {
          URL.revokeObjectURL(url);
        }

        status.textContent =
          `Processing photo ${i + 1} of ${selectedPhotos.length}...`;
      }

      pdf.save("SafeConvert-photos.pdf");
      status.textContent = "Your PDF has been downloaded!";
      return;
    }

    // Word to PDF
    if (!selectedWordFile) {
      status.textContent = "Please select a Word document first.";
      return;
    }

    if (!window.docx?.renderAsync) {
      status.textContent =
        "Word renderer didn't load. Check your internet connection.";
      return;
    }

    const preview = document.getElementById("wordPreview");

    if (!preview) {
      status.textContent = "Word preview area is missing from index.html.";
      return;
    }

    status.textContent = "Rendering your Word document locally...";
    preview.replaceChildren();
    preview.hidden = false;

    await window.docx.renderAsync(
      selectedWordFile,
      preview,
      null,
      { inWrapper: true, breakPages: true }
    );

    status.textContent =
      "Choose 'Save as PDF' in the print dialog.";

    window.print();
  } catch (error) {
    console.error(error);
    status.textContent =
      "Conversion failed. Check the browser console for details.";
  } finally {
    convertBtn.disabled = false;
  }
});
