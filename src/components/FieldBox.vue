<template>
  <div class="field-box" :style="{ width: width }">
    <span class="field-label">{{ label }}</span>
    <div class="field-value-wrap" :title="value">
      <span class="field-value" :class="{ 'font-mono': mono }">
        {{ value }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FieldBox',
  props: {
    label: { type: String, required: true },
    value: { type: String, default: '' },
    width: { type: String, default: 'auto' },
    // height: { type: String, default: 'auto' },
    mono: { type: Boolean, default: false }
  }
}
</script>

<style>
.field-box {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-shrink: 0;
}

.field-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-text-quaternary);
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.field-value-wrap {
  border: 2px solid var(--color-border-light);
  border-radius: 6px;
  background: var(--color-surface);
  padding: 0 8px;
  height: 24px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.field-value {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1;
  display: block;
}

.field-value--mono {
  font-family: var(--font-mono);
  font-weight: 400;
}
</style>
