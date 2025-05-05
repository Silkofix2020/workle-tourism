import { defineEventHandler } from "h3";
import Request from "~/server/models/Request";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { requestIds, isChecked } = body;

  try {
    await Request.updateMany({ _id: { $in: requestIds } }, { $set: { isChecked } });

    return {
      statusCode: 200,
      message: "Requests updated successfully",
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      message: "Internal Server Error",
      error: error.message,
    };
  }
});
