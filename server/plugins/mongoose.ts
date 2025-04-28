import mongoose from "mongoose";

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig();

  try {
    await mongoose.connect(`${config.mongoUri}`);
    console.log("Подключился к БД");
  } catch (error) {
    console.error("Ошибка подключения к БД:", error);
  }
});
