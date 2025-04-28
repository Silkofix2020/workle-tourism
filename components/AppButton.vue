<template>
  <button :class="['button', { delete__button: $attrs.class === 'delete' }]">
    <slot />
  </button>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
button {
  padding: 12px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
}

.delete__button {
  background-color: #d32f2f;
  color: white;

  &:hover {
    background-color: #b71c1c;
  }
}
</style>
