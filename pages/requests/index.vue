<template>
  <div>
    <Container>
      <div class="page-header">
        <h2>Заявки</h2>
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
        <AppButton @click="resetDate">reset date</AppButton>
        <div class="sort-order">
          <label>Порядок сортировки:</label>
          <select v-model="sortOrder">
            <option value="asc">По возрастанию</option>
            <option value="desc">По убыванию</option>
          </select>
        </div>
      </div>
      <ClientOnly>
        <RequestCard v-for="request in sortedRequests" :key="request.requestId" :request="request" />
      </ClientOnly>
    </Container>
  </div>
</template>

<script lang="ts" setup>
import { useRequestsStore } from "~/stores/requestsStore";
import type { Request } from "~/types/request";

const requestsStore = useRequestsStore();

definePageMeta({
  middleware: "auth",
});

// Фильтры по датам
const startDate = ref<string>(""); // Формат YYYY-MM-DD
const endDate = ref<string>("");

const resetDate = () => {
  startDate.value = "";
  endDate.value = "";
};

// Направление сортировки
const sortOrder = ref<"asc" | "desc">("asc");

// Вычисляемое свойство для фильтрации и сортировки
const sortedRequests = computed((): Request[] => {
  let filtered = requestsStore?.requests || [];

  // Фильтрация по диапазону дат
  if (startDate.value || endDate.value) {
    filtered = filtered.filter((request: Request): boolean => {
      const departure = new Date(request.departureDate);
      const start = startDate.value ? new Date(startDate.value) : new Date(-8640000000000000); // Мин. дата
      const end = endDate.value ? new Date(endDate.value) : new Date(8640000000000000); // Макс. дата
      return departure >= start && departure <= end;
    });
  }

  // Сортировка
  return filtered.toSorted((a, b) => {
    const dateA = new Date(a.departureDate);
    const dateB = new Date(b.departureDate);
    const diff = dateA.getTime() - dateB.getTime();
    return sortOrder.value === "asc" ? diff : -diff;
  });
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
</style>
