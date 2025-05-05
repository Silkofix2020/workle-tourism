interface Payment {
  date: Date;
  type: string;
}

export interface NearFlight {
  _id: string;
  departureDate: string;
  requestId: string;
  documentsStatus: string;
  type: "flight";
}

export interface NearPayment {
  _id: string;
  requestId: string;
  payment: Payment;
  type: "payment";
}

export type CombineData = NearFlight | NearPayment;
