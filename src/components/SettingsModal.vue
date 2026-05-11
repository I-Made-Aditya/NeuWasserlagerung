<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-panel modal-panel--md">
        <!-- Header -->
        <div class="modal-header">
          <div class="modal-title-group">
            <div class="modal-icon-wrap modal-icon-wrap--gray">
              <GearIcon />
            </div>
            <div>
              <p class="modal-title">Configuration Settings</p>
              <p class="modal-subtitle">Slot #{{ config.id }}</p>
            </div>
          </div>
          <button class="close-btn" @click="$emit('close')">
            <CloseIcon />
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <!-- Status -->
          <Section title="Status">
            <div class="toggle-row">
              <div>
                <p class="toggle-label">Active</p>
                <p class="toggle-sub">Enable or disable this configuration slot</p>
              </div>
              <Toggle v-model="form.active" />
            </div>
          </Section>

          <!-- Channels -->
          <Section title="Channel Enable · Disable">
            <div class="channels-grid">
              <button
                v-for="(on, i) in form.channels"
                :key="i"
                class="ch-btn"
                :class="on ? 'ch-btn--on' : 'ch-btn--off'"
                @click="toggleChannel(i)"
              >
                <span class="ch-btn-label">CH{{ i + 1 }}</span>
                <span class="ch-btn-dot" :class="on ? 'ch-dot--on' : 'ch-dot--off'" />
              </button>
            </div>
          </Section>

          <!-- Project Info -->
          <Section title="Project Information">
            <div class="form-grid form-grid--2">
              <FormField label="Project Name">
                <input class="form-input" v-model="form.projectName" placeholder="e.g. QA" />
              </FormField>
              <FormField label="LOM Nr">
                <input class="form-input" v-model="form.lomNr" placeholder="e.g. Nr 1-10" />
              </FormField>
              <FormField label="Description" class="col-span-2">
                <input class="form-input" v-model="form.description" placeholder="Short description" />
              </FormField>
            </div>
          </Section>

          <!-- Measurement -->
          <Section title="Measurement Parameters">
            <div class="form-grid form-grid--4">
              <FormField label="Interval [s]">
                <input type="number" class="form-input" v-model.number="form.interval" />
              </FormField>
              <FormField label="Duration [h]">
                <input type="number" class="form-input" v-model.number="form.duration" />
              </FormField>
              <FormField label="Min [V]">
                <input type="number" step="0.1" class="form-input" v-model.number="form.minV" />
              </FormField>
              <FormField label="Max [V]">
                <input type="number" step="0.1" class="form-input" v-model.number="form.maxV" />
              </FormField>
            </div>
          </Section>

          <!-- Hardware -->
          <Section title="Hardware · Network">
            <div class="form-grid form-grid--2">
              <FormField label="Machine">
                <select class="form-input" v-model="form.machine">
                  <option>Machine-1</option>
                  <option>Machine-2</option>
                  <option>Machine-3</option>
                </select>
              </FormField>
              <FormField label="Equipment Type">
                <select class="form-input" v-model="form.equipmentType">
                  <option>DAQ9600</option>
                  <option>DAQ6510</option>
                </select>
              </FormField>
              <FormField label="IP Address">
                <input class="form-input" v-model="form.ipAddress" placeholder="192.168.1.100" />
              </FormField>
              <FormField label="Netmask">
                <input class="form-input" v-model="form.netmask" placeholder="255.255.255.0" />
              </FormField>
            </div>
          </Section>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button class="btn btn--cancel" @click="$emit('close')">Cancel</button>
          <button class="btn btn--save" @click="handleSave">
            <SaveIcon />
            Save
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { reactive, onMounted, onUnmounted } from 'vue'
import Section from './FormSection.vue'
import FormField from './FormField.vue'
import Toggle from './Toggle.vue'

