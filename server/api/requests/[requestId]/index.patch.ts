// server/api/requests/[requestId].patch.ts
import { defineEventHandler, readBody, createError } from "h3";
import Request from "~/server/models/Request"; // Путь к вашей модели

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== "PATCH") {
    throw createError({
      statusCode: 405,
      statusMessage: "Method Not Allowed",
    });
  }

  try {
    // Получаем requestId из параметров маршрута
    const requestId = event.context.params?.requestId;
    if (!requestId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Request ID is required",
      });
    }

    // Читаем тело запроса
    const body = await readBody(event);
    if (!body) {
      throw createError({
        statusCode: 400,
        statusMessage: "Request body is required",
      });
    }
    console.log("Request body:", body);
    // Обновляем документ в базе данных
    const updatedRequest = await Request.findOneAndUpdate(
      { requestId }, // Ищем по requestId
      { $set: body }, // Обновляем переданные поля
      { new: true, runValidators: true } // Возвращаем обновленный документ и применяем валидацию
    );

    if (!updatedRequest) {
      throw createError({
        statusCode: 404,
        statusMessage: "Request not found",
      });
    }

    return updatedRequest;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Internal Server Error",
    });
  }
});
