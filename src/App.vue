<template>
  <div class="app-wrapper">
    <header class="app-header">
      <div class="header-inner">
        <div class="brand">
          <div class="brand-icon">
            <ZapIcon />
          </div>
          <div class="brand-text">
            <p class="brand-title">Voltage Monitoring System</p>
            <p class="brand-sub">Wasserlagerung · Industrial DAQ</p>
          </div>
        </div>
        <div class="header-stats">
          <span class="pill">
            <span class="pill-dot" :class="activeCount > 0 ? 'dot-active' : 'dot-inactive'" />
            {{ activeCount }} of {{ configs.length }} active
          </span>
        </div>
      </div>
    </header>

    <div class="col-headers">
      <span class="col-header col-id">#</span>
      <span class="col-header col-action">Action</span>
      <span class="col-header col-info">Configuration</span>
      <span class="col-header col-view">View</span>
    </div>

    <main class="config-list">
      <div class="list-inner">
        <ConfigRow 
          v-for="config in configs" 
          :key="config.id" 
          :config="config" 
          @update="handleUpdate"
          @delete-request="prepareDelete" 
        />
        
        <button class="add-btn" @click="handleAdd">
          <span class="add-icon-wrap">
            <PlusIcon />
          </span>
          <span class="add-label">Add New Configuration</span>
        </button>
      </div>
    </main>

    <DeleteModal 
      v-if="configToDelete" 
      @close="configToDelete = null" 
      @confirm="finalizeDelete" 
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { initialConfigs, createEmptyConfig } from './components/mockData'
import ConfigRow from './components/ConfigRow.vue'
import DeleteModal from './components/DeleteModal.vue'

const ZapIcon = {
  template: `<svg width="16" height="16" fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>`
}

const PlusIcon = {
  template: `<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>`
}

export default {
  name: 'App',
  components: { ConfigRow, ZapIcon, PlusIcon, DeleteModal },

  setup() {
    // Data Management
    const configs = ref(initialConfigs.map(c => ({ ...c, channels: [...c.channels], data: [...c.data] })))
    const configToDelete = ref(null);
    
    const activeCount = computed(() => configs.value.filter(c => c.active).length)

    function handleUpdate(updated) {
      const idx = configs.value.findIndex(c => c.id === updated.id)
      if (idx !== -1) configs.value[idx] = updated
    }

    function handleAdd() {
      const maxId = configs.value.length > 0 ? Math.max(...configs.value.map(c => c.id)) : 0
      configs.value.push(createEmptyConfig(maxId + 1))
    }

    // Modal & Delete Logic
    function prepareDelete(id) {
      configToDelete.value = id
    }

    function finalizeDelete() {
      if (configToDelete.value !== null) {
        configs.value = configs.value.filter(c => c.id !== configToDelete.value);
        configToDelete.value = null; 
      }
    }

    return { 
      configs, 
      activeCount, 
      configToDelete, // Pastikan ini di-return agar v-if terbaca
      handleUpdate, 
      handleAdd, 
      prepareDelete, 
      finalizeDelete 
    }
  }
}
</script>

<style>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
}

/* ── Header ── */
.app-header {
  position: sticky;
  top: 0;
  z-index: 30;
  flex-shrink: 0;
  background: var(--color-header-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--color-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.brand-title {
  font-size: 13px;
  font-weight: 600;
  color: #FFFFFF;
  letter-spacing: -0.02em;
  line-height: 1;
}

.brand-sub {
  font-size: 11px;
  color: #636366;
  margin-top: 2px;
  line-height: 1;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.1);
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.dot-active {
  background: var(--color-green);
}

.dot-inactive {
  background: #636366;
}

/* ── Column headers ── */
.col-headers {
  flex-shrink: 0;
  padding: 16px 20px 4px;
  display: flex;
  align-items: center;
}

.col-header {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-text-quaternary);
}

.col-id {
  width: 32px;
  text-align: center;
  flex-shrink: 0;
}

.col-action {
  width: 94px;
  text-align: center;
  flex-shrink: 0;
  margin-left: 4px;
}

.col-info {
  flex: 1;
  margin-left: 16px;
}

.col-view {
  width: 124px;
  text-align: center;
  flex-shrink: 0;
}

/* ── Main list ── */
.config-list {
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
  padding: 0 20px 24px;
}

.list-inner {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 1000px;
}

/* ── Add button ── */
.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-top: 4px;
  padding: 14px;
  border-radius: var(--radius-md) !important;
  border: 2px dashed var(--color-border-subtle) !important;
  color: var(--color-text-quaternary);
  background: transparent;
  transition: all var(--transition-base);
  font-family: var(--font-sans);
}

.add-btn:hover {
  border-color: var(--color-blue) !important;
  color: var(--color-blue);
  background: rgba(0, 122, 255, 0.05);
}

.add-icon-wrap {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-fast);
}

.add-btn:hover .add-icon-wrap {
  transform: scale(1.1);
}

.add-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
}
</style>
