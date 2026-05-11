<template>
  <button
    class="toggle"
    :class="modelValue ? 'toggle--on' : 'toggle--off'"
    @click="$emit('update:modelValue', !modelValue)"
    role="switch"
    :aria-checked="modelValue"
  >
    <span class="toggle-thumb" :class="modelValue ? 'toggle-thumb--on' : 'toggle-thumb--off'" />
  </button>
</template>

<script>
export default {
  name: 'Toggle',
  props: {
    modelValue: { type: Boolean, required: true }
  },
  emits: ['update:modelValue']
}
</script>

<style>
.toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 48px;
  height: 28px;
  border-radius: var(--radius-full);
  transition: background var(--transition-base);
  flex-shrink: 0;
}

.toggle--on  { background: var(--color-green); }
.toggle--off { background: #D1D1D6; }

.toggle-thumb {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  transition: transform var(--transition-base);
  position: absolute;
}

.toggle-thumb--on  { transform: translateX(24px); }
.toggle-thumb--off { transform: translateX(4px); }
</style>
