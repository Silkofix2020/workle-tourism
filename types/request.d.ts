export interface TableItem {
  basePrice: number | null;
  quantity: number;
  fullPrice: number;
  commission: number;
  career: number;
  profit: number;
}

interface TableItemTotal {
  fullPrice: number;
  totalUserProfit: number;
  totalCompanyProfit: number;
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
  total: TableItemTotal;
}

// Для отдельных платежей
export interface PaymentItem {
  paymentDate: Date | string;
  paymentAmount: number | null; // Добавляем null
}

// Для платежей оператору
export interface OperatorPayments {
  payments: PaymentItem[];
  partPay?: Date | string | null;
  fullPay?: Date | string | null;
  paid?: Boolean;
}

// Общая структура платежей
export interface PaymentsData {
  paymentFromClientStatus: string;
  paymentsFromClient: PaymentItem[];
  paymentsToOperator: OperatorPayments;
}

export interface flightsData {
  flightThere: string;
  flightBack: string;
}

interface HistoryCreatedBy {
  username: string;
  created_at: Date;
}

interface HistoryModifiedBy {
  username: string;
  modified_at: Date;
}

export interface HistoryOfChanges {
  createdBy: HistoryCreatedBy;
  modifiedBy: HistoryModifiedBy[];
}

export interface Customer {
  name: string;
  surname: string;
  patronymic: string;
  phone: string;
  email: string;
}

export interface Request {
  [key: string]: any;
  _id: string;
  requestId: string;
  requestStatus: string;
  payments: PaymentsData;
  documentsStatus: string;

  departureDate: Date;
  depatureCity: string;
  tourOperatorRequestId: string;
  tourName: string;
  duration: number;
  hotelName: string;
  hotelCategory: string;
  hotelRoomType: string;
  destinationCountry: string;
  flights: flightsData;

  tableCalc: TableCalc;
  customer: Customer;
  historyOfChanges: HistoryOfChanges;
}
