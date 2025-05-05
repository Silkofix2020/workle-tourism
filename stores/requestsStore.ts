import { defineStore } from "pinia";
import { ref } from "vue";
import type { Request } from "~/types/request";

export const useRequestsStore = defineStore("requests", () => {
  const requests = ref<Request[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const searchById = ref<string | null>(null);
  const skip = ref<number>(0);
  const limit = ref<number>(10);
  const hasMore = ref<boolean>(true);
  const total = ref<number>(0);

  // Асинхронное действие для получения данных
  async function fetchRequests() {
    try {
      loading.value = true;
      const response = await $fetch<{
        loaded: number;
        requests: Request[];
        total: number;
        hasMore: boolean;
      }>("/api/requests", {
        method: "GET",
        params: {
          skip: 0,
          limit: limit.value,
        },
      });

      requests.value = response.requests;
      skip.value = response.loaded;
      hasMore.value = response.hasMore;
      total.value = response.total;
    } catch (err: any) {
      error.value = err.message || "Ошибка при загрузке данных";
    } finally {
      loading.value = false;
    }
  }

  // Новый метод: подгружаем еще заявки
  async function loadMoreRequests() {
    if (!hasMore.value || loading.value) return;

    try {
      loading.value = true;
      const response = await $fetch<{ requests: Request[]; loaded: number; hasMore: boolean }>("/api/requests", {
        method: "GET",
        params: {
          skip: skip.value,
          limit: limit.value,
        },
      });

      // Добавляем новые заявки к уже существующим
      requests.value = [...requests.value, ...response.requests];
      skip.value += response.loaded;
      hasMore.value = response.hasMore;
    } catch (err) {
      console.error("Ошибка при подгрузке заявок:", err);
    } finally {
      loading.value = false;
    }
  }

  // Метод: поиск или добавление заявки по ID
  async function findAndAddRequestById(id: string): Promise<Request | null> {
    const existingRequest = requests.value.find((r) => r.requestId === id || r.tourOperatorRequestId === id);

    if (existingRequest) {
      searchById.value = id;
      return existingRequest;
    }

    try {
      const data = await $fetch<{ message: string; request: Request }>("/api/requests/search", {
        method: "GET",
        query: { searchValue: id },
      });

      if (data.message === "Заявка найдена") {
        requests.value.unshift(data.request);
        searchById.value = id;
        return data.request;
      }

      return null;
    } catch (err) {
      console.error("Ошибка поиска заявки:", err);
      return null;
    }
  }

  function setSearchById(id: string | null) {
    searchById.value = id;
  }

  function removeRequest(requestId: string) {
    requests.value = requests.value.filter((request) => request.requestId !== requestId);
  }

  function updatedRequest(requestId: string, updatedRequest: Request) {
    const index = requests.value.findIndex((request) => request.requestId === requestId);
    if (index !== -1) {
      requests.value[index] = updatedRequest;
    }
  }

  // Автоматический вызов fetchRequests при инициализации стора

  return {
    requests,
    loading,
    error,
    searchById,
    hasMore,
    skip,
    limit,
    total,

    fetchRequests,
    loadMoreRequests,
    findAndAddRequestById,
    setSearchById,
    removeRequest,
    updatedRequest,
  };
});
