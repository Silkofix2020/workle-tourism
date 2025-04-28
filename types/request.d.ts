export interface TableItem {
  basePrice: number | null;
  quantity: number;
  fullPrice: number;
  commission: number;
  career: number;
  profit: number;
}

export interface DiscountItem {
  amount: number | null;
}

export interface TableCalc {
  base: TableItem;
  visa: TableItem;
  fuel: TableItem;
  insurance: TableItem;
  additional: TableItem;
  discount: DiscountItem;
}

// Для отдельных платежей
export interface PaymentItem {
  paymentDate: Date | string | null;
  paymentAmount: number | null; // Добавляем null
}

// Для платежей оператору
export interface OperatorPayments {
  payments: PaymentItem[];
  partPay?: Date | string | null;
  fullPay?: Date | string | null;
}

// Общая структура платежей
export interface PaymentsData {
  paymentFromClientStatus: string;
  paymentsFromClient: PaymentItem[];
  paymentsToOperator: OperatorPayments;
}

export interface Request {
  [key: string]: any;
  _id: string;
  requestId: string;
  requestStatus: string;
  departureDate: Date;
  tourOperatorRequestId: string;
  tourName: string;
  duration: number;
  hotelName: string;
  destinationCountry: string;
  payments: PaymentsData;
  tableCalc: TableCalc;
  createdBy: string;
  modifiedBy: string;
}
