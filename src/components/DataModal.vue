<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-panel modal-panel--xl">
        <!-- Header -->
        <div class="modal-header">
          <div class="modal-title-group">
            <div class="modal-icon-wrap modal-icon-wrap--blue">
              <TableIcon />
            </div>
            <div>
              <p class="modal-title">Raw Data</p>
              <p class="modal-subtitle">
                #{{ config.id }} · {{ config.projectName }} / {{ config.lomNr }} · {{ config.description }}
              </p>
            </div>
          </div>
          <div class="modal-header-right">
            <span class="record-badge">{{ config.data.length }} records</span>
            <button class="close-btn" @click="$emit('close')">
              <CloseIcon />
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th class="th th--nr">Nr</th>
                <th class="th th--ts">Timestamp</th>
                <th v-for="ch in 10" :key="ch" class="th th--ch">CH{{ ch }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="config.data.length === 0">
                <td colspan="12" class="td-empty">No data recorded for this configuration.</td>
              </tr>
              <tr
                v-else
                v-for="(row, i) in config.data"
                :key="i"
                class="data-row"
                :class="i % 2 === 0 ? 'data-row--even' : 'data-row--odd'"
              >
                <td class="td td--nr">{{ i + 1 }}</td>
                <td class="td td--ts">{{ row.timestamp }}</td>
                <td
                  v-for="(v, vi) in row.values"
                  :key="vi"
                  class="td td--val"
                  :class="isOutOfRange(v) ? 'td--oor' : ''"
                >
                  {{ v.toFixed(4) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <p class="data-range-info">
            Range&nbsp;
            <span class="range-lsl">{{ config.minV }} V</span>
            &nbsp;—&nbsp;
            <span class="range-usl">{{ config.maxV }} V</span>
            &nbsp;· Values outside range highlighted
          </p>
          <button class="btn btn--cancel" @click="$emit('close')">Close</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { onMounted, onUnmounted } from 'vue'

const TableIcon = {
  template: `<svg width="16" height="16" fill="none" stroke="#007AFF" stroke-width="1.8" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="3" y1="15" x2="21" y2="15"/>
    <line x1="9" y1="9" x2="9" y2="21"/>
  </svg>`
}
const CloseIcon = {
  template: `<svg width="14" height="14" fill="none" stroke="#3A3A3C" stroke-width="2" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>`
}

export default {
  name: 'DataModal',
  components: { TableIcon, CloseIcon },
  props: {
    config: { type: Object, required: true }
  },
  emits: ['close'],

  setup(props, { emit }) {
    function isOutOfRange(v) {
      return v < props.config.minV || v > props.config.maxV
    }

    function onKeydown(e) {
      if (e.key === 'Escape') emit('close')
    }
    onMounted(() => window.addEventListener('keydown', onKeydown))
    onUnmounted(() => window.removeEventListener('keydown', onKeydown))

    return { isOutOfRange }
  }
}
</script>

<style>
.modal-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.record-badge {
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: #F2F2F7;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-tertiary);
}

/* Table */
.table-scroll {
  flex: 1;
  overflow: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
  font-size: 12px;
}

.th {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #F2F2F7;
  padding: 10px 12px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-quaternary);
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.th--nr  { text-align: left; width: 40px; }
.th--ts  { text-align: left; width: 160px; }
.th--ch  { text-align: right; }

.td {
  padding: 6px 12px;
  font-family: var(--font-mono);
  font-size: 11px;
}

.td--nr { color: var(--color-text-muted); }
.td--ts { color: var(--color-text-tertiary); }
.td--val { text-align: right; color: var(--color-text-primary); }
.td--oor { color: var(--color-red); background: rgba(255, 59, 48, 0.06); }

.data-row {
  border-bottom: 1px solid #F2F2F7;
  transition: background var(--transition-fast);
}
.data-row--even { background: #FFFFFF; }
.data-row--odd  { background: #FAFAFA; }
.data-row:hover { background: rgba(0, 122, 255, 0.04); }

.td-empty {
  padding: 40px;
  text-align: center;
  font-size: 13px;
  color: var(--color-text-quaternary);
  font-family: var(--font-sans);
}

/* Range info */
.data-range-info {
  font-size: 11px;
  color: var(--color-text-muted);
}
.range-lsl { color: var(--color-orange); font-weight: 600; }
.range-usl { color: var(--color-red); font-weight: 600; }
</style>
