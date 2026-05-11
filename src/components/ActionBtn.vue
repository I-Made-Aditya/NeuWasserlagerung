<template>
  <button class="action-btn" :class="`action-btn--${color}`" @click="$emit('click')">
    <slot />
    <span>{{ label }}</span>
  </button>
</template>

<script>
export default {
  name: 'ActionBtn',
  props: {
    label: { type: String, required: true },
    color: { type: String, default: 'blue' } // 'blue' | 'teal'
  },
  emits: ['click']
}
</script>

<style>
.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px;
  border-radius: var(--radius-md);
  color: white;
  transition: background var(--transition-fast), transform var(--transition-fast);
  font-family: var(--font-sans);
  min-width: 44px;
}

.action-btn:active {
  transform: scale(0.96);
}

.action-btn span:last-child {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.action-btn--blue {
  background: var(--color-blue);
}
.action-btn--blue:hover { background: var(--color-blue-hover); }
.action-btn--blue:active { background: var(--color-blue-active); }

.action-btn--teal {
  background: var(--color-teal);
}
.action-btn--teal:hover { background: #2A9DD4; }
.action-btn--teal:active { background: #2490C6; }
</style>
