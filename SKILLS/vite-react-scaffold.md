# Skill: Scaffold a React + Vite + Router + CSS Modules Project

## Problem
You need to start a new React frontend fast, with proper routing and scoped styles.

## Solution
```bash
mkdir client && cd client
npm init -y
npm install react react-dom react-router-dom
npm install -D vite @vitejs/plugin-react
```

`package.json` essentials:
```json
{
  "type": "module",
  "scripts": { "dev": "vite", "build": "vite build", "preview": "vite preview" },
  "dependencies": { "react": "^18.3.1", "react-dom": "^18.3.1", "react-router-dom": "^6.26.2" },
  "devDependencies": { "vite": "^5.4.2", "@vitejs/plugin-react": "^4.3.1" }
}
```

`vite.config.js`:
```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({ plugins: [react()], server: { port: 5173, open: true } });
```

`index.html` (project root):
```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

`src/main.jsx`:
```jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/global.css";
createRoot(document.getElementById("root")).render(
  <React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>
);
```

## Design tokens pattern (single source for colors)
Put CSS variables in `src/styles/tokens.css`, import it from `global.css`:
```css
@import "./tokens.css";
:root { --color-primary: #4d96ff; /* ... */ }
```

## Gotchas
- **`type: "module"` must be set** in package.json or Vite ESM imports fail.
- **BrowserRouter needs a server** — for static hosting use `HashRouter` instead.
- **CSS Modules** require the `*.module.css` naming convention; a plain `.css`
  import is global. Both can coexist.
- Always verify with `npm run build` after wiring routes — catches all import
  errors at once.
