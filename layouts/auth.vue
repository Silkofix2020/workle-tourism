<template>
  <div class="page">
    <h1>Workle Tourism Team</h1>
    <div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
