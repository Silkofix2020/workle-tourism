import { ref } from "vue";

export const useCopyText = () => {
  const isCopied = ref(false);
  let copyTimeout: ReturnType<typeof setTimeout> | null = null;

  const copyText = (text: string) => {
    console.log("--- Начало вызова copyText ---");
    console.log("[1] Текст для копирования:", text);

    // Отменяем предыдущий таймер, если он есть
    if (copyTimeout) {
      console.log("[2] Очищаем предыдущий таймер");
      clearTimeout(copyTimeout);
      copyTimeout = null;
    }

    console.log("[3] Устанавливаем isCopied = true");
    isCopied.value = true;

    console.log("[4] Запускаем копирование в буфер обмена...");

    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("[5] Текст успешно скопирован:", text);
      })
      .catch((err) => {
        console.error("[❌] Ошибка при копировании:", err);
        console.log("[⚠️] Устанавливаем isCopied = false из-за ошибки");
        isCopied.value = false;
      });

    console.log("[6] Устанавливаем таймер на 1500 мс для сброса состояния");
    copyTimeout = setTimeout(() => {
      console.log("[7] [таймер] Сработал setTimeout — устанавливаем isCopied = false");
      isCopied.value = false;
      console.log("[8] [таймер] Состояние после сброса:", isCopied.value);
      copyTimeout = null;
    }, 1000);
  };

  return { copyText, isCopied };
};
