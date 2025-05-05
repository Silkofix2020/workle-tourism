<template>
  <div style="font-size: 12px; text-align: center; padding: 20px">
    <button
      @click="exportToExcel"
      style="
        margin-bottom: 10px;
        padding: 8px 16px;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-left: auto;
        display: block;
      "
    >
      Экспорт в Excel
    </button>
    <table style="width: 100%">
      <thead>
        <tr class="text-center">
          <th>п/п</th>
          <th>ФИО Клиента</th>
          <th>Номер заявки ВЦ</th>
          <th>Номер заявки ТО</th>
          <th>Дата начала тура</th>
          <th>Дата окончания тура</th>
          <th>Сумма тура</th>
          <th>Сумма счета</th>
          <th>Прибыль/убыток</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="report?.length === 0">
          <td colspan="9" style="text-align: center; font-weight: bold">Ничего нет</td>
        </tr>
        <tr v-else v-for="(item, index) in report" :key="item._id">
          <td>{{ index + 1 }}</td>
          <td>{{ item.customerFullName }}</td>
          <td>{{ item.requestId }}</td>
          <td>{{ item.tourOperatorRequestId }}</td>
          <td>{{ formatDate(item.departureDate) }}</td>
          <td>{{ formatDate(item.endDate) }}</td>
          <td>{{ item.fullPrice }}</td>
          <td>{{ item.paymentsTotal }}</td>
          <td>{{ getProfit(item) }}</td>
        </tr>
      </tbody>
    </table>
    <div style="display: flex; gap: 10px">
      <AppButton @click="toastStore.showToast('Это нотификашин', 'success')">success</AppButton>
      <AppButton @click="toastStore.showToast('Это нотификашин длиннее', 'error')">error</AppButton>
      <AppButton @click="toastStore.showToast('Это нотификашин длиннее длинного', 'info')">info</AppButton>
      <AppButton @click="toastStore.showToast('Это нотификашин длиннее длинного длинного', 'warning')"
        >warning</AppButton
      >
      <AppButton @click="toastStore.showToast('Это нотификашин')">без типа</AppButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useToastStore } from "~/stores/toastStore";
const toastStore = useToastStore();

import * as XLSX from "xlsx";

definePageMeta({
  middleware: ["auth"],
});

interface ReportItem {
  _id: string;
  customerFullName: string;
  tourOperatorRequestId: string;
  requestId: string;
  departureDate: Date;
  endDate: Date;
  fullPrice: number;
  paymentsTotal: number;
}

const { data: report } = await useFetch<ReportItem[]>("/api/requests/request-report");

const formatDate = (item: string | Date) => {
  const date = new Date(item);
  return date.toLocaleDateString("ru-RU");
};

const getEndDate = (item: { departureDate: string | Date; duration: number }) => {
  const startDate: Date = new Date(item.departureDate);

  const newDate = new Date(startDate);
  newDate.setDate(startDate.getDate() + item.duration);
  return newDate;
};

const getProfit = (item: { fullPrice: number; paymentsTotal: number }) => {
  return (item.fullPrice - item.paymentsTotal).toFixed(2);
};

const updateRequestsFlag = async () => {
  await $fetch("/api/requests/request-report", {
    method: "PATCH" as any,
    body: { isChecked: true, requestIds: report.value?.map((item) => item._id) },
  });
};

const exportToExcel = async () => {
  if (!report.value) {
    alert("Нет данных для экспорта");
    return;
  }

  await updateRequestsFlag();

  const data = report.value.map((item, index) => ({
    "п/п": index + 1,
    "ФИО клиента": item.customerFullName,
    "Номер заявки оператору": item.tourOperatorRequestId,
    "Номер заявки": item.requestId,
    "Дата начала": formatDate(item.departureDate),
    "Дата окончания": formatDate(item.endDate),
    Стоимость: item.fullPrice.toFixed(2),
    "Оплата оператору": item.paymentsTotal.toFixed(2),
    Прибыль: getProfit(item),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Отчет");
  XLSX.writeFile(workbook, "Отчет.xlsx");
};
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
th {
  background-color: #f4f4f4;
}
</style>
