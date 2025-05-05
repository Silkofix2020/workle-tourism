import mongoose from "mongoose";
import Request from "~/server/models/Request";

export default defineEventHandler(async (event) => {
  const requestId = event.context.params?.requestId;

  if (!requestId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Request ID is required",
    });
  }

  try {
    await Request.deleteOne({ requestId });
    return { message: "Заказ успешно удален" };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Внутренняя ошибка сервера",
    });
  }
});
