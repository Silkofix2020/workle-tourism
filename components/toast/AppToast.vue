<template>
  <div
    @click="toastStore.removeToast(toast.id)"
    v-if="toast.isVisible"
    :class="['toast', `toast${getToastClass(toast)}`]"
  >
    <div>{{ toast.text }}</div>
    <div :class="['toast__progress', `toast__progress${getToastClass(toast)}`]"></div>
  </div>
</template>

<script lang="ts" setup>
import { useToastStore } from "~/stores/toastStore";
const toastStore = useToastStore();

const props = defineProps({
  toast: {
    type: Object,
    required: true,
  },
  getToastClass: {
    type: Function,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.toast {
  position: relative;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 9999;

  font-size: 16px;
  font-weight: 500;

  cursor: pointer;
  user-select: none;

  //&--success {
  //  background: $pastel-green;
  //}
  //&--error {
  //  background: $pastel-red;
  //}
  //&--info {
  //  background: $pastel-blue;
  //}
  //&--warning {
  //  background: $pastel-yellow;
  //}

  &__progress {
    &--success {
      background: $progress-green;
    }
    &--error {
      background: $progress-red;
    }
    &--info {
      background: $progress-blue;
    }
    &--warning {
      background: $progress-yellow;
    }
    &--default {
      background: #d4d4d4;
    }
  }
}

.toast__progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5px;
  border-radius: 5px;
  margin-top: 10px;
  animation: progress 3s linear forwards;
  @keyframes progress {
    0% {
      width: 100%;
    }
    100% {
      width: 0%;
    }
  }
}

/* Анимация через Transition */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-in-out;
}
.slide-up-enter-from {
  transform: translatex(20px);
  opacity: 0;
}
.slide-up-leave-to {
  transform: translatex(20px);
  opacity: 0;
}
</style>
