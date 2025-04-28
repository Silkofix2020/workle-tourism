<template>
  <div class="section-wrapper">
    <slot />
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.section-wrapper {
  padding: 10px;
  margin: 20px 0;
  border-radius: 5px;
  box-shadow: 0 0 5px 1px #ccc;
}
</style>
