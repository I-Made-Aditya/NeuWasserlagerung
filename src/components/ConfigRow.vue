<template>
  <div class="config-row" :class="{ 'config-row--inactive': !config.active }">
    <div class="row-id">
      <span class="row-id-text">{{ config.id }}</span>
    </div>

    <div class="card card--settings">
      <div class="settings-group">
        <button class="delete-trigger-box" @click.stop="askDelete" title="Delete Row">
          <span class="delete-icon"></span>
        </button>

        <button class="settings-btn" @click="modal = 'settings'">
          <SettingsIcon />
          <span>Settings</span>
        </button>
      </div>
    </div>

    <div class="card card--info">
      <div class="main-content-row">
        <div class="fields-row">
          <div class="field-box">
            <span class="field-label">Status</span>
            <div class="led-wrap">
              <span class="led" :class="config.active ? 'led--green' : 'led--red'"
                :title="config.active ? 'Active' : 'Inactive'" />
            </div>
          </div>

          <FieldBox label="Project" :value="config.projectName" width="120px" />
          <FieldBox label="LOM-Nr" :value="config.lomNr" width="96px" />
          <FieldBox label="Description" :value="config.description" width="128px" />
          <FieldBox label="Interval [s]" :value="String(config.interval)" width="56px" :mono="true" />
          <FieldBox label="Duration [h]" :value="String(config.duration)" width="64px" :mono="true" />
          <FieldBox label="Min [V]" :value="String(config.minV)" width="48px" :mono="true" />
          <FieldBox label="Max [V]" :value="String(config.maxV)" width="48px" :mono="true" />
          <FieldBox label="Machine" :value="config.machine" width="80px" />
          <FieldBox label="Exp. Finish" :value="config.expectedFinish" width="80px" :mono="true" />
        </div>

        <div class="channels-row-inline">
          <span class="channels-label">Channels</span>
          <div class="channels-leds">
            <div v-for="(on, i) in config.channels" :key="i" class="channel-item">
              <span class="led led--sm" :class="on ? 'led--green' : 'led--red'" />
              <span class="channel-num">{{ i + 1 }}</span>
            </div>
          </div>
          <span class="channels-count">{{ activeChannels }}/10</span>
        </div>
      </div>
    </div>

    <div class="card card--actions">
      <ActionBtn label="Data" color="blue" @click="modal = 'data'">
        <DatabaseIcon />
      </ActionBtn>
      <ActionBtn label="Graph" color="teal" @click="modal = 'graph'">
        <BarChartIcon />
      </ActionBtn>
    </div>
  </div>

  <SettingsModal v-if="modal === 'settings'" :config="config" @close="modal = null" @save="handleSave" />
  <DataModal v-if="modal === 'data'" :config="config" @close="modal = null" />
  <GraphModal v-if="modal === 'graph'" :config="config" @close="modal = null" />
</template>

<script>
import { ref, computed } from 'vue'
import FieldBox from './FieldBox.vue'
import ActionBtn from './ActionBtn.vue'
import SettingsModal from './SettingsModal.vue'
import DataModal from './DataModal.vue'
import GraphModal from './GraphModal.vue'

// Icons
const SettingsIcon = {
  template: `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
  </svg>`
}
const DatabaseIcon = {
  template: `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
    <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </svg>`
}
const BarChartIcon = {
  template: `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>`
}
// const TrashIcon = {
//   template: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//     <polyline points="3 6 5 6 21 6"></polyline>
//     <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
//     <line x1="10" y1="11" x2="10" y2="17"></line>
//     <line x1="14" y1="11" x2="14" y2="17"></line>
//   </svg>`
// }

export default {
  name: 'ConfigRow',
  components: {
    FieldBox, ActionBtn, SettingsModal, DataModal, GraphModal,
    SettingsIcon, DatabaseIcon, BarChartIcon
  },
  props: {
    config: { type: Object, required: true }
  },
  emits: ['update', 'delete-request'],

  setup(props, { emit }) {
    const modal = ref(null)
    const activeChannels = computed(() => props.config.channels.filter(Boolean).length)

    function handleSave(updated) {
      emit('update', updated)
      modal.value = null
    }

    function askDelete() {
      emit('delete-request', props.config.id);
    }

    return { modal, activeChannels, handleSave, askDelete }
  }
}
</script>

