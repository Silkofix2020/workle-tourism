<template>
  <div class="login-page">
    <div class="form__wrapper">
      <form class="form" @submit.prevent="login">
        <input v-model="form.username" type="text" placeholder="Username" autocomplete="current-username" />
        <input v-model="form.password" type="password" placeholder="Password" autocomplete="current-password" />
        <AppButton type="submit">Войти</AppButton>
      </form>
      <p v-for="(item, index) in errorMessage" :key="index">{{ item.message }}</p>
      <div class="register-link">
        <h4>Нет аккаунта?</h4>
        <NuxtLink to="/register">Регистрация</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "auth",
});
const form = ref({
  username: "",
  password: "",
});
const errorMessage = ref<any[]>();

const { fetch, loggedIn } = useUserSession();

const login = async () => {
  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: form.value,
    });
    await fetch();
    navigateTo("/");
  } catch (error: any) {
    errorMessage.value = JSON.parse(error.data.message);
  }
};

onMounted(() => {
  if (loggedIn.value) {
    navigateTo("/");
  }
});
</script>

<style lang="scss" scoped>
.login-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.form__wrapper {
  width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;

  input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: #007bff;
    }

    &::placeholder {
      color: #999;
    }
  }
}

.error {
  color: #d32f2f;
  font-size: 14px;
  margin: 5px 0 0;
  line-height: 1.4;
}
.register-link {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
