<template>
  <form @submit.prevent="handleSubmit">
    <!-- Основные поля -->
    <div class="form-group">
      <label for="requestId">ID запроса</label>
      <input id="requestId" v-model="formData.requestId" type="text" required />
    </div>
    <div class="form-group">
      <label for="requestStatus">Статус запроса</label>
      <select id="requestStatus" v-model="formData.requestStatus">
        <option value="Поступила">Поступила</option>
        <option value="Подтверждена">Подтверждена</option>
        <option value="Бронирование">Бронирование</option>
        <option value="Отменена">Отменена</option>
      </select>
    </div>
    <div class="form-group">
      <label for="touroperator">Туроператор</label>
      <select id="touroperator" v-model="formData.touroperator">
        <option v-for="(operator, index) in operators" :value="operator.value" :key="index">{{ operator.name }}</option>
      </select>
    </div>
    <div class="form-group">
      <label for="tourName">Название тура</label>
      <input id="tourName" v-model="formData.tourName" type="text" required />
    </div>
    <div class="form-group">
      <label for="depatureCity">Город отправления</label>
      <input id="depatureCity" v-model="formData.depatureCity" type="text" />
    </div>
    <div class="form-group">
      <label for="destinationCountry">Страна назначения</label>
      <input id="destinationCountry" v-model="formData.destinationCountry" type="text" />
    </div>
    <div class="form-group">
      <label for="departureDate">Дата отправления</label>
      <input id="departureDate" v-model="formData.departureDate" type="date" />
    </div>
    <div class="form-group">
      <label for="price">Цена</label>
      <input id="price" v-model="formData.price" type="number" step="0.01" />
    </div>
    <div class="form-group">
      <label for="duration">Длительность (дни)</label>
      <input id="duration" v-model="formData.duration" type="number" />
    </div>
    <div class="form-group">
      <label for="createdBy">Создано пользователем</label>
      <input id="createdBy" v-model="formData.createdBy" type="text" required />
    </div>
    <div class="form-group">
      <label for="modifiedBy">Изменено пользователем</label>
      <input id="modifiedBy" v-model="formData.modifiedBy" type="text" />
    </div>

    <!-- Платежи от клиента -->
    <div class="form-group">
      <label>Статус оплаты от клиента</label>
      <select v-model="formData.payments.paymentFromClientStatus">
        <option value="Не оплачена">Не оплачена</option>
        <option value="Предоплата">Предоплата</option>
        <option value="Оплачена">Оплачена</option>
        <option value="Отменена">Отменена</option>
      </select>
    </div>
    <div class="form-section">
      <h3>Платежи от клиента</h3>
      <div v-for="(payment, index) in formData.payments.paymentsFromClient" :key="index" class="payment-item">
        <label>Дата платежа</label>
        <input v-model="payment.paymentDate" type="date" />
        <label>Сумма платежа</label>
        <input v-model="payment.paymentAmount" type="number" step="0.01" />
        <button type="button" @click="removeClientPayment(index)">Удалить</button>
      </div>
      <button type="button" @click="addClientPayment" class="add-button">Добавить платеж</button>
    </div>

    <!-- Платежи туроператору -->
    <div class="form-section">
      <h3>Платежи туроператору</h3>
      <div v-for="(payment, index) in formData.payments.paymentsToOperator.payments" :key="index" class="payment-item">
        <label>Дата платежа</label>
        <input v-model="payment.paymentDate" type="date" />
        <label>Сумма платежа</label>
        <input v-model="payment.paymentAmount" type="number" step="0.01" />
        <button type="button" @click="removeOperatorPayment(index)">Удалить</button>
      </div>
      <button type="button" @click="addOperatorPayment" class="add-button">Добавить платеж</button>
      <div>
        <label>Частичная оплата</label>
        <input v-model="formData.payments.paymentsToOperator.partPay" type="date" />
        <label>Полная оплата</label>
        <input v-model="formData.payments.paymentsToOperator.fullPay" type="date" />
      </div>
    </div>

    <button type="submit" class="submit-button">Создать заказ</button>
  </form>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});

const { user } = useUserSession();

const formData = ref({
  requestId: "",
  requestStatus: "Поступила",
  payments: {
    paymentFromClientStatus: "Не оплачена",
    paymentsFromClient: [],
    paymentsToOperator: {
      payments: [],
      partPay: "",
      fullPay: "",
    },
  },
  touroperator: "",
  tourName: "",
  depatureCity: "",
  destinationCountry: "",
  departureDate: "",
  price: "",
  duration: "",
  createdBy: user.value.username,
  modifiedBy: user.value.username,
});

const emit = defineEmits(["submit"]);

const addClientPayment = () => {
  formData.value.payments.paymentsFromClient.push({
    paymentDate: "",
    paymentAmount: "",
  });
};

const removeClientPayment = (index) => {
  formData.value.payments.paymentsFromClient.splice(index, 1);
};

const addOperatorPayment = () => {
  formData.value.payments.paymentsToOperator.payments.push({
    paymentDate: "",
    paymentAmount: "",
  });
};

const removeOperatorPayment = (index) => {
  formData.value.payments.paymentsToOperator.splice(index, 1);
};

const handleSubmit = async () => {
  try {
    const response = await $fetch("/api/requests", {
      method: "POST",
      body: formData.value,
    });
    emit("submit", response.request);
    // Сброс формы
    formData.value = {
      requestId: "",
      requestStatus: "Поступила",
      payments: {
        paymentFromClientStatus: "Не оплачена",
        paymentsFromClient: [],
        paymentsToOperator: [],
      },
      touroperator: "",
      tourName: "",
      depatureCity: "",
      destinationCountry: "",
      departureDate: "",
      price: "",
      duration: "",
      createdBy: user.value.username,
      modifiedBy: user.value.username,
    };
  } catch (error) {
    console.error("Ошибка при создании заказа:", error);
  }
};

const { data: operators } = await useFetch("/operators.json", {
  server: false,
});
</script>

<style lang="scss" scoped>
form {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
  }

  input,
  select {
    width: 100%;
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

.form-section {
  margin-top: 20px;
  padding: 15px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;

  h3 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 18px;
    color: #444;
  }
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

.submit-button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;

  &:hover {
    background-color: #0056b3;
  }
}
</style>
