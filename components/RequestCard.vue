<template>
  <div class="request" @click="navigateTo(`/requests/edit/${request.requestId}`)">
    <div class="request__item">
      <h4 style="margin: 0">Номер заявки:</h4>
      <p>{{ request.requestId }}</p>
      <h4 style="margin: 0">{{ request.touroperator }}</h4>
      <p>Номер заявки: {{ request.tourOperatorRequestId }}</p>
    </div>
    <div class="request__item request__item-status">
      <h4>Статус заявки:</h4>
      <p :class="statusClass">{{ request.requestStatus }}</p>
    </div>
    <div class="request__item">
      <h4>Дата вылета:</h4>
      <p>{{ toLocaleDate(request.departureDate) }}</p>
    </div>
    <div class="request__item">
      <h4>Статус оплаты ТО:</h4>
      <p :class="paymentOperatorClass">{{ request.payments.paymentsToOperator?.paid ? "Оплачено" : "Не оплачено" }}</p>
    </div>
    <div class="request__item">
      <h4>Статус оплаты клиента:</h4>
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
    case "Бронирование":
      return "status status-booking";
    case "Подтверждена":
      return "status status-confirmed";
    case "Исполнена":
      return "status status-executed";
    default:
      return "status status-default";
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

const paymentOperatorClass = computed(() => {
  switch (request.value.payments.paymentsToOperator?.paid) {
    case true:
      return "payment payment-paid";
    case false:
      return "payment payment-not-paid";
    default:
      return "payment payment-default";
  }
});
</script>

<style lang="scss" scoped>
.request {
  padding: 20px;
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
    width: 20%;

    &:nth-child(3) {
      text-align: center;
    }

    &:nth-child(4) {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    &:nth-child(5) {
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

.status-executed {
  background-color: $pastel-green;
}

.status {
  width: fit-content;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: 500;
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
    background: $pastel-green; // Зелёный для "Оплачен"
    font-weight: 500;
  }
  &-not-paid {
    background: $pastel-red; // Красный для "Не оплачен"
    font-weight: 500;
  }
  &-prepayment {
    background: $pastel-yellow; // Жёлтый для "Предоплата"
    color: #333;
    font-weight: 500;
  }
  &-default {
    color: #333; // Серый для остальных статусов
  }
}
</style>
