<template>
  <div :class="['form-field', className]">
    <label class="form-label">{{ label }}</label>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'FormField',
  props: {
    label: { type: String, required: true },
    className: { type: String, default: '' }
  }
}
</script>

<style>
.form-field {}

.form-label {
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-tertiary);
  margin-bottom: 6px;
}
</style>
