import mongoose from "mongoose";
import Request from "~/server/models/Request";

export default defineEventHandler(async (event) => {
  const user = await requireUserSession(event);
  const { skip = 0, limit = 10 } = getQuery(event);

  const skipNumber = parseInt(skip as string, 10);
  const limitNumber = parseInt(limit as string, 10);

  if (isNaN(skipNumber) || isNaN(limitNumber) || skipNumber < 0 || limitNumber < 1) {
    throw createError({
      statusCode: 400,
      statusMessage: "Некорректные параметры",
    });
  }

  try {
    const [requests, total] = await Promise.all([
      Request.find(
        {},
        {
          departureDate: 1,
          requestId: 1,
          "payments.paymentFromClientStatus": 1,
          "payments.paymentsToOperator.paid": 1,
          requestStatus: 1,
          _id: 1,
          tourOperatorRequestId: 1,
          touroperator: 1,
        }
      )
        .skip(skipNumber)
        .limit(limitNumber)
        .exec(),
      Request.countDocuments().exec(),
    ]);

    return {
      message: "Заявки получены",
      requests,
      total,
      loaded: requests.length,
      hasMore: skipNumber + requests.length < total,
    };
  } catch (error) {
    console.error("Ошибка при получении заказов:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Внутренняя ошибка сервера",
    });
  }
});
