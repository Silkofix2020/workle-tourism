import Request from "~/server/models/Request";

export default defineEventHandler(async (event) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 4);

    const requests = await Request.find(
      {
        "payments.paymentsToOperator.paid": { $ne: true },
        $or: [
          { "payments.paymentsToOperator.fullPay": { $gte: today, $lt: tomorrow } },
          { "payments.paymentsToOperator.partPay": { $gte: today, $lt: tomorrow } },
        ],
      },
      {
        "payments.paymentsToOperator": 1,
        requestId: 1,
        _id: 1,
      }
    ).lean();

    const transformedRequests = requests.map((request) => {
      const { fullPay, partPay } = request.payments.paymentsToOperator;

      const validDates = [];
      if (fullPay && fullPay >= today && fullPay < tomorrow) {
        validDates.push({ date: fullPay, type: "Полная" });
      }
      if (partPay && partPay >= today && partPay < tomorrow) {
        validDates.push({ date: partPay, type: "Предоплата" });
      }

      validDates.sort((a, b) => a.date - b.date);

      return {
        _id: request._id,
        requestId: request.requestId,
        payment: {
          date: validDates[0]?.date || null,
          type: validDates[0]?.type || null,
        },
        type: "payment" as const,
      };
    });

    return transformedRequests;
  } catch (error) {
    console.error("Ошибка при получении заказов:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Внутренняя ошибка сервера",
    });
  }
});
