export default defineEventHandler(async (event) => {
  await clearUserSession(event);

  // Выполняем перенаправление на /login
  return sendRedirect(event, "/login", 302);
});
