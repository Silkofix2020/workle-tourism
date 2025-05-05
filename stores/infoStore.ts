import { defineStore } from "pinia";
import type { NearFlight, NearPayment } from "~/types/OtherData";
import { ref } from "vue";

export const useInfoStore = defineStore("infoStore", () => {
  const flightsInfo = ref<NearFlight[]>([]);
  const paymentsInfo = ref<NearPayment[]>([]);

  const areFlightsLoaded = ref(false);
  const arePaymentsLoaded = ref(false);
  const isLoadingFlights = ref(true);
  const isLoadingPayments = ref(true);

  // Получение информации о рейсах
  const getFlightsInfo = async () => {
    if (areFlightsLoaded.value) return;

    try {
      const data = await $fetch<NearFlight[]>("/api/requests/nearflights");
      flightsInfo.value = data;
      areFlightsLoaded.value = true;
      isLoadingFlights.value = false;
    } catch (error) {
      console.error("Ошибка при загрузке рейсов:", error);
    }
  };

  // Получение информации о платежах
  const getPaymentsInfo = async () => {
    if (arePaymentsLoaded.value) return;

    try {
      const data = await $fetch<NearPayment[]>("/api/requests/nearpayments");
      paymentsInfo.value = data;
      arePaymentsLoaded.value = true;
      isLoadingPayments.value = false;
    } catch (error) {
      console.error("Ошибка при загрузке платежей:", error);
    }
  };

  return {
    flightsInfo,
    paymentsInfo,
    getFlightsInfo,
    getPaymentsInfo,
    isLoadingFlights,
    isLoadingPayments,
  };
});
