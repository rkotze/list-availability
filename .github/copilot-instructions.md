# GitHub Copilot Instructions

## Architecture Overview

- The project is a Next.js application with a well-defined separation between UI components (`components/` and `pages/`), business logic (`utils/availability.ts`), and specialized processing (`lib/ocr.ts`).
- The availability generation relies on parsing textual event data and calculating free slots based on user-defined work hours and date ranges.
- Components like `availability-editor.tsx`, `event-editor.tsx`, and `date-range-selector.tsx` work in tandem to provide an interactive scheduling interface.

## Critical Developer Workflows

- **Build & Run**: The project uses npm scripts for development (`npm run dev`) and production builds (`npm run build`). Tailwind CSS is configured via `postcss.config.mjs` and integrated in `styles/globals.css`.
- **Debugging**: Use VS Code breakpoints and the integrated terminal; key commands like `npm i -D @tailwindcss/postcss` are used for dependency management.
- **Testing**: While explicit tests may not be present, manual UI checks and state updates (e.g., toggling exclude weekends) are critical.

## Project-Specific Conventions and Patterns

- **Date and Time Handling**: The project uses the `date-fns` library for date formatting and calculations, as seen in `utils/availability.ts` and component files.
- **Event Parsing**: Events are parsed from text with a specific format (e.g., matching dates and time ranges) and processed to generate availability slots.
- **UI Component Patterns**: Components adhere to clear, functional React patterns with well-defined props. For example, the `DateRangeSelector` component manages and passes date values, and the `AvailabilityEditor` includes built-in copy-to-clipboard functionality.
- **Styling**: Use of Tailwind CSS classes is consistent across components for layout and interactive states (e.g., buttons, input fields).

## Integration Points & Communication

- **Data Flow**: The main page (`pages/index.tsx`) orchestrates state management for work hours, date ranges, and event text, and passes these as props to child components to update availability in real-time.
- **OCR Integration**: The `lib/ocr.ts` module is used for extracting text from pasted images, feeding into the event parsing logic.
- **User Interaction**: Features like the 