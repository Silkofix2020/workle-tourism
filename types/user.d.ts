// определил структуру для User в модуле nuxt-auth
declare module "#auth-utils" {
  interface User {
    id: string;
    username: string;
    email: string;
  }
}
