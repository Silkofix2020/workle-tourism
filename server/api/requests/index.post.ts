import mongoose from "mongoose";
import Request from "~/server/models/Request"; // Путь к вашей модели Request

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const {
      requestId,
      requestStatus,
      payments,
      touroperator,
      tourName,
      departureCity,
      destinationCountry,
      departureDate,
      price,
      duration,
      createdBy,
      modifiedBy,
    } = body;

    // Проверка обязательных полей
    if (!requestId || !touroperator || !tourName || !createdBy) {
      throw createError({
        statusCode: 400,
        statusMessage: "Отсутствуют обязательные поля",
      });
    }

    const newRequest = new Request({
      requestId,
      requestStatus: requestStatus || "Поступила",
      payments: {
        paymentFromClientStatus: payments?.paymentFromClientStatus || "Не оплачена",
        paymentsFromClient:
          payments?.paymentsFromClient?.map((p: any) => ({
            paymentDate: p.paymentDate ? new Date(p.paymentDate) : undefined,
            paymentAmount: parseFloat(p.paymentAmount) || undefined,
          })) || [],
        paymentsToOperator: {
          payments:
            payments?.paymentsToOperator?.payments.map((p: any) => ({
              paymentDate: p.paymentDate ? new Date(p.paymentDate) : undefined,
              paymentAmount: parseFloat(p.paymentAmount) || undefined,
            })) || [],
          partPay: payments?.paymentsToOperator?.partPay ? new Date(payments.paymentsToOperator.partPay) : undefined,
          fullPay: payments?.paymentsToOperator?.fullPay ? new Date(payments.paymentsToOperator.fullPay) : undefined,
        },
      },
      touroperator,
      tourName,
      departureCity,
      destinationCountry,
      departureDate: departureDate ? new Date(departureDate) : undefined,
      price: parseFloat(price) || undefined,
      duration: parseInt(duration) || undefined,
      createdBy,
      modifiedBy: modifiedBy || createdBy,
    });

    await newRequest.save();

    return {
      message: "Заказ успешно создан",
      request: newRequest,
    };
  } catch (error) {
    console.error("Ошибка при создании заказа:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Внутренняя ошибка сервера",
    });
  }
});
