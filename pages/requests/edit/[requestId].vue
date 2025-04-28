<template>
  <div>
    <Container>
      <div v-if="request">
        <!-- заголовок -->
        <SectionWrapper>
          <div class="head">
            <h1>Редактирование заявки</h1>
            <div class="head__controls">
              <AppButton @click="saveChanges" :disabled="isSaving">
                {{ isSaving ? "Сохранение..." : "Сохранить изменения" }}
              </AppButton>
              <AppButton class="delete" @click="request && deleteRequest(request.requestId)"> Удалить </AppButton>
            </div>
          </div>
        </SectionWrapper>
        <!-- основная информация -->
        <SectionWrapper>
          <div>
            <h4>
              Номер заявки Workle:
              <span class="copy" @click="copyText(request.requestId)">{{ request.requestId }}</span>
            </h4>
            <h4>
              Номер заявки ТО:
              <span class="copy" @click="copyText(request.tourOperatorRequestId)">{{
                request.tourOperatorRequestId
              }}</span>
            </h4>
            <h4>Дата вылета: {{ request.departureDate ? toLocaleDate(request.departureDate) : "" }}</h4>
            <AppSelect
              v-model="request.requestStatus"
              :options="options.statusOptions"
              label="Статус заявки"
              placeholder="Выбрать"
            />
            <AppSelect
              v-model="request.payments.paymentFromClientStatus"
              :options="options.paymentOptions"
              label="Статус заявки"
              placeholder="Выбрать"
            />
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
        <!-- остальные поля -->
        <SectionWrapper>
          <h3>Редактирование параметров:</h3>
          <div
            v-for="item in parametric"
            style="display: flex; align-items: center; gap: 20px; width: 400px; height: 32px"
          >
            <label :for="item.id">{{ item.label }}: </label>
            <span v-if="item.showSpan">{{ request[item.id] }}</span>
            <input v-else v-model="request[item.id]" :id="item.id" type="text" />
            <button @click="toggleShow(item)" style="margin-left: auto">
              <Icon style="color: #db7625" v-if="item.showSpan" name="i-material-symbols-edit" size="20px" />
              <Icon style="color: #1dca21" v-else name="i-material-symbols-download-done-outline" size="20px" />
            </button>
          </div>
          <div></div>
        </SectionWrapper>
        <!-- платежи от клиента -->
        <SectionWrapper>
          <div class="form-section">
            <div style="display: flex; justify-content: space-between">
              <h3 style="margin: 0">Платежи от клиента</h3>
              <NuxtLink class="link" @click="elementToggle('clientPayments')">{{
                showElement.clientPayments ? "Скрыть" : "Показать"
              }}</NuxtLink>
            </div>
            <transition name="slide">
              <div v-show="showElement.clientPayments" style="margin: 20px 0">
                <div v-for="(payment, index) in request.payments.paymentsFromClient" :key="index" class="payment-item">
                  <label>Дата платежа</label>
                  <input v-model="payment.paymentDate" type="date" />
                  <label>Сумма платежа</label>
                  <input v-model="payment.paymentAmount" type="number" step="0.01" />
                  <button type="button" @click="removeClientPayment(index)">Удалить</button>
                </div>
                <button type="button" @click="addClientPayment" class="add-button">Добавить платеж</button>
              </div>
            </transition>
          </div>
        </SectionWrapper>
        <!-- Платежи туроператору -->
        <SectionWrapper>
          <div class="form-section">
            <div style="display: flex; justify-content: space-between">
              <h3>Платежи туроператору</h3>
              <NuxtLink class="link" @click="elementToggle('operatorPayments')">{{
                showElement.operatorPayments ? "Скрыть" : "Показать"
              }}</NuxtLink>
            </div>
            <transition name="slide">
              <div v-show="showElement.operatorPayments" style="margin: 20px 0">
                <div
                  v-for="(payment, index) in request.payments.paymentsToOperator.payments"
                  :key="index"
                  class="payment-item"
                >
                  <label>Дата платежа</label>
                  <input v-model="payment.paymentDate" type="date" />
                  <label>Сумма платежа</label>
                  <input v-model="payment.paymentAmount" type="number" step="0.01" />
                  <button type="button" @click="removeOperatorPayment(index)">Удалить</button>
                </div>
                <button type="button" @click="addOperatorPayment" class="add-button">Добавить платеж</button>
                <div>
                  <label>Частичная оплата</label>
                  <input v-model="request.payments.paymentsToOperator.partPay" type="date" />
                  <label>Полная оплата</label>
                  <input v-model="request.payments.paymentsToOperator.fullPay" type="date" />
                </div>
              </div>
            </transition>
          </div>
        </SectionWrapper>
      </div>

      <div v-else>
        <p>Заявка не найдена или данные загружаются...</p>
      </div>
    </Container>
    <div>
      {{ request }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDateConvert } from "#imports";
