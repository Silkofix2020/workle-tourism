<template>
  <table>
    <tbody>
      <tr v-for="item in parametric" :key="item.id">
        <td>{{ item.label }}:</td>
        <td :class="{ 'edit-mode': !item.showSpan }">
          <template v-if="item.id === 'departureDate'">
            <span v-if="item.showSpan">{{ useFormatDate(request[item.id]) }}</span>
            <input @keydown.enter="toggleShow(item)" v-else v-model="request[item.id]" :id="item.id" " type="date" />
          </template>
          <template v-else-if="item.id === 'flightThere' || item.id === 'flightBack'">
            <span v-if="item.showSpan">{{ request.flights?.[item.id] }}</span>
            <input
              @keydown.enter="toggleShow(item)"
              v-else
              v-model="request.flights[item.id]"
              :id="item.id"
              type="text"
            />
          </template>
          <template v-else>
            <span v-if="item.showSpan">{{ request[item.id] }}</span>
            <input @keydown.enter="toggleShow(item)" v-else v-model="request[item.id]" :id="item.id" type="text" />
          </template>
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
import { useFormatDate } from "~/composables/useFormatDate";

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

const request = reactive(props.request);

const parametric = ref<Parametric[]>([
  { label: "Номер заявки ТО", id: "tourOperatorRequestId", showSpan: true },
  { label: "Название тура", id: "tourName", showSpan: true },
  { label: "Город вылета", id: "departureCity", showSpan: true },
  { label: "Страна назначения", id: "destinationCountry", showSpan: true },
  { label: "Дата вылета", id: "departureDate", showSpan: true },
  { label: "Продолжительность", id: "duration", showSpan: true },
  { label: "Отель", id: "hotelName", showSpan: true },
  { label: "Категория отеля", id: "hotelCategory", showSpan: true },
  { label: "Тип номера", id: "hotelRoomType", showSpan: true },
  { label: "Рейс туда", id: "flightThere", showSpan: true },
  { label: "Рейс обратно", id: "flightBack", showSpan: true },
]);

const toggleShow = (item: Parametric) => {
  item.showSpan = !item.showSpan;
};
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
