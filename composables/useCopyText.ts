import { ref } from "vue";

export const useCopyText = () => {
  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return { copyText };
};
