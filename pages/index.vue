<template>
  <template>
    <form @submit.prevent="submitForm" class="form">
      <!-- Номер заявки -->
      <p>{{ requestId }}</p>
      <!-- заказчик -->
      <div class="form-section customer-section">
        <h2>Данные заказчика</h2>
        <div v-for="field in formFields" :key="`customer-${field.key}`" class="form-group">
          <label :for="`customer-${field.key}`">{{ field.label }}</label>
          <input
            :id="`customer-${field.key}`"
            v-model="customer[field.key]"
            :type="field.type"
            :placeholder="field.placeholder"
          />
        </div>
      </div>

      <!-- Турист -->
      <div class="form-section tourists-section">
        <h2>Данные туристов</h2>

        <div v-for="(tourist, index) in tourists" :key="index" class="tourist-card">
          <h3>Турист #{{ index + 1 }}</h3>
          <button v-if="index > 0" @click="removeTourist(index)" class="remove-button">Удалить</button>

          <div v-for="field in formFields" :key="`tourist-${index}-${field.key}`" class="form-group">
            <label :for="`tourist-${index}-${field.key}`">{{ field.label }}</label>
            <input
              :id="`tourist-${index}-${field.key}`"
              v-model="tourist[field.key]"
              :type="field.type"
              :placeholder="field.placeholder"
            />
          </div>
        </div>

        <button @click="addTourist" type="button" class="add-button">+ Добавить туриста</button>
      </div>

      <button type="submit" class="submit-button">Отправить заявку</button>
    </form>
  </template>
</template>

<script setup>
const createEmptyCustomer = () => ({
  name: "",
  surname: "",
  patronymic: "",
  birthDate: "",
  passportSeries: "",
  passportNumber: "",
  email: "",
  phone: "",
});

const createEmptyTourist = () => ({ ...createEmptyCustomer() });

const customer = ref(createEmptyCustomer());
const tourists = ref([createEmptyTourist()]);

const addTourist = () => tourists.value.push(createEmptyTourist());
const removeTourist = (index) => tourists.value.splice(index, 1);

const formFields = [
  { key: "name", label: "Имя", type: "text", placeholder: "Введите имя" },
  { key: "surname", label: "Фамилия", type: "text", placeholder: "Введите фамилию" },
  { key: "patronymic", label: "Отчество", type: "text", placeholder: "Введите отчество" },
  { key: "birthDate", label: "Дата рождения", type: "date" },
  { key: "passportSeries", label: "Серия паспорта", type: "text", placeholder: "XXXX" },
  { key: "passportNumber", label: "Номер паспорта", type: "text", placeholder: "XXXXXX" },
  { key: "email", label: "Email", type: "email", placeholder: "example@mail.com" },
  { key: "phone", label: "Телефон", type: "tel", placeholder: "+7 (XXX) XXX-XX-XX" },
];

const route = useRoute();
const requestId = route.query.requestId;

const submitForm = () => {
  const formData = {
    requestId,
    customer: customer.value,
    tourists: tourists.value,
  };
  console.log("Отправка данных:", formData);
};
</script>

<style scoped>
.form {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
}

.customer-section {
  background: #f0f7ff;
}

.tourist-card {
  position: relative;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
}

.remove-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.3rem 0.6rem;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-button {
  display: block;
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button {
  display: block;
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
