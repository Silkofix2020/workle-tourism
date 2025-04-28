import { defineStore } from "pinia";
import { ref } from "vue";
import type { Request } from "~/types/request";

export const useRequestsStore = defineStore("requests", () => {
  const requests = ref<Request[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Асинхронное действие для получения данных
  async function fetchRequests() {
    try {
      loading.value = true;
      const response = await useFetch("/api/requests", {
        method: "get",
      });

      // Проверяем, что данные существуют и имеют ожидаемый формат
      if (response.data.value && Array.isArray(response.data.value.requests)) {
        requests.value = response.data.value.requests;
      } else {
        throw new Error("Некорректный формат данных от API");
      }
    } catch (err: any) {
      error.value = err.message || "Ошибка при загрузке данных";
    } finally {
      loading.value = false;
    }
  }

  const removeRequest = (requestId: string) => {
    requests.value = requests.value.filter((request) => request.requestId !== requestId);
  };

  const updatedRequest = (requestId: string, updatedRequest: Request) => {
    const index = requests.value.findIndex((request) => request.requestId === requestId);
    if (index !== -1) {
      requests.value[index] = updatedRequest;
    }
  };

  // Автоматический вызов fetchRequests при инициализации стора
  fetchRequests();

  return { requests, loading, error, fetchRequests, removeRequest, updatedRequest };
});
