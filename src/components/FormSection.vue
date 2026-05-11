<template>
  <div class="form-section">
    <p class="section-title">{{ title }}</p>
    <div class="section-body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormSection',
  props: {
    title: { type: String, required: true }
  }
}
</script>

<style>
.form-section {}

.section-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-text-quaternary);
  margin-bottom: 10px;
}

.section-body {
  background: #F9F9FB;
  border-radius: 16px;
  padding: 14px;
  border: 1px solid var(--color-border);
}
</style>
