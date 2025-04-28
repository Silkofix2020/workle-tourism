import mongoose from "mongoose";

// Схема для платежей клиента
const clientPaymentSchema = new mongoose.Schema({
  paymentDate: Date,
  paymentAmount: Number,
});

// Схема для платежей туроператору
const operatorPaymentsSchema = new mongoose.Schema({
  payments: [
    {
      paymentDate: Date,
      paymentAmount: Number,
    },
  ],
  partPay: Date,
  fullPay: Date,
});

// Схема для платежей
const PaymentSchema = new mongoose.Schema({
  paymentFromClientStatus: {
    type: String,
    enum: ["Не оплачена", "Предоплата", "Оплачена", "Отменена"],
    default: "Не оплачена",
  },
  paymentsFromClient: [clientPaymentSchema],
  paymentsToOperator: operatorPaymentsSchema,
});

// Схема для обычных позиций таблицы (base, visa, fuel, insurance, additional)
const tableItemSchema = new mongoose.Schema({
  basePrice: { type: Number, default: null },
  quantity: { type: Number, default: 0 },
  fullPrice: { type: Number, default: 0 },
  commission: { type: Number, default: 0 },
  career: { type: Number, default: 0 },
  profit: { type: Number, default: 0 },
});

// Схема для позиции скидки
const discountItemSchema = new mongoose.Schema({
  amount: { type: Number, default: null },
});

// Схема для всей таблицы
const tableCalcSchema = new mongoose.Schema({
  base: tableItemSchema,
  visa: tableItemSchema,
  fuel: tableItemSchema,
  insurance: tableItemSchema,
  additional: tableItemSchema,
  discount: discountItemSchema,
});

// Основная схема запроса
const requestSchema = new mongoose.Schema(
  {
    requestId: { type: String, required: true, unique: true },
    requestStatus: {
      type: String,
      enum: ["Поступила", "Подтверждена", "Бронирование", "Отменена"],
      default: "Поступила",
    },

    payments: PaymentSchema,

    touroperator: String,
    tourOperatorRequestId: String,
    tourName: String,
    departureCity: String,
    destinationCountry: String,
    departureDate: Date,
    price: Number,
    duration: Number,
    hotelName: String,

    createdBy: String,
    modifiedBy: String,

    // Добавляем данные таблицы
    tableCalc: {
      type: tableCalcSchema,
      default: () => ({
        base: {},
        visa: {},
        fuel: {},
        insurance: {},
        additional: {},
        discount: {},
      }),
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Request || mongoose.model("Request", requestSchema);
