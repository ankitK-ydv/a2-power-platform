# Integration Guide - React Landing Page with Express Backend

## Overview

Your A² POWER website currently uses Express.js for the backend. We've created a modern React landing page component that can be integrated in several ways.

## 🎯 Integration Options

### Option 1: **Vite + React (RECOMMENDED)**

**Best for:** Modern development workflow, fast HMR, small bundle size

#### Setup Steps:

1. **Create Vite project:**

```bash
npm create vite@latest landing -- --template react
cd landing
npm install
```

2. **Copy files:**
   - Copy `LandingPage.jsx` → `src/components/LandingPage.jsx`
   - Copy `tailwind.config.js` → root directory
   - Copy `src/index.css` → `src/index.css`

3. **Install dependencies:**

```bash
npm install framer-motion lucide-react
npm install -D tailwindcss postcss autoprefixer
```

4. **Update `src/App.jsx`:**

```jsx
import LandingPage from "./components/LandingPage";

function App() {
  return <LandingPage />;
}

export default App;
```

5. **Run development:**

```bash
npm run dev
```

6. **Build for production:**

```bash
npm run build
# Output: dist/ folder
```

---

### Option 2: **Create React App**

**Best for:** Familiar setup, comprehensive tooling

#### Setup Steps:

1. **Create app:**

```bash
npx create-react-app landing
cd landing
npm install
```

2. **Install dependencies:**

```bash
npm install framer-motion lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

3. **Copy files:**
   - `LandingPage.jsx` → `src/components/LandingPage.jsx`
   - `tailwind.config.js` → root
   - `src/index.css` → `src/index.css`

4. **Update `src/App.js`:**

```jsx
import LandingPage from "./components/LandingPage";

function App() {
  return <LandingPage />;
}

export default App;
```

5. **Start dev server:**

```bash
npm start
```

---

### Option 3: **Embed in Express (Advanced)**

**Best for:** Single repository, simple deployment

#### Setup Steps:

1. **Install React dependencies in your Express project:**

```bash
npm install react react-dom framer-motion lucide-react
npm install -D @vitejs/plugin-react vite tailwindcss postcss autoprefixer
```

2. **Create `vite.config.js` in project root:**

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "public/dist",
    emptyOutDir: false,
  },
});
```

3. **Create `src/main.jsx`:**

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import LandingPage from "./LandingPage";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LandingPage />
  </React.StrictMode>,
);
```

4. **Create `public/index.html`:**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>A² POWER - Local Business Websites</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/dist/main.js"></script>
  </body>
</html>
```

5. **Update `package.json` scripts:**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "start": "node server.js"
  }
}
```

6. **Update `server.js`:**

```javascript
// ... existing Express setup ...

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/payment", paymentRoutes);
app.use("/api/client", clientRoutes);

// SPA fallback - serve index.html for all non-API routes
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api/")) {
    return res.sendFile(path.join(__dirname, "public", "index.html"));
  }
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

7. **Build and run:**

```bash
npm run build
npm start
```

---

## 📂 Project Structure (Option 1 - Recommended)

```
asquare/
├── landing/                    # React Vite app
│   ├── src/
│   │   ├── components/
│   │   │   └── LandingPage.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── index.html
├── server.js
├── package.json
├── controllers/
├── models/
├── routes/
└── public/
    └── (static assets)
```

---

## 🚀 Deployment Options

### Option A: Two Separate Deployments

1. **Frontend:** Deploy React app to Vercel, Netlify, or AWS
   - Frontend URL: `https://landing.asquarepower.com`

2. **Backend:** Keep Express on your current hosting
   - API URL: `https://api.asquarepower.com`

3. **API Calls:** Update React component to call your Express API:

```javascript
const API_BASE = "https://api.asquarepower.com";

fetch(`${API_BASE}/api/client/submit`, {
  /* ... */
});
```

---

### Option B: Single Deployment with Express

1. **Build React:**

```bash
cd landing
npm run build
```

2. **Copy to Express:**

```bash
# Copy the built files
cp -r landing/dist/* server/public/
```

3. **Deploy entire project:**

```bash
git push origin main
# Your hosting automatically deploys
```

---

## 🔗 API Integration

### Connect React Landing Page to Express Backend

**In `LandingPage.jsx`, add API calls:**

```javascript
// Handle CTA Button Click
const handleGetWebsite = async () => {
  try {
    const response = await fetch("https://your-api.com/api/client/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        business_name: "Your Business",
        phone: "9999999999",
        email: "business@email.com",
      }),
    });

    if (response.ok) {
      // Show success message
      console.log("Inquiry submitted!");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
```

---

## 🌍 Environment Variables

Create `.env` file:

```
VITE_API_URL=https://api.asquarepower.com
VITE_WHATSAPP_NUMBER=919999999999
VITE_PHONE_NUMBER=919999999999
VITE_EMAIL=hello@asquarepower.com
```

Access in React:

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
```

---

## 📊 Performance Metrics

After deployment, monitor:

- **Lighthouse Score:** Aim for 90+
- **Core Web Vitals:**
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

**Tools to use:**

- Google PageSpeed Insights
- Lighthouse CI
- WebPageTest

---

## 🔒 Security Considerations

1. **Environment Variables:** Never commit `.env` file
2. **CORS:** Configure in Express if frontend is on different domain
3. **Rate Limiting:** Implement on API endpoints
4. **Input Validation:** Sanitize all form inputs

```javascript
// In server.js
const cors = require("cors");

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
```

---

## 🔄 Continuous Deployment

### Using GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy
        run: npm run deploy
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
```

---

## 🛠️ Troubleshooting

### React doesn't load

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Tailwind styles not applied

```bash
# Rebuild Tailwind
npm run build:css
```

### Framer Motion animations not working

```bash
# Check version
npm list framer-motion

# Update if needed
npm install framer-motion@latest
```

### CORS errors in API calls

```javascript
// Add to Express server.js
const cors = require("cors");
app.use(cors());
```

---

## 📞 Support

For integration help:

1. Check build logs: `npm run build`
2. Test locally: `npm run dev`
3. Verify API endpoints in browser DevTools
4. Check browser console for errors

---

## ✅ Deployment Checklist

- [ ] Dependencies installed
- [ ] Environment variables set
- [ ] API endpoints tested
- [ ] Mobile responsive verified
- [ ] Animations working smoothly
- [ ] SEO meta tags added
- [ ] Google Analytics added
- [ ] SSL certificate active
- [ ] Performance optimized
- [ ] All links functional
- [ ] WhatsApp integration working
- [ ] Testimonials updated
- [ ] Contact info updated

---

**Ready to deploy! 🚀**
