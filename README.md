# ShiftFile Tools

![MIT License](https://img.shields.io/badge/License-MIT-green.svg)
![Live](https://img.shields.io/badge/live-shiftfile.tools-blue)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-ready-lightgrey)

**ShiftFile Tools** is a collection of 14 free, private, in-browser file conversion tools. No uploads, no registration, no watermarks.

🔗 **Live Demo:** [https://shiftfile.tools](https://shiftfile.tools)

## Features

- **14 Tools**: Image Converter, Image Compressor, Image Resizer, SVG to PNG, Images to PDF, JSON ↔ CSV, Markdown ↔ HTML, Base64 Converter, URL Encoder, HTML Entities, Case Converter, Slug Generator, Color Converter, Number Base Converter.
- **100% Browser-based**: All processing happens locally using vanilla JavaScript.
- **Dark Mode**: Automatic system preference detection + manual toggle with localStorage.
- **PWA**: Works offline after the first visit.
- **SDK**: `ShiftFile` global object for developers.

## Tech Stack

- HTML5 + CSS3 + Vanilla JavaScript (ES6)
- No build step, no framework, no backend
- jsPDF (CDN) for PDF generation
- Service Worker for offline caching

## Installation

Clone the repository and open `index.html` in any modern browser.

```bash
git clone https://github.com/yourusername/shiftfile-tools.git
cd shiftfile-tools
```

No `npm install` required. The site is fully static.

## Deployment

### GitHub Pages

1. Push the repository to GitHub.
2. Go to Settings → Pages.
3. Select the `main` branch and root (`/`) folder.
4. Save. Your site will be live at `https://yourusername.github.io/shiftfile-tools/`.

### Hostinger / Any Static Host

Upload all files to the `public_html` (or equivalent) directory via FTP or the file manager.

## License

MIT — Copyright (c) 2026 ShiftFile Tools. See [LICENSE](LICENSE) for details.

## Contact

- **Email:** hello@shiftfile.tools
- **Website:** [https://shiftfile.tools](https://shiftfile.tools)
