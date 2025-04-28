<template>
  <div class="calculator">
    <h2>Калькулятор дохода юзера:</h2>
    <div class="form-group">
      <label>Базовая стоимость тура (руб.):</label>
      <input v-model.number="userRevenue.tourNetPrice" type="number" min="0" step="1000" />
    </div>
    <div class="form-group">
      <label>Комиссия туроператора (%):</label>
      <input v-model.number="userRevenue.tourComission" />
    </div>
    <div class="form-group">
      <label>Безусловный процент (%):</label>
      <input v-model.number="userRevenue.unconditionalFee" type="number" min="0" step="0.001" />
    </div>
    <div class="form-group">
      <label>Тип платежа:</label>
      <select v-model="userRevenue.selectedPaymentTypeId">
        <option :value="null" disabled>Выберите тип</option>
        <option v-for="type in userRevenue.typeOfPayment" :key="type.id" :value="type.id">
          {{ type.name }} ({{ type.value }}%)
        </option>
      </select>
    </div>
    <div class="form-group">
      <label>Уровень карьеры (0.4–0.8):</label>
      <input v-model.number="userRevenue.userCareer" type="number" min="0.4" max="0.8" step="0.01" />
    </div>
    <label for="">Самозанятый/юр.лицо?</label>
    <input v-model="legalStatus" type="checkbox" name="" id="" />
    <h3>Доход: {{ calculatedRevenue?.toFixed(2) }} руб.</h3>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";

// Интерфейс для типа платежа
interface PaymentType {
  id: number;
  name: string; // Например, "СБП" или "Карта"
  value: number; // Комиссия эквайринга, например, 0.007
}

// Интерфейс для структуры userRevenue
interface UserRevenue {
  tourNetPrice: number; // Базовая стоимость тура
  tourComission: number; // Комиссия туроператора (например, 0.07)
  unconditionalFee: number; // Безусловный процент (например, 0.01)
  typeOfPayment: PaymentType[]; // Список типов платежей
  selectedPaymentTypeId: number | null; // ID выбранного типа платежа
  userCareer: number; // Уровень карьеры (0.4–0.8)
}

// Инициализация структуры
const userRevenue = ref<UserRevenue>({
  tourNetPrice: 0,
  tourComission: 0,
  unconditionalFee: 0.01, // Фиксированный безусловный процент
  typeOfPayment: [
    { id: 1, name: "СБП", value: 0.007 },
    { id: 2, name: "Карта", value: 0.014 },
  ],
  selectedPaymentTypeId: null,
  userCareer: 0,
});

const legalStatus = ref(false);

// Computed для текущего типа платежа
const selectedPaymentType = computed(() => {
  return (
    userRevenue.value.typeOfPayment.find((type) => type.id === userRevenue.value.selectedPaymentTypeId) || { value: 0 }
  );
});

// Computed для расчёта дохода
const calculatedRevenue = computed(() => {
  const { tourNetPrice, tourComission, unconditionalFee, userCareer } = userRevenue.value;
  const acquiringFee = selectedPaymentType.value.value;

  // Валидация
  if (
    tourNetPrice <= 0 ||
    tourComission <= 0 ||
    unconditionalFee < 0 ||
    userCareer < 0.4 ||
    userCareer > 0.8 ||
    acquiringFee < 0
  ) {
    return 0;
  }

  // Формула: (tourNetPrice * (tourComission - (unconditionalFee + acquiringFee))) * userCareer
  if (legalStatus.value) {
    return tourNetPrice * (tourComission - (unconditionalFee + acquiringFee)) * userCareer;
  }

  if (!legalStatus.value) {
    return (tourNetPrice * (tourComission - (unconditionalFee + acquiringFee)) * userCareer) / 1.15;
  }
  // Формула: (tourNetPrice * (tourComission - (unconditionalFee + acquiringFee))) * userCareer / 1.15
});
</script>

<style lang="scss" scoped>
.calculator {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: #333;
  }

  input,
  select {
    width: 100%;
    padding: 10px;
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

h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

h3 {
  margin-top: 20px;
  color: #007bff;
  font-size: 18px;
}
</style>
