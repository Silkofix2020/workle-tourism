<template>
  <div class="request" @click="navigateTo(`/requests/edit/${request.requestId}`)">
    <div class="request__item">
      <h3>Номер заявки:</h3>
      <p>{{ request.requestId }}</p>
    </div>
    <div class="request__item request__item-status">
      <h3>Статус заявки:</h3>
      <p :class="statusClass">{{ request.requestStatus }}</p>
    </div>
    <div class="request__item">
      <h3>Дата вылета:</h3>
      <p>{{ toLocaleDate(request.departureDate) }}</p>
    </div>
    <div class="request__item">
      <h3>Статус оплаты:</h3>
      <p :class="paymentClass">{{ request.payments.paymentFromClientStatus }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDateConvert } from "#imports";
import type { Request } from "~/types/request";

const { toLocaleDate } = useDateConvert();

// Определяем пропс request
const props = defineProps<{
  request: Request;
}>();

// Извлекаем поля с помощью toRefs для реактивности
const { request } = toRefs(props);

const statusClass = computed(() => {
  switch (request.value.requestStatus) {
    case "Подтверждена":
      return "status-confirmed";
    case "Бронирование":
      return "status-booking";
    default:
      return "status-default";
  }
});

const paymentClass = computed(() => {
  switch (request.value.payments.paymentFromClientStatus) {
    case "Оплачена":
      return "payment payment-paid";
    case "Не оплачена":
      return "payment payment-not-paid";
    case "Предоплата":
      return "payment payment-prepayment";
    default:
      return "payment payment-default";
  }
});
</script>

<style lang="scss" scoped>
.request {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 0 10px 15px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;

  cursor: pointer;

  &:hover {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }

  &__item {
    width: 25%;

    &:nth-child(3) {
      text-align: center;
    }
    &:nth-child(4) {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
  }
}

.request__item-status {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.status-confirmed {
  color: #28a745; // Зелёный для "Подтвержден"
  font-weight: 500;
}

.status-booking {
  color: #ffc107; // Жёлтый для "Бронирование"
  font-weight: 500;
}

.status-default {
  color: #333; // Серый для остальных статусов
}

.payment {
  width: fit-content;
  padding: 5px 10px;
  border-radius: 5px;

  &-paid {
    background: #28a745; // Зелёный для "Оплачен"
    font-weight: 500;
    color: #fff;
  }
  &-not-paid {
    background: #dc3545; // Красный для "Не оплачен"
    font-weight: 500;
    color: #fff;
  }
  &-prepayment {
    background: #ffc107; // Жёлтый для "Предоплата"
    font-weight: 500;
  }
  &-default {
    color: #333; // Серый для остальных статусов
  }
}
</style>
