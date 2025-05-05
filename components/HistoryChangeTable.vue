<template>
  <table class="history-of-changes">
    <tbody>
      <tr class="history-of-changes__title">
        <td colspan="3">Создано</td>
      </tr>
      <tr class="history-of-changes__item">
        <td>{{ toLocaleDateLong(data.createdBy.created_at) }}</td>
        <td>{{ data.createdBy.username }}</td>
      </tr>
      <tr class="history-of-changes__title">
        <td colspan="1">Изменено</td>
        <td colspan="1">
          <HideToggle v-model:isOpen="showAllChanges" />
        </td>
      </tr>
      <tr v-for="change in visibleChanges" :key="change._id" class="history-of-changes__item">
        <td>{{ toLocaleDateLong(change.modified_at) }}</td>

        <td>{{ change.username }}</td>
      </tr>
      <transition-group name="slide">
        <tr v-if="showAllChanges" v-for="change in hiddenChanges" :key="change._id" class="history-of-changes__item">
          <td>{{ toLocaleDateLong(change.modified_at) }}</td>

          <td>{{ change.username }}</td>
        </tr>
      </transition-group>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { useDateConvert } from "#imports";
import HideToggle from "./buttons/HideToggle.vue";

const { toLocaleDateLong } = useDateConvert();
const showAllChanges = ref(false);

const props = defineProps({
  data: {
    type: Object as PropType<{
      createdBy: { created_at: string | Date; username: string };
      modifiedBy: { modified_at: string | Date; username: string }[];
    }>,
    required: true,
  },
});

const sortedChanges = computed((): any => {
  return [...props.data.modifiedBy].sort(
    (a: any, b: any) => new Date(b.modified_at).getTime() - new Date(a.modified_at).getTime()
  );
});

const visibleChanges = computed(() => sortedChanges.value?.slice(0, 3));
const hiddenChanges = computed(() => sortedChanges.value?.slice(3));
</script>

<style lang="scss" scoped>
.history-of-changes {
  width: 30%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;

  td {
    padding: 12px 16px;
    border-bottom: 1px solid #e0e0e0;
    text-align: left;
  }

  &__title td {
    background-color: #f5f5f5;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 14px;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }

  &__item {
    td:last-child {
      text-align: right;
      color: #555;
    }

    &:nth-child(even) {
      background-color: #fafafa;
    }
  }
}
</style>
