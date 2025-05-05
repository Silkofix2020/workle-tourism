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
  paid: {
    type: Boolean,
    default: false,
  },
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

const tableItemTotalSchema = new mongoose.Schema({
  fullPrice: { type: Number, default: 0 },
  totalUserProfit: { type: Number, default: 0 },
  totalCompanyProfit: { type: Number, default: 0 },
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
  total: tableItemTotalSchema,
});

const flightsSchema = new mongoose.Schema({
  flightThere: String,
  flightBack: String,
});

const historyCreatedBySchema = new mongoose.Schema({
  username: String,
  created_at: Date,
});
const historyModifiedBySchema = new mongoose.Schema({
  username: String,
  modified_at: Date,
});

const historyOfChangesSchema = new mongoose.Schema({
  createdBy: historyCreatedBySchema,
  modifiedBy: [historyModifiedBySchema],
});

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  surname: {
    type: String,
    default: "",
  },
  patronymic: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
});

// Основная схема запроса
const requestSchema = new mongoose.Schema(
  {
    requestId: { type: String, required: true, unique: true },
    requestStatus: {
      type: String,
      enum: ["Поступила", "Подтверждена", "Бронирование", "Исполнена", "Отменена", "Отказ ТО"],
      default: "Поступила",
    },
    comment: {
      type: String,
      default: "",
    },
    payments: PaymentSchema,
    documentsStatus: {
      type: String,
      enum: ["Не выданы", "Выданы"],
      default: "Не выданы",
    },

    touroperator: {
      type: String,
      default: "",
    },
    tourOperatorRequestId: {
      type: String,
      default: "",
    },
    tourName: {
      type: String,
      default: "",
    },
    departureCity: {
      type: String,
      default: "",
    },
    destinationCountry: {
      type: String,
      default: "",
    },
    departureDate: {
      type: Date,
      default: new Date(),
    },
    price: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
    hotelName: {
      type: String,
      default: "",
    },
    hotelCategory: {
      type: String,
      default: "",
    },
    hotelRoomType: {
      type: String,
      default: "",
    },
    flights: {
      type: flightsSchema,
      default: () => ({
        flightThere: String,
        flightBack: String,
      }),
    },

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
        total: {},
      }),
    },
    customer: {
      type: CustomerSchema,
      default: () => ({
        name: "",
        surname: "",
        patronymic: "",
        phone: "",
        email: "",
      }),
    },
    historyOfChanges: historyOfChangesSchema,
    isChecked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Request || mongoose.model("Request", requestSchema);
