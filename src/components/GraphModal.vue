<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-panel modal-panel--xl">
        <!-- Header -->
        <div class="modal-header">
          <div class="modal-title-group">
            <div class="modal-icon-wrap modal-icon-wrap--teal">
              <BarChartIcon />
            </div>
            <div>
              <p class="modal-title">Voltage Graph</p>
              <p class="modal-subtitle">
                #{{ config.id }} · {{ config.projectName }} / {{ config.lomNr }} · {{ config.description }}
              </p>
            </div>
          </div>
          <button class="close-btn" @click="$emit('close')">
            <CloseIcon />
          </button>
        </div>

        <!-- Controls toolbar -->
        <div class="graph-toolbar">
          <div class="toolbar-group">
            <span class="toolbar-label">Channel</span>
            <select class="form-input toolbar-select" v-model="selectedCh">
              <option value="all">All Channels</option>
              <option v-for="i in 10" :key="i" :value="i">CH{{ i }}</option>
            </select>
          </div>
          <div class="toolbar-group ml-8">
            <LimitChip color="#FF3B30" :label="`USL · ${config.maxV} V`" />
            <LimitChip color="#FF9F0A" :label="`LSL · ${config.minV} V`" />
          </div>
          <div class="toolbar-zoom">
            <span class="zoom-hint">Scroll to zoom · Drag to pan</span>
            <button class="zoom-btn" title="Zoom in" @click="zoomIn">
              <ZoomInIcon />
            </button>
            <button class="zoom-btn" title="Zoom out" @click="zoomOut">
              <ZoomOutIcon />
            </button>
            <button class="zoom-btn" title="Reset zoom" @click="resetZoom">
              <ResetIcon />
            </button>
          </div>
        </div>

        <!-- Chart area -->
        <div class="chart-area">
          <div v-if="config.data.length === 0" class="chart-empty">
            <div class="chart-empty-icon">
              <BarChartIcon size="20" color="#AEAEB2" />
            </div>
            <p class="chart-empty-title">No data recorded</p>
            <p class="chart-empty-sub">Activate this configuration to begin recording.</p>
          </div>
          <canvas v-else ref="canvasRef" />
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <p class="graph-footer-info">
            {{ config.equipmentType }} · {{ config.machine }} · {{ config.ipAddress }} · {{ config.data.length }} samples
          </p>
          <button class="btn btn--cancel" @click="$emit('close')">Close</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import {
  Chart,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'

// 1. DAFTARKAN SEMUA KOMPONEN (Hanya satu kali pendaftaran)
Chart.register(
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

// 2. CONSTANTS (Warna & Icons)
const CH_COLORS = [
  '#007AFF', '#30D158', '#FF9F0A', '#BF5AF2',
  '#FF2D55', '#32ADE6', '#A2845E', '#FF6B6B',
  '#5856D6', '#34C759',
]

const BarChartIcon = {
  props: { size: { default: 14 }, color: { default: '#32ADE6' } },
  template: `<svg :width="size" :height="size" fill="none" :stroke="color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>`
}
const CloseIcon = {
  template: `<svg width="14" height="14" fill="none" stroke="#3A3A3C" stroke-width="2" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>`
}
const ZoomInIcon = {
  template: `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
  </svg>`
}
const ZoomOutIcon = {
  template: `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    <line x1="8" y1="11" x2="14" y2="11"/>
  </svg>`
}
const ResetIcon = {
  template: `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
  </svg>`
}

const LimitChip = {
  props: { color: String, label: String },
  template: `
    <span class="limit-chip" :style="{ borderColor: color + '44', color, background: color + '0D' }">
      <span class="limit-dash" :style="{ borderColor: color }" />
      {{ label }}
    </span>
  `
}

// 3. EXPORT DEFAULT
export default {
  name: 'GraphModal',
  components: { BarChartIcon, CloseIcon, ZoomInIcon, ZoomOutIcon, ResetIcon, LimitChip },
  props: {
    config: { type: Object, required: true }
  },
  emits: ['close'],

  setup(props, { emit }) {
    const selectedCh = ref('all')
    const canvasRef = ref(null)
    let chartInstance = null

    function buildDatasets() {
      const sets = []
      const ch = selectedCh.value

      if (ch === 'all') {
        for (let i = 0; i < 10; i++) {
          if (!props.config.channels[i]) continue
          sets.push({
            label: `CH${i + 1}`,
            data: props.config.data.map(d => d.values[i]),
            borderColor: CH_COLORS[i],
            backgroundColor: CH_COLORS[i] + '18',
            borderWidth: 1.5,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.2,
          })
        }
      } else {
        const i = ch - 1
        sets.push({
          label: `CH${ch}`,
          data: props.config.data.map(d => d.values[i]),
          borderColor: CH_COLORS[i],
          backgroundColor: CH_COLORS[i] + '18',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          tension: 0.2,
          fill: true,
        })
      }

      sets.push({
        label: `USL  ${props.config.maxV} V`,
        data: Array(props.config.data.length).fill(props.config.maxV),
        borderColor: '#FF3B30',
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderDash: [7, 4],
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0,
      })
      sets.push({
        label: `LSL  ${props.config.minV} V`,
        data: Array(props.config.data.length).fill(props.config.minV),
        borderColor: '#FF9F0A',
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderDash: [7, 4],
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0,
      })
      return sets
    }

    function getLabels() {
      const labels = props.config.data.map(d => d.timestamp)
      const step = Math.max(1, Math.floor(labels.length / 10))
      return labels.map((l, i) => (i % step === 0 ? l : ''))
    }

    function buildChart() {
      if (!canvasRef.value || props.config.data.length === 0) return
      if (chartInstance) { chartInstance.destroy(); chartInstance = null }

      chartInstance = new Chart(canvasRef.value, {
        type: 'line',
        data: { labels: getLabels(), datasets: buildDatasets() },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 250 },
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: {
              position: 'top',
              align: 'start',
              labels: {
                font: { size: 11, family: "'IBM Plex Sans', -apple-system, sans-serif" },
                boxWidth: 16, boxHeight: 2, padding: 12,
                color: '#3A3A3C', usePointStyle: false,
              },
            },
            tooltip: {
              backgroundColor: 'rgba(29,29,31,0.92)',
              titleColor: '#FFFFFF', bodyColor: '#AEAEB2',
              borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1,
              padding: 10, cornerRadius: 8,
              callbacks: {
                label: ctx =>
                  `  ${ctx.dataset.label}: ${typeof ctx.raw === 'number' ? ctx.raw.toFixed(4) : ctx.raw} V`,
              },
            },
            zoom: {
              pan: { enabled: true, mode: 'xy', threshold: 5 },
              zoom: {
                wheel: { enabled: true, speed: 0.08 },
                pinch: { enabled: true },
                mode: 'xy',
              },
              limits: { y: { min: 'original', max: 'original' } },
            },
          },
          scales: {
            x: {
              ticks: {
                font: { size: 10, family: "'IBM Plex Sans', -apple-system, sans-serif" },
                color: '#8E8E93', maxRotation: 30, autoSkip: true, maxTicksLimit: 10,
              },
              grid: { color: 'rgba(0,0,0,0.05)' },
              border: { display: false },
            },
            y: {
              title: {
                display: true, text: 'Voltage  [V]',
                font: { size: 11, family: "'IBM Plex Sans', -apple-system, sans-serif" },
                color: '#8E8E93',
              },
              ticks: {
                font: { size: 10, family: "'IBM Plex Sans', -apple-system, sans-serif" },
                color: '#8E8E93',
              },
              grid: { color: 'rgba(0,0,0,0.05)' },
              border: { display: false },
            },
          },
        },
      })
    }

    watch(selectedCh, async () => {
      await nextTick()
      if (chartInstance) {
        chartInstance.data.datasets = buildDatasets()
        chartInstance.update()
      }
    })

    onMounted(async () => {
      window.addEventListener('keydown', handleKey)
      await nextTick()
      buildChart()
    })

    onUnmounted(() => {
      window.removeEventListener('keydown', handleKey)
      if (chartInstance) chartInstance.destroy()
    })

    function handleKey(e) { if (e.key === 'Escape') emit('close') }
    function zoomIn() { chartInstance?.zoom(1.3) }
    function zoomOut() { chartInstance?.zoom(0.7) }
    function resetZoom() { chartInstance?.resetZoom() }

    return { selectedCh, canvasRef, zoomIn, zoomOut, resetZoom }
  }
}
</script>

