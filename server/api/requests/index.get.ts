import mongoose from "mongoose";
import Request from "~/server/models/Request";

export default defineEventHandler(async (event) => {
  try {
    const requests = await Request.find(
      {},
      {
        departureDate: 1,
        requestId: 1,
        "payments.paymentFromClientStatus": 1,
        requestStatus: 1,
        _id: 1,
      }
    ).exec();

    return {
      message: "Заказы успешно получены",
      requests,
    };
  } catch (error) {
    console.error("Ошибка при получении заказов:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Внутренняя ошибка сервера",
    });
  }
});
