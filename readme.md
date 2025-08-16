# 📅 My Availability

A Next.js SSR web app that helps you quickly generate and edit your weekly availability by pasting a screenshot of your Outlook calendar. Designed for speed, clarity, and control—no API integrations required.

---

## 🎯 High-Level Goal

To streamline the process of generating a human-readable availability summary from a visual calendar screenshot. This tool uses OCR to extract events, calculates free time slots based on customizable working hours, and presents everything in an editable format.

---

## ⚙️ Core Functionality

### 🖼️ Paste Screenshot from Clipboard

- Paste a screenshot of your calendar in list view (e.g. Outlook)
- Image preview appears instantly—no file upload required

### 🔍 OCR Event Extraction

- Uses Tesseract.js to extract text from the pasted image
- Parses multi-day calendar entries with times and dates

### 🗓️ Custom Date Range

- Select start and end dates for availability generation
- Defaults to today through the next 5 working days (Mon–Fri)

### ⏰ Custom Working Hours

- Define your working day (e.g. 09:30–17:00 or 10:00–18:30)
- Availability is calculated within this window

### ✏️ Editable Event & Availability Fields

- Extracted events appear in a text box for manual correction
- Suggested availability is editable and formatted like:
  - 18 August Monday: 09:30 - 12:00, 13:30 - 15:00
  - 19 August Tuesday: 10:30 - 13:00

### 🧠 Smart Availability Logic

- If no events on a day, full working hours are shown as available
- Overlapping events are merged before calculating free slots

---

## 🛠️ Tech Stack

- **Next.js** with Server-Side Rendering
- **React** for UI components
- **Tailwind CSS** for styling
- **Tesseract.js** for OCR
- **date-fns** for time parsing and formatting

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

📌 Future Enhancements

• Export availability to clipboard or file
• Support recurring events or multi-week ranges
• Add timezone and locale customization

## 🧑‍💻 Built for

People who want fast, editable control over their weekly availability—especially useful for interviews, scheduling tools, or productivity workflows.
