import { defineEventHandler } from "h3";
import Request from "~/server/models/Request";

export default defineEventHandler(async (event) => {
  try {
    const requests = await Request.aggregate([
      {
        $match: {
          $or: [{ isChecked: false }, { isChecked: { $exists: false } }],
        },
      },
      {
        $match: {
          "payments.paymentsToOperator.paid": true,
        },
      },
      {
        $project: {
          _id: 1,
          customerFullName: {
            $concat: ["$customer.surname", " ", "$customer.name", " ", "$customer.patronymic"],
          },
          tourOperatorRequestId: 1,
          requestId: 1,
          departureDate: 1,
          endDate: {
            $dateAdd: {
              startDate: "$departureDate",
              unit: "day",
              amount: "$duration",
            },
          },
          fullPrice: "$tableCalc.total.fullPrice",
          paymentsTotal: {
            // Добавляем вычисляемое поле с суммой платежей
            $sum: "$payments.paymentsToOperator.payments.paymentAmount",
          },
        },
      },
    ]);

    return requests;
  } catch (error: any) {
    return {
      statusCode: 500,
      message: "Internal Server Error",
      error: error.message,
    };
  }
});
