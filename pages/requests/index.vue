<template>
  <div>
    <Container>
      <div
        v-if="infoStore.isLoadingFlights && infoStore.isLoadingPayments"
        style="display: flex; align-items: flex-start; gap: 20px"
      >
        <InfoPanelSkeleton :blockType="'flights'" />
        <InfoPanelSkeleton :blockType="'payments'" />
      </div>
      <div v-else style="display: flex; align-items: flex-start; gap: 20px">
        <InfoPanel v-if="infoStore.flightsInfo" :blockType="'flights'" :data="infoStore.flightsInfo" />

        <InfoPanel v-if="infoStore.paymentsInfo" :blockType="'payments'" :data="infoStore.paymentsInfo" />
      </div>
      <!-- фильтры и сортировка -->
      <SectionWrapper>
        <div class="page-header">
          <h2>Заявки ({{ requestsStore.total }})</h2>
          <AppButton @click="navigateTo('/requests/create')">Добавить заявку</AppButton>
        </div>
        <div class="controls">
          <div class="date-filter">
            <label>Дата вылета с:</label>
            <input type="date" v-model="startDate" />
          </div>
          <div class="date-filter">
            <label>Дата вылета до:</label>
            <input type="date" v-model="endDate" />
          </div>
          <AppButton @click="resetDate">Сбросить</AppButton>
          <div class="sort-order">
            <label>Порядок сортировки:</label>
            <select v-model="sortOrder">
              <option value="asc">По возрастанию</option>
              <option value="desc">По убыванию</option>
            </select>
          </div>
          <div class="sort-order">
            <label>Сортировка по статусу:</label>
            <select v-model="selectedStatus">
              <option value="">Все</option>

              <option v-for="status in statusOptions" :key="status.value" :value="status.value">
                {{ status.label }}
              </option>
            </select>
          </div>
          <div class="global__search">
            <RequestsSearch />
          </div>
        </div>
        <ClientOnly>
          <div v-if="requestsStore.loading">Загрузка...</div>
          <div>
            <LazyRequestCard v-for="request in sortedRequests" :key="request.requestId" :request="request" />
          </div>
          <div v-if="requestsStore.error">Ошибка загрузки заявок: {{ requestsStore.error }}</div>
        </ClientOnly>
        <ShowMoreButton />
      </SectionWrapper>
    </Container>
  </div>
</template>

<script lang="ts" setup>
import type { NearFlight, NearPayment } from "~/types/OtherData";
import { useRequestsStore } from "~/stores/requestsStore";
import { useInfoStore } from "#imports";
import type { Request } from "~/types/request";

import ShowMoreButton from "~/components/buttons/ShowMoreButton.vue";
import InfoPanelSkeleton from "~/components/skeleton/InfoPanelSkeleton.vue";

const requestsStore = useRequestsStore();
const infoStore = useInfoStore();

const loading = ref<boolean>(false);

definePageMeta({
  middleware: "auth",
});

// Фильтры по датам
const startDate = ref<string>(""); // Формат YYYY-MM-DD
const endDate = ref<string>("");
const selectedStatus = ref<string>("");
const searchQuery = ref<string>("");

const resetDate = () => {
  startDate.value = "";
  endDate.value = "";
};

// Направление сортировки
const sortOrder = ref<"asc" | "desc">("asc");
const statusOptions = [
  { value: "Поступила", label: "Поступила" },
  { value: "Подтверждена", label: "Подтверждена" },
  { value: "Бронирование", label: "Бронирование" },
  { value: "Исполнена", label: "Исполнена" },
  { value: "Отменена", label: "Отменена" },
  { value: "Отказ ТО", label: "Отказ ТО" },
];

// Вычисляемое свойство для фильтрации и сортировки
const sortedRequests = computed((): Request[] => {
  let filtered = [...requestsStore.requests];

  if (requestsStore.searchParam) {
    filtered = filtered.filter(
      (request) =>
        request.requestId === requestsStore.searchParam || request.tourOperatorRequestId === requestsStore.searchParam
    );
  } else if (searchQuery.value) {
    // 🔍 Обычный поиск по строке
    const query = searchQuery.value.trim().toLowerCase();
    filtered = filtered.filter(
      (request: Request) =>
        request.requestId?.toLowerCase() === query || request.tourOperatorRequestId?.toLowerCase() === query
    );
  }

  // Фильтрация по диапазону дат
  if (startDate.value || endDate.value) {
    filtered = filtered.filter((request: Request): boolean => {
      const departure = new Date(request.departureDate);
      const start = startDate.value ? new Date(startDate.value) : new Date(-8640000000000000); // Мин. дата
      const end = endDate.value ? new Date(endDate.value) : new Date(8640000000000000); // Макс. дата
      return departure >= start && departure <= end;
    });
  }

  if (selectedStatus.value) {
    filtered = filtered.filter((request: Request) => request.requestStatus === selectedStatus.value);
  }

  // Сортировка
  return filtered.toSorted((a, b) => {
    const dateA = new Date(a.departureDate);
    const dateB = new Date(b.departureDate);
    const diff = dateA.getTime() - dateB.getTime();
    return sortOrder.value === "asc" ? diff : -diff;
  });
});

onMounted(async () => {
  loading.value = true;

  if (requestsStore.requests.length === 0) {
    await requestsStore.fetchRequests();
  }
  await Promise.all([infoStore.getFlightsInfo(), infoStore.getPaymentsInfo(), (loading.value = false)]);
});
</script>

<style lang="scss" scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.controls {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-end;

  .date-filter {
    display: flex;
    flex-direction: column;
    gap: 5px;

    label {
      font-weight: 500;
      color: #333;
    }

    input[type="date"] {
      padding: 8px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      outline: none;
      transition: border-color 0.3s ease;

      &:focus {
        border-color: #007bff;
      }
    }
  }

  .sort-order {
    display: flex;
    flex-direction: column;
    gap: 5px;

    label {
      font-weight: 500;
      color: #333;
    }

    select {
      padding: 8px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      outline: none;
      transition: border-color 0.3s ease;

      &:focus {
        border-color: #007bff;
      }
    }
  }
}

.link {
  cursor: pointer;
  color: #0077cc;
  text-decoration: underline;
  user-select: none;
}

.document-issued {
  background-color: #d8ffdc;
}
.document-not-issued {
  background-color: #ffd8d8;
}

.myanimation-enter-active,
.myanimation-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.myanimation-enter-from,
.myanimation-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
