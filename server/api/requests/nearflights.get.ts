import Request from "~/server/models/Request";

export default defineEventHandler(async (event) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tommorrow = new Date(today);
    tommorrow.setDate(today.getDate() + 1);

    const upperBound = new Date(today);
    upperBound.setDate(today.getDate() + 4);

    const requests = await Request.find(
      {
        departureDate: {
          $gte: tommorrow,
          $lt: upperBound,
        },
      },
      {
        _id: 1,
        requestId: 1,
        departureDate: 1,
        documentsStatus: 1,
      }
    ).exec();

    return requests.map((req) => ({
      ...req.toObject(), // Преобразуем Mongoose-документ в plain object (на всякий случай)
      type: "flight" as const, // Добавляем дискриминатор
    }));
  } catch (error) {
    console.error("Ошибка при получении заказов:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Внутренняя ошибка сервера",
    });
  }
});
