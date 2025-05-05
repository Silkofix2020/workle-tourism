<template>
  <div class="search__box">
    <input v-model="searchValue" id="searchValue" type="text" placeholder="Введите номер заявки" />
    <label for="searchValue">{{ validateSearchValue ? errorMessage : "" }}</label>
    <AppButton @click="searchRequest"> Найти </AppButton>
    <button @click="clearSearch">Очистить</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRequestsStore } from "~/stores/requestsStore";

const requestsStore = useRequestsStore();

const searchValue = ref("");
const validateSearchValue = ref(false);
const errorMessage = ref("");

const searchRequest = async () => {
  if (!searchValue.value) {
    errorMessage.value = "Введите номер заявки";
    validateSearchValue.value = true;
    return;
  }

  // Поиск и добавление заявки в стор
  const foundRequest = await requestsStore.findAndAddRequestById(searchValue.value);

  if (!foundRequest) {
    errorMessage.value = "Заявка не найдена";
    validateSearchValue.value = true;
  } else {
    errorMessage.value = "";
    validateSearchValue.value = false;
  }
};

const clearSearch = () => {
  requestsStore.setSearchById(null);
  searchValue.value = "";
};
</script>

<style lang="scss" scoped>
.search__box {
  display: flex;
  align-items: center;
  gap: 10px;

  & input {
    width: 300px;
  }
}
</style>
