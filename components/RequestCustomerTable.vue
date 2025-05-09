<template>
  <table>
    <tbody>
      <tr v-for="item in parametric" :key="item.id">
        <td>{{ item.label }}:</td>
        <td :class="{ 'edit-mode': !item.showSpan }">
          <span v-if="item.showSpan">{{ request?.[item.id] }}</span>
          <input @keydown.enter="toggleShow(item)" v-else v-model="request[item.id]" :id="item.id" type="text" />
        </td>
        <td>
          <button @click="toggleShow(item)">
            <Icon style="color: #db7625" v-if="item.showSpan" name="i-material-symbols-edit" size="20px" />
            <Icon style="color: #1dca21" v-else name="i-material-symbols-download-done-outline" size="20px" />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { useStringHelpers } from "~/composables/useStringHelpers";

const { firstCharUpper, formatPhone } = useStringHelpers();

interface Parametric {
  label: string;
  id: string;
  showSpan: boolean;
}

const props = defineProps({
  request: {
    type: Object,
    required: true,
  },
});

const parametric = ref<Parametric[]>([
  { label: "Фамилия", id: "surname", showSpan: true },
  { label: "Имя", id: "name", showSpan: true },
  { label: "Отчество", id: "patronymic", showSpan: true },
  { label: "Номер телефона", id: "phone", showSpan: true },
  { label: "E-mail", id: "email", showSpan: true },
]);

const toggleShow = (item: Parametric) => {
  item.showSpan = !item.showSpan;
};

const formattedFields = ["name", "surname", "patronymic", "phone"];

watch(
  () => props.request,
  (newRequest) => {
    if (formattedFields.includes("phone")) {
      props.request.phone = formatPhone(newRequest.phone);
    }
    formattedFields.forEach((field) => {
      if (newRequest[field]) {
        props.request[field] = firstCharUpper(newRequest[field]);
      }
    });
  },
  { deep: true, immediate: true }
);
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;

  & td {
    height: 40px;
    padding: 0 5px;
    vertical-align: middle;

    &:first-child {
      width: 20%;
    }
    &:nth-child(2) {
      width: 75%;
    }
    &:last-child {
      width: 5%;
    }
    & input {
      width: 100%;
      border: 0.052rem solid rgba(0, 0, 0, 0.1);
      padding: 5px 2px;
      outline: none;
      font-size: 14px;
    }
  }
}
</style>
