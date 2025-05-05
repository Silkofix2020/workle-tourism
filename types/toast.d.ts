export interface Toast {
  id: number;
  text: string;
  isVisible: boolean;
  type?: "success" | "error" | "warning" | "info";
}
