# NormCat Frontend — E-Commerce Catalog & Normalization Platform

Interactive React + TypeScript web frontend for the **NormCat** platform, demonstrating multi-vendor catalog exploration, dynamic faceted search, deterministic attribute normalization, and dual-storage auditing.

---

## 🚀 Key Highlights & Features (DAY 06)

1. **🛍️ Catalog & Faceted Search Explorer:**
   - **Dynamic Facets:** Filter products concurrently by category hierarchy, price range bounds (`minPrice`, `maxPrice`), and dynamic attributes (`attrs[RAM]`, `attrs[STORAGE]`, `attrs[COLOR]`, `attrs[SCREEN_SIZE]`).
   - **Debounced Keyword Search:** Search across product names and unique SKUs.
   - **Canonical Attributes Chips:** Instant visual display of normalized standardized attributes.
   - **Pagination & Sorting:** Powered by backend `PageResponse<T>` and Postgres indexing.

2. **⚡ Normalization Studio & Ingestion Simulator:**
   - **Live Ingestion Playground:** Enter vendor payloads with unstructured and messy raw attributes.
   - **1-Click Presets:** Test MacBook Pro, Dell XPS, or unmapped attributes.
   - **Deterministic 2-Phase Resolution:** Inspect the execution of Key Resolution and Value Resolution in real-time.
   - **Dual-Storage Visualizer:** Side-by-side comparison of immutable vendor raw JSONB snapshot vs canonical relational attributes (`product_attribute_values`).

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript (Strict mode)
- **Bundler:** Vite 8
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **HTTP Client:** Axios (configured with Vite development reverse-proxy)
- **Deployment:** Firebase Hosting ready

---

## 📦 Getting Started

### 1. Prerequisites
- Node.js >= 20.x
- `normcat-backend` running on `http://localhost:8080` (or Docker container `normcat-postgres`)

### 2. Installation
```bash
git clone https://github.com/D60-ThinhLS-ImprovementPlan/normcat-frontend.git
cd normcat-frontend
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. All API requests to `/api/v1/*` are automatically proxied to the backend at `http://localhost:8080/api/v1/*`.

### 4. Build for Production
```bash
npm run build
```
Production assets are generated in the `dist/` directory.

---

## 🔗 Architecture Link
- Backend Repository: [D60-ThinhLS-ImprovementPlan/normcat-backend](https://github.com/D60-ThinhLS-ImprovementPlan/normcat-backend)
