export const useStringHelpers = () => {
  const firstCharUpper = (str: string): string => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatPhone = (str: string): string => {
    if (!str) return "";

    const cleaned = str.replace(/[^+\d]/g, "");
    const hasPlus = cleaned.startsWith("+");

    return hasPlus ? cleaned.slice(0, 12) : "+7" + cleaned.slice(0, 10);
  };

  return {
    firstCharUpper,
    formatPhone,
  };
};
