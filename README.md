# 📁 File Server

A simple, lightweight file upload server with a beautiful web interface and REST API. Perfect for temporary file sharing, testing, and development workflows.

## ✨ Features

- 🌐 **Web Interface** - Beautiful HTML upload form at `http://localhost:3000`
- 🔗 **REST API** - Simple POST endpoint for programmatic uploads
- 📂 **Original Filenames** - Preserves original file names
- 🗂️ **Temporary Storage** - Uses system temp directory with auto-cleanup
- 🎨 **Modern UI** - Responsive design with real-time feedback
- 🔒 **ISC License** - Permissive open-source license

## 🚀 Quick Start

### Using npx (Recommended)
```bash
npx @snoggin-io/file-server
```
*No installation required! Starts immediately.*

### Global Installation
```bash
npm install -g @snoggin-io/file-server
file-server
```

### Local Installation
```bash
npm install @snoggin-io/file-server
npx @snoggin-io/file-server
```

### From Source
```bash
git clone https://github.com/snoggin-io/file-server.git
cd file-server
npm install
npm start
```

## 📖 Usage

### Web Interface

1. Start the server:
   ```bash
   npx @snoggin-io/file-server
   ```

2. Open your browser to `http://localhost:3000`

3. Select a file and click "Upload File"

4. Get an instant shareable URL

### API Usage

Upload a file via curl:
```bash
curl -X POST -F "file=@document.pdf" http://localhost:3000/upload
```

Response:
```json
{
  "filename": "document.pdf",
  "url": "http://localhost:3000/files/document.pdf"
}
```

### Environment Variables

- `PORT` - Server port (default: 3000)

Example:
```bash
PORT=8080 npx @snoggin-io/file-server
```

## 🔧 API Reference

### `POST /upload`

Upload a file via multipart form-data.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: File with key `file`

**Response:**
```json
{
  "filename": "example.pdf",
  "url": "http://localhost:3000/files/example.pdf"
}
```

**Error Response:**
```json
{
  "error": "No file uploaded"
}
```

### `GET /files/:filename`

Download or view an uploaded file.

**Request:**
- Method: `GET`
- Path: `/files/{filename}`

**Response:**
- File content with appropriate headers

### `GET /`

Access the web upload interface.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Browser   │────│   File Server   │────│  Temp Directory │
│                 │    │                 │    │                 │
│ Upload Form     │    │ Express.js      │    │ /tmp/file-      │
│ File Display    │    │ Multer          │    │ server-xxxxx/   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 File Storage

- Files are stored in a unique temporary directory
- Directory path: `/tmp/file-server-{random}/` (Linux/macOS) or `%TEMP%\file-server-{random}\` (Windows)
- **Auto-cleanup**: Directory is removed when server shuts down
- **Collision handling**: Files with same name will overwrite previous uploads

## 🔒 Security Considerations

- Files are stored temporarily and cleaned up on exit
- No authentication or authorization
- Intended for development and testing environments
- **Not recommended for production without additional security measures**

## 🛠️ Development

### Prerequisites
- Node.js 14+ 
- npm or yarn

### Setup
```bash
git clone https://github.com/snoggin-io/file-server.git
cd file-server
npm install
```

### Scripts
```bash
npm start      # Start development server with ts-node
npm run build  # Build TypeScript to JavaScript
```

### Project Structure
```
file-server/
├── src/
│   └── index.ts        # Main server code
├── dist/               # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## 📦 Dependencies

- **express** - Web framework
- **multer** - File upload middleware
- **@types/express** - TypeScript definitions
- **@types/multer** - TypeScript definitions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- 📫 Create an issue for bug reports or feature requests
- ⭐ Star the repository if you find it useful
- 🔄 Share with others who might benefit

## 🗂️ Use Cases

- **Quick File Sharing** - Share files instantly without cloud storage accounts
- **Development Testing** - Test file upload functionality in applications
- **Temporary File Hosting** - Host files temporarily for demos or testing
- **CI/CD Pipelines** - File transfer in automated workflows
- **Local Development** - Mock file upload services during development
- **Prototyping** - Quick file handling for prototypes and POCs
- **Cross-device Transfer** - Transfer files between devices on same network

---

Made with ❤️ using Node.js and TypeScript