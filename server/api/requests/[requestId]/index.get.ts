// server/api/requests/[requestId].get.ts
import { defineEventHandler, createError } from "h3";
import Request from "~/server/models/Request";
import type { Request as RequestType, PaymentsData } from "~/types/request";

export default defineEventHandler(async (event) => {
  try {
    const requestId = event.context.params?.requestId;
    if (!requestId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Request ID is required",
      });
    }

    const request = await Request.findOne({ requestId }).lean<RequestType>();
    if (!request) {
      throw createError({
        statusCode: 404,
        statusMessage: "Request not found",
      });
    }

    // Удаляем id из tableCalc, если оно существует
    if (request.tableCalc && "id" in request.tableCalc) {
      delete (request.tableCalc as any).id;
    }

    if (request.payments?.paymentsFromClient || request.payments?.paymentsToOperator) {
      request.payments.paymentsFromClient =
        request.payments.paymentsFromClient.map((payment) => {
          return {
            ...payment,
            paymentDate: payment.paymentDate ? new Date(payment.paymentDate).toISOString().split("T")[0] : null,
          };
        }) || [];

      if (request.payments.paymentsToOperator) {
        request.payments.paymentsToOperator = {
          payments:
            request.payments.paymentsToOperator.payments?.map((payment) => {
              return {
                ...payment,
                paymentDate: payment.paymentDate ? new Date(payment.paymentDate).toISOString().split("T")[0] : null,
                paymentAmount: payment.paymentAmount || null,
              };
            }) || [],
          partPay: request.payments.paymentsToOperator.partPay
            ? new Date(request.payments.paymentsToOperator.partPay).toISOString().split("T")[0]
            : null,
          fullPay: request.payments.paymentsToOperator.fullPay
            ? new Date(request.payments.paymentsToOperator.fullPay).toISOString().split("T")[0]
            : null,
          ...(request.payments.paymentsToOperator.paid !== undefined && {
            paid: request.payments.paymentsToOperator.paid,
          }),
        };
      }
    }
    return request;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Internal Server Error",
    });
  }
});
