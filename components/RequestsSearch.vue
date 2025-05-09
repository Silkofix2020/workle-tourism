<template>
  <div class="search__box">
    <div class="search__group">
      <label for="searchValue">Поиск заявок:</label>
      <input
        v-model="searchValue"
        id="searchValue"
        type="text"
        placeholder="Введите номер заявки"
        @keydown.enter="searchRequest"
      />
      <p class="search__error">{{ errorMessage }}</p>
    </div>
    <AppButton @click="searchRequest"> Найти </AppButton>
    <AppButton class="delete" @click="clearSearch">Очистить</AppButton>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRequestsStore } from "~/stores/requestsStore";

const requestsStore = useRequestsStore();

const searchValue = ref("");
const validateSearchValue = ref(false);
const errorMessage = ref("");

const replaceSearchValue = computed(() => {
  return searchValue.value.replace(/\s/g, "");
});

const searchRequest = async () => {
  if (!searchValue.value) {
    errorMessage.value = "Поле не может быть пустым!";
    validateSearchValue.value = true;
    return;
  }

  // Поиск и добавление заявки в стор
  const foundRequest = await requestsStore.findAndAddRequestById(replaceSearchValue.value);

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
  errorMessage.value = "";
};
</script>

<style lang="scss" scoped>
.search {
  &__box {
    position: relative;
    display: flex;
    align-items: flex-end;
    gap: 10px;

    label {
      font-weight: 500;
      color: #333;
    }

    input {
      padding: 9px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      outline: none;
      transition: border-color 0.3s ease;

      &:focus {
        border-color: #007bff;
      }
    }
  }

  &__group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  &__error {
    position: absolute;
    top: 65px;
    left: 5px;
    color: red;
  }
}
</style>
