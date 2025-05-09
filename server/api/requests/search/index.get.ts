import Request from "~/server/models/Request";

export default defineEventHandler(async (event) => {
  const { searchValue } = getQuery(event);

  if (!searchValue) {
    throw createError({
      statusCode: 400,
      message: "Не передан параметр searchValue",
    });
  }

  try {
    const request = await Request.findOne(
      { $or: [{ requestId: searchValue }, { tourOperatorRequestId: searchValue }] },
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
    );

    if (!request) {
      throw createError({
        statusCode: 404,
        message: "Заявка не найдена",
      });
    }

    return {
      message: "Заявка найдена",
      request,
    };
  } catch (error: any) {
    if (error.statusCode || error.status) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Ошибка сервера при поиске заявки",
    });
  }
});
