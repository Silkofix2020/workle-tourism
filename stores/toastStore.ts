import { defineStore } from "pinia";
import type { Toast } from "~/types/toast";

export const useToastStore = defineStore("toast", () => {
  const toasts = ref<Toast[]>([]);

  const id = ref<Toast["id"]>(0);
  const text = ref<Toast["text"]>("");
  const isVisible = ref<Toast["isVisible"]>(false);
  const type = ref<Toast["type"]>("info");

  const showToast = (message: string, toastType?: Toast["type"]) => {
    id.value = Date.now();
    text.value = message;
    isVisible.value = true;
    type.value = toastType;

    toasts.value.push({
      id: Date.now(),
      text: message,
      isVisible: true,
      type: toastType,
    });
    setTimeout(() => {
      isVisible.value = false;
      removeToast(toasts.value[0].id);
    }, 3000);
  };

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  };
  return {
    text,
    isVisible,
    showToast,
    type,
    toasts,
    removeToast,
  };
});
