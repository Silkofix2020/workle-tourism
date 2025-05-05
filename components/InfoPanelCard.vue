<template>
  <NuxtLink
    v-if="refinedData?.type === 'flight'"
    class="info-panel__link"
    :to="`/requests/edit/${props.data?.requestId}`"
  >
    <div class="info-panel__info">
      <h4 class="info-panel__label">Номер заявки:</h4>
      <div class="info-panel__value">{{ props.data?.requestId }}</div>
    </div>
    <div class="info-panel__info">
      <h4 class="info-panel__label">Дата вылета:</h4>
      <div class="info-panel__value">{{ useFormatDate(refinedData.departureDate) }}</div>
    </div>
    <div class="info-panel__info">
      <h4 class="info-panel__label">Документы:</h4>
      <div
        class="info-panel__value info-panel__documents"
        :class="refinedData.documentsStatus === 'Выданы' ? 'document-issued' : 'document-not-issued'"
      >
        {{ refinedData.documentsStatus }}
      </div>
    </div>
    <Icon style="color: #333" name="i-line-md-external-link" size="20px" />
  </NuxtLink>

  <NuxtLink
    v-else-if="refinedData?.type === 'payment'"
    class="info-panel__link"
    :to="`/requests/edit/${props.data.requestId}`"
  >
    <div class="info-panel__info">
      <h4 class="info-panel__label">Номер заявки:</h4>
      <div class="info-panel__value">{{ props.data.requestId }}</div>
    </div>
    <div class="info-panel__info">
      <h4 class="info-panel__label">Дата оплаты:</h4>
      <div class="info-panel__value" style="display: flex; align-items: center; gap: 5px">
        <Icon v-if="isTodayAction" name="i-material-symbols-notifications" style="color: #d32f2f" size="14" />
        {{ useFormatDate(refinedData.payment.date) }}
      </div>
    </div>
    <div class="info-panel__info">
      <h4 class="info-panel__label">Тип оплаты:</h4>
      <div
        class="info-panel__value info-panel__payment-type"
        :class="refinedData.payment.type === 'Предоплата' ? 'payment-partial' : 'payment-full'"
      >
        {{ refinedData.payment.type }}
      </div>
    </div>
    <Icon style="color: #333" name="i-line-md-external-link" size="20px" />
  </NuxtLink>
</template>

<script lang="ts" setup>
import type { CombineData, NearFlight, NearPayment } from "~/types/OtherData";

import { useFormatDate } from "#imports";

const props = defineProps<{
  data: CombineData;
  blockType?: "flights" | "payments";
}>();

const isTodayAction = computed(() => {
  if (props.data.type !== "payment") return false;
  const paymentDate = new Date(props.data.payment.date);
  const today = new Date();
  // Теперь TypeScript знает, что props.data - это NearPayment
  return paymentDate.toDateString() === today.toDateString();
});

const refinedData = computed(() => {
  if (props.data.type === "flight") {
    return props.data as NearFlight;
  } else if (props.data.type === "payment") {
    return props.data as NearPayment;
  }
  return null;
});
</script>

<style lang="scss" scoped>
.info-panel {
  &__link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    text-decoration: none;
    color: #333;
  }
  &__documents,
  &__payment-type {
    text-align: center;
    font-weight: 500;
    width: fit-content;
    padding: 5px 10px;
    border-radius: 5px;
  }
  &__info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;

    & h4 {
      margin: 0;
    }

    &:first-child {
      flex: 1;
      align-items: flex-start;
    }
    &:nth-child(2) {
      width: 90px;
      margin-right: 40px;
    }
    &:nth-child(3) {
      width: 96px;
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

.payment-full {
  background-color: $pastel-green;
}
.payment-partial {
  background-color: $pastel-yellow;
}
</style>
