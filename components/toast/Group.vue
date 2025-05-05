<template>
  <div class="toast-container">
    <TransitionGroup name="slide-up">
      <AppToast v-for="toast in toastStore.toasts" :key="toast.id" :toast="toast" :getToastClass="getToastClass" />
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
import type { Toast } from "~/types/toast";
import { useToastStore } from "~/stores/toastStore";
import AppToast from "./AppToast.vue";

const toastStore = useToastStore();

const getToastClass = (toast: Toast) => {
  switch (toast.type) {
    case "success":
      return "--success";
    case "error":
      return "--error";
    case "info":
      return "--info";
    case "warning":
      return "--warning";
    default:
      return "--default";
  }
};
</script>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  bottom: 10px;
  right: 10px;
  display: flex;
  flex-direction: column-reverse; // новые тосты будут сверху
  gap: 10px;
  z-index: 9999;
}
</style>
