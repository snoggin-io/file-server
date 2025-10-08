#!/usr/bin/env node

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import os from "os";

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'file-server-'));

// Configure multer to preserve original filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Keep original filename
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// Serve uploaded files
app.use("/files", express.static(UPLOAD_DIR));

// Serve upload form at root
app.get("/", (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>File Upload Server</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                max-width: 600px;
                margin: 50px auto;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 {
                color: #333;
                text-align: center;
                margin-bottom: 30px;
            }
            .upload-form {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            input[type="file"] {
                padding: 10px;
                border: 2px dashed #ddd;
                border-radius: 5px;
                background: #fafafa;
            }
            button {
                background: #007acc;
                color: white;
                padding: 12px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
            }
            button:hover {
                background: #005a9e;
            }
            button:disabled {
                background: #ccc;
                cursor: not-allowed;
            }
            .result {
                margin-top: 20px;
                padding: 15px;
                border-radius: 5px;
                display: none;
            }
            .success {
                background: #d4edda;
                border: 1px solid #c3e6cb;
                color: #155724;
            }
            .error {
                background: #f8d7da;
                border: 1px solid #f5c6cb;
                color: #721c24;
            }
            .file-link {
                color: #007acc;
                text-decoration: none;
                word-break: break-all;
            }
            .file-link:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>📁 File Upload Server</h1>
            <form class="upload-form" id="uploadForm" enctype="multipart/form-data">
                <input type="file" name="file" id="fileInput" required>
                <button type="submit" id="uploadBtn">Upload File</button>
            </form>
            <div id="result" class="result"></div>
        </div>

        <script>
            document.getElementById('uploadForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const fileInput = document.getElementById('fileInput');
                const uploadBtn = document.getElementById('uploadBtn');
                const result = document.getElementById('result');
                
                if (!fileInput.files[0]) {
                    showResult('Please select a file to upload.', 'error');
                    return;
                }
                
                uploadBtn.disabled = true;
                uploadBtn.textContent = 'Uploading...';
                result.style.display = 'none';
                
                const formData = new FormData();
                formData.append('file', fileInput.files[0]);
                
                try {
                    const response = await fetch('/upload', {
                        method: 'POST',
                        body: formData
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        showResult(\`
                            <strong>✅ Upload successful!</strong><br>
                            <strong>File:</strong> \${data.filename}<br>
                            <strong>URL:</strong> <a href="\${data.url}" target="_blank" class="file-link">\${data.url}</a>
                        \`, 'success');
                        fileInput.value = '';
                    } else {
                        showResult(\`❌ Error: \${data.error || 'Upload failed'}\`, 'error');
                    }
                } catch (error) {
                    showResult(\`❌ Error: \${error.message}\`, 'error');
                }
                
                uploadBtn.disabled = false;
                uploadBtn.textContent = 'Upload File';
            });
            
            function showResult(message, type) {
                const result = document.getElementById('result');
                result.innerHTML = message;
                result.className = \`result \${type}\`;
                result.style.display = 'block';
            }
        </script>
    </body>
    </html>
  `;
  res.send(html);
});

// Upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  
  const fileUrl = `http://localhost:${PORT}/files/${req.file.filename}`;
  
  res.json({ 
    filename: req.file.filename, 
    url: fileUrl
  });
});

app.listen(PORT, () => {
  console.log(`File server running on http://localhost:${PORT}`);
  console.log(`Upload files via POST /upload (form-data key="file")`);
  console.log(`Access files at /files/:filename`);
  console.log(`Temporary upload directory: ${UPLOAD_DIR}`);
});

// Cleanup temporary directory on exit
process.on('exit', () => {
  try {
    fs.rmSync(UPLOAD_DIR, { recursive: true, force: true });
    console.log('Temporary directory cleaned up');
  } catch (error) {
    console.error('Error cleaning up temporary directory:', error);
  }
});

process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  process.exit(0);
});
