<template>
  <Container>
    <div v-if="request">
      <!-- заголовок -->
      <SectionWrapper>
        <div class="head">
          <h1>Редактирование заявки</h1>
          <div class="head__controls">
            <AppButton @click="saveChanges(request.requestId)" :disabled="!isSaveRequest">
              {{ isSaving ? "Сохранение..." : "Сохранить изменения" }}
            </AppButton>
            <AppButton class="delete" @click="request && deleteRequest(request.requestId)"> Удалить </AppButton>
          </div>
        </div>
      </SectionWrapper>
      <!-- основная информация -->
      <SectionWrapper>
        <div class="request-header__info">
          <div>
            <h4 style="display: flex; align-items: center">
              Номер заявки Workle:
              <TooltipAppTooltip :text="request.requestId" :label="'Скопировать'" />
              <NuxtLink
                style="display: flex; align-items: center; margin-left: 20px"
                :to="`https://admin.ng.workle.ru/offers/${request.requestId}`"
                target="_blank"
              >
                <Icon style="color: #333" name="i-line-md-external-link" size="20px" />
              </NuxtLink>
            </h4>
            <h4>Туроператор: {{ request.touroperator }}</h4>
            <h4>
              Номер заявки ТО:
              <TooltipAppTooltip :text="request.tourOperatorRequestId" :label="'Скопировать'" />
            </h4>
            <h4>Дата вылета: {{ request.departureDate ? toLocaleDate(request.departureDate) : "" }}</h4>
          </div>

          <div style="display: flex; gap: 20px">
            <AppSelect
              class="request-header__select"
              v-model="request.requestStatus"
              :options="options.statusOptions"
              label="Статус заявки"
              placeholder="Выбрать"
            />
            <AppSelect
              class="request-header__select"
              v-model="request.payments.paymentFromClientStatus"
              :options="options.paymentOptions"
              label="Статус оплаты"
              placeholder="Выбрать"
            />
            <AppSelect
              class="request-header__select"
              v-model="request.documentsStatus"
              :options="options.documentsStatus"
              label="Статус документов"
              placeholder="Выбрать"
            />
          </div>
        </div>
      </SectionWrapper>
      <!-- финансы -->
      <SectionWrapper>
        <div>
          <div style="display: flex; justify-content: space-between">
            <h3 style="margin: 0">Финансы</h3>
            <NuxtLink class="link" @click="elementToggle('table')">{{
              showElement.table ? "Скрыть" : "Показать"
            }}</NuxtLink>
          </div>
          <transition name="slide">
            <ProfitTable
              class="profit-table"
              v-show="showElement.table"
              :initial-table-calc="request.tableCalc"
              @update:tableCalc="handleTableCalcUpdate"
            />
          </transition>
        </div>
      </SectionWrapper>
      <div class="grid-container">
        <!-- редактирование заявки -->
        <SectionWrapper class="request-edit">
          <h3>Параметры тура:</h3>
          <RequestParamTable :request="request" />
          <h3>Данные заказчика:</h3>
          <RequestCustomerTable :request="request.customer" />
        </SectionWrapper>
        <!-- платежи от клиента -->
        <SectionWrapper class="client-payments">
          <div class="form-section">
            <div style="display: flex; justify-content: space-between; align-items: center">
              <h3 style="margin: 0">Платежи от клиента</h3>
              <div>
                <p>
                  Оплачено клиентом: <span style="font-weight: 600">{{ totalClientPayments }} ₽</span>
                </p>
                <p>
                  Остаток к оплате:
                  <span style="font-weight: 600">{{ request.tableCalc.total?.fullPrice - totalClientPayments }} ₽</span>
                </p>
              </div>
            </div>
            <PaymentsTable
              v-model:payments="request.payments.paymentsFromClient"
              @remove="(payload) => removeClientPayment(payload.index)"
              @add="addClientPayment"
            />
          </div>
        </SectionWrapper>
        <!-- Платежи туроператору -->
        <SectionWrapper class="operator-payments">
          <div class="form-section">
            <div style="display: flex; justify-content: space-between; align-items: center">
              <h3 style="margin: 0">Платежи туроператору</h3>
              <p>
                Оплачено ТО: <span style="font-weight: 600">{{ totalOperatorPayments }} ₽</span>
              </p>
            </div>
            <PaymentsTable
              v-model:payments="request.payments.paymentsToOperator.payments"
              @remove="(payload) => removeOperatorPayment(payload.index)"
              @add="addOperatorPayment"
            />
            <p>Оплачено ТО: {{ totalOperatorPayments }}</p>
            <p>Оплачено клиентом: {{ totalClientPayments }}</p>
            <label>Оплачено</label>
            <input type="checkbox" v-model="request.payments.paymentsToOperator.paid" />

            <div class="operator-payments-wrapper">
              <h4>Сроки оплаты туроператору:</h4>
              <div class="operator-payments">
                <label>Частичная оплата:</label>
                <input v-model="request.payments.paymentsToOperator.partPay" type="date" />
              </div>
              <div class="operator-payments">
                <label>Полная оплата:</label>
                <input v-model="request.payments.paymentsToOperator.fullPay" type="date" />
              </div>
            </div>
          </div>
        </SectionWrapper>
      </div>
      <!-- История изменений заявки -->
      <SectionWrapper>
        <h3>История изменений заявки</h3>

        <HistoryChangeTable :data="request.historyOfChanges" />
      </SectionWrapper>
    </div>

    <div v-else>
      <p>Заявка не найдена или данные загружаются...</p>
    </div>
  </Container>
