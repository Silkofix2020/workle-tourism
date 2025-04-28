import { ref, computed } from "vue";

export const useDateConvert = () => {
  const toLocaleDate = (date: string | Date): string => {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      console.error("Invalid date:", date);
      return "Некорректная дата";
    }
    return dateObj.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toInputDate = (isoDate: string | Date): string => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toISOString().split("T")[0];
  };

  const fromInputDate = (inputDate: string): string => {
    return inputDate ? new Date(inputDate).toISOString() : "";
  };

  const useDateInput = (dateRef: Ref<string>) => {
    return computed({
      get: () => toInputDate(dateRef.value),
      set: (val) => {
        dateRef.value = fromInputDate(val);
      },
    });
  };

  return {
    toLocaleDate,
    toInputDate,
    fromInputDate,
    useDateInput,
  };
};
