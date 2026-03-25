# 🌱 Digital Carbon Footprint Tracker - Frontend

## 📌 Overview
The frontend of the Digital Carbon Footprint Tracker is designed to provide a simple and interactive user interface for analyzing website carbon emissions.

Users can enter any website URL and instantly view insights about data usage, energy consumption, and CO₂ emissions in a clean and user-friendly way.

---

## 🚀 Features
- 🌐 Input any website URL
- ⚡ Display energy consumption per visit
- 🌍 Show CO₂ emissions data
- 📊 Visual representation of results
- 💡 Suggestions for optimization
- 🎯 Clean and responsive UI

---

## 🛠️ Tech Stack
- HTML
- CSS
- JavaScript
- React
- Tailwind CSS

---

## ⚙️ How It Works
1. User enters a website URL
2. Frontend sends request to backend API
3. Receives analysis data
4. Displays:
   - Data size
   - Energy consumption
   - CO₂ emissions
   - Optimization suggestions

---

## 🔗 API Integration

### Endpoint Used
```
POST http://localhost:8080/api/analyze
```

### Example Request
```json
{
  "url": "https://example.com"
}
```

---