</template>

<script lang="ts" setup>
import { useDateConvert } from "#imports";
import { useRequestsStore } from "#imports";
import type { Request, PaymentsData, flightsData } from "~/types/request"; // Путь к вашему интерфейсу
import { useCopyText } from "#imports";
import { useFormatDate } from "#imports";
import { useToastStore } from "#imports";
import { useStringHelpers } from "#imports";
import HistoryChangeTable from "~/components/HistoryChangeTable.vue";

const { copyText } = useCopyText();
const { toLocaleDate, toLocaleDateLong, useDateInput, toInputDate, fromInputDate } = useDateConvert();
const { firstCharUpper } = useStringHelpers();
const { user } = useUserSession();
const toastStore = useToastStore();

definePageMeta({
  middleware: "auth",
});

const options = {
  statusOptions: [
    { value: "Поступила", label: "Поступила" },
    { value: "Подтверждена", label: "Подтверждена" },
    { value: "Бронирование", label: "Бронирование" },
    { value: "Отменена", label: "Отменена" },
    { value: "Исполнена", label: "Исполнена" },
    { value: "Отказ ТО", label: "Отказ ТО" },
  ],
  paymentOptions: [
    { value: "Не оплачена", label: "Не оплачена" },
    { value: "Предоплата", label: "Предоплата" },
    { value: "Оплачена", label: "Оплачена" },
    { value: "Отменена", label: "Отменена" },
  ],
  documentsStatus: [
    { value: "Не выданы", label: "Не выданы" },
    { value: "Выданы", label: "Выданы" },
  ],
};
const route = useRoute();
const param = route.params.requestId;

const requestsStore = useRequestsStore();
const isSaveRequest = ref(false);

const showElement = ref<Record<string, boolean>>({
  table: false,
  clientPayments: false,
  operatorPayments: true,
});

const elementToggle = (elementName: string) => {
  showElement.value[elementName] = !showElement.value[elementName];
};

let initialRequestSnapshot: Request | null = null;
const hasUnsavedChanges = ref(false);

// Загружаем данные заявки с указанием типа
const { data: request, refresh } = await useFetch<Request>(`/api/requests/${param}`);

watch(
  () => request.value,
  (newRequest) => {
    if (!newRequest) return;

    if (initialRequestSnapshot === null) {
      console.log("Initial snapshot set", newRequest);
      initialRequestSnapshot = JSON.parse(JSON.stringify(newRequest));
      hasUnsavedChanges.value = false;
      return;
    }

    // Сравниваем текущее состояние с исходным
    hasUnsavedChanges.value = JSON.stringify(newRequest) !== JSON.stringify(initialRequestSnapshot);
  },
  { deep: true, immediate: true }
);

// Теперь isSaveRequest будет зависеть только от hasUnsavedChanges
watch(hasUnsavedChanges, (newVal) => {
  isSaveRequest.value = newVal;
});

// Состояние для отслеживания процесса сохранения
const isSaving = ref<boolean>(false);

// Локальная копия tableCalc для обновлений
const updatedTableCalc = ref(request.value?.tableCalc || {});