const GearIcon = {
  template: `<svg width="16" height="16" fill="none" stroke="#3A3A3C" stroke-width="1.8" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
  </svg>`
}
const CloseIcon = {
  template: `<svg width="14" height="14" fill="none" stroke="#3A3A3C" stroke-width="2" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>`
}
const SaveIcon = {
  template: `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
    <polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/>
  </svg>`
}

export default {
  name: 'SettingsModal',
  components: { Section, FormField, Toggle, GearIcon, CloseIcon, SaveIcon },
  props: {
    config: { type: Object, required: true }
  },
  emits: ['close', 'save'],

  setup(props, { emit }) {
    const form = reactive({ ...props.config, channels: [...props.config.channels] })

    function toggleChannel(i) {
      form.channels[i] = !form.channels[i]
    }

    function handleSave() {
      emit('save', { ...form, channels: [...form.channels] })
    }

    function onKeydown(e) {
      if (e.key === 'Escape') emit('close')
    }

    onMounted(() => window.addEventListener('keydown', onKeydown))
    onUnmounted(() => window.removeEventListener('keydown', onKeydown))

    return { form, toggleChannel, handleSave }
  }
}
</script>

<style>
/* ── Modal overlay & panel ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.modal-panel {
  border-radius: 20px;
  box-shadow: var(--shadow-modal);
  width: 100%;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.modal-panel--md { max-width: 560px; }
.modal-panel--xl { max-width: 1000px; }

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.modal-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon-wrap--gray { background: rgba(29, 29, 31, 0.08); }
.modal-icon-wrap--blue { background: rgba(0, 122, 255, 0.1); }
.modal-icon-wrap--teal { background: rgba(50, 173, 230, 0.15); }

.modal-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1;
}

.modal-subtitle {
  font-size: 11px;
  color: var(--color-text-quaternary);
  margin-top: 2px;
  line-height: 1;
}

.close-btn {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: #F2F2F7;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition-fast);
}
.close-btn:hover { background: var(--color-border); }

.modal-body {
  overflow-y: auto;
  flex: 1;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 20px;
  border-top: 1px solid var(--color-border);
  flex-shrink: 0;
}

/* Buttons */
.btn {
  padding: 8px 16px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  transition: background var(--transition-fast);
  font-family: var(--font-sans);
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn--cancel {
  background: #F2F2F7;
  color: var(--color-text-secondary);
}
.btn--cancel:hover { background: var(--color-border); }

.btn--save {
  background: var(--color-blue);
  color: white;
}
.btn--save:hover { background: var(--color-blue-hover); }
.btn--save:active { background: var(--color-blue-active); }

/* Toggle row */
.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.toggle-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
}
.toggle-sub {
  font-size: 11px;
  color: var(--color-text-quaternary);
  margin-top: 2px;
}

/* Channels grid */
.channels-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.ch-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  border: 1px solid;
  transition: all var(--transition-fast);
  font-family: var(--font-sans);
}

.ch-btn--on {
  background: rgba(48, 209, 88, 0.08);
  border-color: rgba(48, 209, 88, 0.4);
  color: #1A7A34;
}
.ch-btn--off {
  background: rgba(255, 59, 48, 0.05);
  border-color: rgba(255, 59, 48, 0.25);
  color: #C0392B;
}

.ch-btn-label { font-size: 11px; font-weight: 600; }

.ch-btn-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.ch-dot--on { background: var(--color-green); }
.ch-dot--off { background: var(--color-red); }

/* Form grid */
.form-grid {
  display: grid;
  gap: 12px;
}
.form-grid--2 { grid-template-columns: 1fr 1fr; }
.form-grid--4 { grid-template-columns: 1fr 1fr 1fr 1fr; }
.col-span-2 { grid-column: span 2; }

/* Form inputs */
.form-input {
  width: 100%;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: 8px 12px;
  font-size: 12px;
  color: var(--color-text-primary);
  background: white;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  font-family: var(--font-sans);
  appearance: none;
  -webkit-appearance: none;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-blue);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.15);
}

.form-input::placeholder { color: #C7C7CC; }

select.form-input {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238E8E93' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 30px;
  cursor: pointer;
}
</style>
