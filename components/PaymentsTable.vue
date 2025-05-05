<template>
  <div class="table-container" style="margin: 20px 0">
    <table>
      <thead>
        <tr>
          <th>Дата платежа</th>
          <th>Сумма платежа</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="payments.length === 0">
          <tr>
            <td colspan="3">Нет данных</td>
          </tr>
        </template>
        <template v-else>
          <tr v-for="(payment, index) in payments" :key="index">
            <!-- дата платежа -->
            <td>
              <template v-if="editingIndex === index">
                <input v-model="payment.paymentDate" type="date" />
              </template>
              <template v-else>
                {{ useFormatDate(payment.paymentDate) }}
              </template>
            </td>
            <!-- сумма платежа -->
            <td>
              <template v-if="editingIndex === index">
                <input v-model.number="payment.paymentAmount" type="number" step="0.01" />
              </template>
              <template v-else>
                {{ payment.paymentAmount }}
              </template>
            </td>
            <!-- управление -->
            <td>
              <Icon class="action-icon" @click="$emit('remove', { index })" name="i-material-symbols-delete-outline" />

              <template v-if="editingIndex === index">
                <!-- Сохранить -->
                <Icon class="action-icon" @click="saveEdit(index)" name="i-material-symbols-download-done-outline" />
              </template>
              <template v-else>
                <!-- Редактировать -->
                <Icon class="action-icon" @click="startEdit(index)" name="i-material-symbols-edit" />
              </template>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <button type="button" @click="$emit('add')" class="add-button">Добавить платеж</button>
  </div>
</template>

<script lang="ts" setup>
import { useFormatDate } from "#imports";

interface Payment {
  paymentDate: string | Date;
  paymentAmount: number | null;
}

const props = defineProps<{
  payments: Payment[];
}>();

const editingIndex = ref<number | null>(null);

const startEdit = (index: number) => {
  editingIndex.value = index;
};

const saveEdit = (index: number) => {
  editingIndex.value = null;
};

const emit = defineEmits<{
  (e: "update:payments", value: Payment[]): void;
  (e: "edit", payload: { index: number }): void;
  (e: "save", payload: { index: number }): void;
  (e: "remove", payload: { index: number }): void;
  (e: "add"): void;
}>();
</script>

<style lang="scss" scoped>
$primary-color: #007bff;
$border-color: #e0e0e0;
$text-color: #666;

.table-container {
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;

  margin-bottom: 20px;

  th,
  td {
    padding: 12px 16px;
    border-bottom: 1px solid $border-color;
    text-align: left;
  }

  td:nth-child(3) {
    text-align: center;

    & span:nth-child(2) {
      margin-left: 10px;
    }
  }

  th {
    background-color: #f5f5f5;
    font-weight: bold;
  }
}

.actions {
  display: flex;
  gap: 8px;
}

.action-icon {
  cursor: pointer;
  font-size: 20px;
  color: $text-color;
  transition: color 0.2s ease;

  &:hover {
    color: $primary-color;
  }
}

input[type="date"],
input[type="number"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  font-size: 14px;
  box-sizing: border-box;

  &:focus {
    border-color: $primary-color;
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
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
