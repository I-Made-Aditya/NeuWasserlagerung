<<<<<<< HEAD
# NeuWasserlagerung
=======
# Voltage Monitoring System — Vue 3

Aplikasi web monitoring tegangan listrik berbasis Vue 3 dengan Vue CLI.

## Struktur Proyek

```
voltage-monitoring/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   │   └── global.css          # CSS variables & global styles
│   ├── components/
│   │   ├── types.js            # JSDoc type definitions
│   │   ├── mockData.js         # Data & helper functions
│   │   ├── FieldBox.vue        # Field display component
│   │   ├── ActionBtn.vue       # Action button component
│   │   ├── Toggle.vue          # Toggle switch component
│   │   ├── FormSection.vue     # Form section wrapper
│   │   ├── FormField.vue       # Form field wrapper
│   │   ├── ConfigRow.vue       # Main config row
│   │   ├── SettingsModal.vue   # Settings modal
│   │   ├── DataModal.vue       # Raw data table modal
│   │   └── GraphModal.vue      # Chart modal (Chart.js)
│   ├── App.vue                 # Root component
│   └── main.js                 # Entry point
├── .eslintrc.js
├── babel.config.js
├── package.json
└── vue.config.js
```

## Setup & Instalasi

### Prasyarat
- Node.js >= 14
- npm >= 6

### Install Dependencies

```bash
npm install
```

### Jalankan Development Server

```bash
npm run serve
```

Buka browser di `http://localhost:8080`

### Build Production

```bash
npm run build
```

## Perbedaan dari React (App.tsx)

| React | Vue 3 |
|-------|-------|
| `useState` | `ref`, `reactive` |
| `useEffect` | `onMounted`, `onUnmounted`, `watch` |
| JSX / TSX | Single File Components (`.vue`) |
| Props + callbacks | Props + `emits` |
| `className` | `class` |
| Tailwind CSS | Plain CSS + CSS Variables |
| TypeScript interfaces | JSDoc `@typedef` |
| `createPortal` | `<Teleport to="body">` |
| `v-model` pattern | `modelValue` prop + `update:modelValue` emit |

## Dependencies

- `vue` ^3.3.0 — Framework utama
- `chart.js` ^4.4.0 — Library charting
- `vue-chartjs` ^5.3.0 — Chart.js wrapper untuk Vue
- `chartjs-plugin-zoom` ^2.0.1 — Zoom & pan plugin
- `hammerjs` ^2.0.8 — Touch events (diperlukan oleh zoom plugin)
>>>>>>> 6cde85d (voltage monitoring setup - ON PGORESS)