// общая сумма платежей
const totalOperatorPayments = computed(() => {
  return request.value?.payments.paymentsToOperator.payments.reduce((sum, payment) => {
    return sum + (payment.paymentAmount || 0);
  }, 0);
});

const totalClientPayments = computed(() => {
  return (
    request.value?.payments.paymentsFromClient.reduce((sum, payment) => {
      return sum + (payment.paymentAmount || 0);
    }, 0) || 0
  ); // Исправлено: paymentFromClient -> paymentsFromClient
});

// Обработчик обновления tableCalc из ProfitTable
const handleTableCalcUpdate = (newTableCalc: any) => {
  updatedTableCalc.value = newTableCalc;
};

const addClientPayment = () => {
  request.value?.payments.paymentsFromClient.push({
    paymentDate: new Date(),
    paymentAmount: 0,
  });
};

const removeClientPayment = (index: number) => {
  request.value?.payments.paymentsFromClient.splice(index, 1);
};

const addOperatorPayment = () => {
  request.value?.payments.paymentsToOperator.payments.push({
    paymentDate: new Date(),
    paymentAmount: 0,
  });
};

const removeOperatorPayment = (index: number) => {
  request.value?.payments.paymentsToOperator.payments.splice(index, 1);
};

const deleteRequest = async (requestId: string) => {
  if (requestId) {
    requestsStore.removeRequest(requestId);

    confirm("Вы уверены, что хотите удалить заявку?");
    if (!confirm) return;

    await $fetch(`/api/requests/${requestId}`, {
      method: "DELETE" as any,
    })
      .then(() => {
        navigateTo("/requests");
      })
      .then(() => {
        toastStore.showToast("Заявка удалена", "success");
      })
      .catch((error) => {
        console.error("Error deleting request:", error);
      });
  }
};

// Функция для сохранения изменений
const saveChanges = async (requestId: string) => {
  if (!request.value) return;

  requestsStore.updatedRequest(request.value.requestId, request.value);

  isSaving.value = true;
  isSaveRequest.value = false;
  try {
    const response = await $fetch(`/api/requests/${requestId}`, {
      method: "PATCH" as any,
      body: {
        ...request.value,
        tableCalc: updatedTableCalc.value,
        historyOfChanges: {
          createdBy: request.value.historyOfChanges?.createdBy || "",
          modifiedBy: [
            ...(request.value.historyOfChanges?.modifiedBy || []), // существующие записи
            {
              username: user.value.username,
              modified_at: new Date(),
            },
          ],
        },
      },
    });

    await refresh();

    if (request.value) {
      initialRequestSnapshot = JSON.parse(JSON.stringify(request.value));
      hasUnsavedChanges.value = false;
    }

    toastStore.showToast("Изменения сохранены", "success");
  } catch (error) {
    console.error("Error saving changes:", error);
  } finally {
    isSaving.value = false;
  }
};
</script>

<style lang="scss" scoped>
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;

  & h1 {
    margin: 0;
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

.form-group {
  width: 280px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
  }

  input,
  select {
    width: 150px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
    }
  }
}

.link {
  cursor: pointer;
  color: #0077cc;
  text-decoration: underline;
}

.profit-table {
  /* Фиксируем реальную высоту */
  height: auto;
  /* Важные стили для корректной работы */
  will-change: transform;
  backface-visibility: hidden;
}

.payment-item {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #f5f5f5;

  label {
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
  }

  input {
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    margin-right: 10px;

    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
    }
  }

  button {
    padding: 6px 12px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background-color: #c82333;
    }
  }
}

.operator-payments {
  &-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;

    & h4 {
      margin: 10px 0;
    }
  }
}

.request-header {
  &__info {
    display: flex;
    align-items: center;
  }
  &__select {
    flex-direction: column;
    gap: 0;
  }
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: repeat(2, auto);
  gap: 16px;
}
.request-edit {
  grid-column: 2 / 3; /* Вторая колонка */
  grid-row: 1 / 3; /* Объединяет две строки */
  margin: 0;
}

.client-payments {
  grid-column: 1 / 2; /* Первая колонка */
  grid-row: 1 / 2; /* Первая строка */
  margin: 0;
}

.operator-payments {
  grid-column: 1 / 2; /* Первая колонка */
  grid-row: 2 / 3; /* Вторая строка */
  margin: 0;
}
</style>