<style>
.graph-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 20px;
  border-bottom: 1px solid #F2F2F7;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-quaternary);
  white-space: nowrap;
}

.toolbar-select {
  width: auto;
  min-width: 140px;
  padding: 6px 28px 6px 10px;
}

.ml-8 { margin-left: 8px; }

.toolbar-zoom {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

.zoom-hint {
  font-size: 10px;
  color: #AEAEB2;
  margin-right: 4px;
  white-space: nowrap;
}

.zoom-btn {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  background: #F2F2F7;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition-fast);
}
.zoom-btn:hover { background: var(--color-border); }

/* Chart */
.chart-area {
  flex: 1;
  padding: 20px;
  overflow: hidden;
  min-height: 340px;
  position: relative;
}

.chart-area canvas {
  width: 100% !important;
  height: 100% !important;
}

.chart-empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.chart-empty-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #F2F2F7;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.chart-empty-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-quaternary);
}
.chart-empty-sub {
  font-size: 11px;
  color: var(--color-text-muted);
}

/* Limit chip */
.limit-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  border: 1px solid;
  font-size: 10px;
  font-weight: 500;
}

.limit-dash {
  display: inline-block;
  width: 16px;
  border-top: 1px dashed;
}

/* Graph footer */
.graph-footer-info {
  font-size: 11px;
  color: var(--color-text-muted);
}
</style>
