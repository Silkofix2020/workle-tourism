export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);

  // Проверяем, что маршрут начинается с `/api/` и НЕ начинается с `/api/auth`
  if (
    url.pathname.startsWith("/api/") &&
    !url.pathname.startsWith("/api/_auth") &&
    !url.pathname.startsWith("/api/auth") &&
    !url.pathname.startsWith("/api/_nuxt_icon")
  ) {
    try {
      // Требуем наличие сессии (если нет — будет ошибка 401)
      await requireUserSession(event);
    } catch (error) {
      // Можно добавить логирование ошибки, если нужно
      console.error("Auth middleware error:", error);

      // Если сессии нет, возвращаем 401
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }
  }
  // Для остальных маршрутов middleware ничего не делает
});