<style>
.config-row {
  display: flex;
  width: 100%;
  gap: 0;
  /* Kita pakai border untuk pemisah */
  background: white;
  border: 4px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  /* Agar card di dalam tidak keluar dari border-radius */
  margin-bottom: 12px;
}

.config-row:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.config-row--inactive {
  background: var(--color-surface);
  opacity: 0.75;
}

/* Row ID */
.row-id {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  flex-shrink: 0;
  background: #F2F2F7;
  border-right: 2px solid var(--color-border);
}

.row-id-text {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-text-quaternary);
}

/* Cards */
.card {
  display: flex;
  align-items: center;
}

.card--settings {
  justify-content: center;
  padding: 16px;
  border-right: 2px solid var(--color-border);
  flex-shrink: 0;
  width: 130px;
}

.card--info {
  flex: 1;
  padding: 20px 24px;
  border-right: 2px solid var(--color-border);
  min-width: 0;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.card--actions {
  justify-content: center;
  gap: 8px;
  padding: 16px 20px;
  flex-shrink: 0;
  width: 110px;
}

.card--view {
  width: 124px;
  flex-shrink: 0;
  display: flex;
  gap: 6px;
  justify-content: center;
}

.main-content-row {
  display: flex;
  align-items: flex-end;
  gap: 24px;
  justify-content: flex-start;
  width: 100%;
}

/* Settings button */
.settings-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 10px 0;
  border-radius: var(--radius-sm);
  background: var(--color-dark);
  color: white;
  transition: background var(--transition-fast);
  font-family: var(--font-sans);
}

.settings-group {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.delete-trigger-box {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #FF3B30;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  box-shadow: 0 2px 4px rgba(255, 59, 48, 0.2);
  transition: box-shadow 0.2s ease, transform 0.1s ease;
}

.delete-icon {
  width: 10px;
  height: 4px;
  background: white;
  /* border-radius: 1px; */
}

.delete-trigger-box:hover {
  box-shadow: 0 0 12px rgba(255, 59, 48, 0.5), 0 4px 8px rgba(0, 0, 0, 0.1);
}

.delete-trigger-box:active {
  transform: translateY(1px);
  box-shadow: 0 1px 2px rgba(255, 59, 48, 0.3);
}

.delete-trigger-box:active {
  transform: scale(0.95);
}

.settings-btn:hover {
  background: #3A3A3C;
}

.settings-btn:active {
  background: #636366;
}

.settings-btn span {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.04em;
}

/* Fields row */
.fields-row {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 1;
  flex-wrap: nowrap;
}

.channels-row-inline {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding-bottom: 2px;
  flex-shrink: 0;
  margin-left: auto;
}

.led-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
}

.led {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.led--green {
  background: var(--color-green);
  box-shadow: 0 0 0 2px rgba(48, 209, 88, 0.15), 0 0 0 1px rgba(48, 209, 88, 0.3);
}

.led--red {
  background: var(--color-red);
  box-shadow: 0 0 0 2px rgba(255, 59, 48, 0.12), 0 0 0 1px rgba(255, 59, 48, 0.3);
}

.led--sm {
  width: 16px;
  height: 16px;
}

.channels-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  width: 100%;
}

.channels-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-text-quaternary);
  margin-bottom: 8px;
}

.channels-leds {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--color-surface);
  padding: 4px 12px;
  border: 1px solid var(--color-border-light);
  height: 32px;
}

.channel-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.channel-num {
  font-size: 8px;
  color: var(--color-text-muted);
  line-height: 1;
}

.channels-count {
  font-size: 10px;
  color: var(--color-text-muted);
  margin-left: 4px;
  flex-shrink: 0;
}
</style>
