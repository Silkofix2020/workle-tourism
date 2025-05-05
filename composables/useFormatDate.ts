export const useFormatDate = (item: string | Date) => {
  const date = new Date(item);
  return date.toLocaleDateString("ru-RU");
};
