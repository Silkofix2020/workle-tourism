declare module "#app" {
  interface NuxtApp {
    $fetch<T>(
      request: RequestInfo,
      options?: {
        method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
      } & Omit<RequestInit, "method">
    ): Promise<T>;
  }
}

declare module "nuxt/dist/app/nuxt" {
  interface NuxtApp {
    $fetch<T>(
      request: RequestInfo,
      options?: {
        method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
      } & Omit<RequestInit, "method">
    ): Promise<T>;
  }
}
