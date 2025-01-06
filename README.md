# 🚗 Carzone Comparison Tool

A command-line tool for comparing multiple Carzone.ie listings in a structured format. Simplifies car research by collecting key information in one place.

## 🎯 Features

Extracts key details from Carzone.ie listings:
- 💰 Price
- 🔍 NCT Status
- 📍 Location
- ⚙️ Key Features
- 🕹️ Transmission
- 📜 Road Tax
- 🛣️ Mileage
- ⛽ Fuel Type

## 🚀 Quick Start

```bash
npx carzone-scraper
```

## 📖 Usage

1. Collect Carzone.ie listing URLs (e.g., https://www.carzone.ie/used-cars/hyundai/santa-fe/fpa/3799390)
2. Run the tool and input URLs (comma-separated)
3. View comparison table
4. Optionally export to CSV or Excel

## 📊 Output Formats

- Terminal Table
- CSV Export
- Excel Export

## 📦 Installation

For global installation:
```bash
npm install -g carzone-scraper
carzone-scraper
```

## ⚙️ Requirements

- Node.js 16+
- Active internet connection

## ⚠️ Limitations

- Works only with Carzone.ie listing URLs
- Requires full listing URLs, not search results

## 📝 License

MIT

---
For bug reports and feature requests, please open an issue on GitHub.
