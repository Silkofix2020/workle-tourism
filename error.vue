<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
  error: Object as () => NuxtError,
});
</script>

<template>
  <div class="error-page">
    <h1>Oops!</h1>
    <h2>Ошибка: {{ error?.statusCode }}</h2>
    <AppButton @click="navigateTo('/')">Вернуться на главную</AppButton>
  </div>
</template>

<style lang="scss" scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;

  & h2 {
    margin-bottom: 20px;
  }
}
</style>