import { useRequestsStore } from "#imports";
import type { Request, PaymentsData } from "~/types/request"; // Путь к вашему интерфейсу
import { useCopyText } from "#imports";

const { copyText } = useCopyText();
const { toLocaleDate, useDateInput, toInputDate, fromInputDate } = useDateConvert();
const { user } = useUserSession();

definePageMeta({
  middleware: "auth",
});

interface Parametric {
  label: string;
  id: string;
  showSpan: boolean;
}

const parametric = ref<Parametric[]>([
  { label: "Номер заявки ТО", id: "tourOperatorRequestId", showSpan: true },
  { label: "Страна назначения", id: "destinationCountry", showSpan: true },
  { label: "Название тура", id: "tourName", showSpan: true },
  { label: "Продолжительность", id: "duration", showSpan: true },
  { label: "Отель", id: "hotelName", showSpan: true },
  { label: "Название тура", id: "tourName", showSpan: true },
]);

const toggleShow = (item: Parametric) => {
  item.showSpan = !item.showSpan;
};

const options = {
  statusOptions: [
    { value: "Поступила", label: "Поступила" },
    { value: "Подтверждена", label: "Подтверждена" },
    { value: "Бронирование", label: "Бронирование" },
    { value: "Отменена", label: "Отменена" },
  ],
  paymentOptions: [
    { value: "Не оплачена", label: "Не оплачена" },
    { value: "Предоплата", label: "Предоплата" },
    { value: "Оплачена", label: "Оплачена" },
    { value: "Отменена", label: "Отменена" },
  ],
};
const route = useRoute();
const param = route.params.requestId;

const requestsStore = useRequestsStore();

const showElement = ref<Record<string, boolean>>({
  table: false,
  clientPayments: false,
  operatorPayments: false,
});

const elementToggle = (elementName: string) => {
  showElement.value[elementName] = !showElement.value[elementName];
};

// Загружаем данные заявки с указанием типа
const { data: request, refresh } = await useFetch<Request>(`/api/requests/${param}`);

// Состояние для отслеживания процесса сохранения
const isSaving = ref<boolean>(false);

// Локальная копия tableCalc для обновлений
const updatedTableCalc = ref(request.value?.tableCalc || {});

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

    $fetch(`/api/requests/${requestId}`, {
      method: "DELETE",
    })
      .then(() => {
        navigateTo("/requests");
      })
      .catch((error) => {
        console.error("Error deleting request:", error);
      });
  }
};

// Функция для сохранения изменений
const saveChanges = async () => {
  if (!request.value) return;

  requestsStore.updatedRequest(request.value.requestId, request.value);

  isSaving.value = true;
  try {
    const response = await $fetch(`/api/requests/${param}`, {
      method: "PATCH",
      body: {
        ...request.value,
        tableCalc: updatedTableCalc.value,
        modifiedBy: user.value.username,
      },
    });

    await refresh();
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

.copy {
  cursor: pointer;
  &:hover {
    background-color: #ccc;
  }
}

.link {
  cursor: pointer;
  color: #0077cc;
  text-decoration: underline;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
  transform-origin: top;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
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

.add-button {
  display: inline-block;
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #218838;
  }
}
</style>
