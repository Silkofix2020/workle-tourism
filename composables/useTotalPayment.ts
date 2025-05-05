// composables/useTotalPayment.ts
import type { PaymentItem } from "~/types/request";
import { computed, type Ref } from "vue";

export const useTotalPayment = (payments: Ref<PaymentItem[]>) => {
  const totalPayment = computed(() => {
    const paymentsList = toValue(payments);

    console.log("Payments list:", paymentsList); // Отладочный вывод

    if (!paymentsList || !Array.isArray(paymentsList)) {
      console.log("Payments list is empty or not an array");
      return 0;
    }

    const total = paymentsList.reduce((sum, payment) => {
      console.log("Payment:", payment, "Amount:", payment.paymentAmount); // Отладочный вывод
      return sum + (payment.paymentAmount || 0);
    }, 0);

    console.log("Total:", total); // Отладочный вывод
    return total;
  });

  return {
    totalPayment,
  };
};
