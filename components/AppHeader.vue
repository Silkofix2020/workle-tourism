<template>
  <header class="header">
    <nav class="header__nav">
      <NuxtLink class="header__link" to="/">Главная</NuxtLink>
      <NuxtLink class="header__link" to="/requests">Заявки</NuxtLink>
      <NuxtLink class="header__link" to="/requests-report">Отчет по заявкам</NuxtLink>
    </nav>
    <div class="header__auth" v-if="loggedIn">
      <h3>Привет, {{ user.username }}!</h3>
      <NuxtLink class="header__link" @click="handleLogout">Выйти</NuxtLink>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useRequestsStore } from "~/stores/requestsStore";
const { user, clear, loggedIn } = useUserSession();

const requestsStore = useRequestsStore();

const handleLogout = async () => {
  await clear();
  await navigateTo("/login");
  // Очищаем сессию
  // Перенаправляем на /login
};
</script>

<style lang="scss" scoped>
.header {
  background-color: #f9f9f9;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header__nav {
  display: flex;
  gap: 20px;
}

.header__link {
  font-size: 16px;
  color: #333;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #007bff;
    color: white;
  }

  &.router-link-active {
    background-color: #007bff;
    color: white;
    cursor: auto;
  }
}

.header__auth {
  display: flex;
  align-items: center;
  gap: 10px;

  & h3 {
    margin: 0;
  }

  .header__link {
    color: #d32f2f; // Красный для logout, чтобы выделить
    font-weight: 500;
    cursor: pointer;
    &:hover {
      background-color: #d32f2f;
      color: white;
    }
  }
}
</style>
