<template>
  <SectionWrapper width="50%" class="info-panel">
    <h4 class="info-panel__title">{{ props.blockType === "flights" ? "Ближайшие вылеты" : "Ближайшие оплаты" }}:</h4>
    <SectionWrapper class="info-panel__card" v-for="item in visibleItems" :key="item._id">
      <InfoPanelCard :data="item" :blockType="props.blockType" />
    </SectionWrapper>
    <transition name="myanimation">
      <div v-if="showAllItems">
        <SectionWrapper class="info-panel__card" v-for="item in hiddenItems" :key="item._id">
          <InfoPanelCard :data="item" :blockType="props.blockType" />
        </SectionWrapper>
      </div>
    </transition>

    <NuxtLink
      v-if="props.data?.length > 2"
      class="link"
      @click="showAllItems = !showAllItems"
      style="display: block; text-align: right"
      >{{ showAllItems ? "Скрыть" : "Показать" }}
    </NuxtLink>
  </SectionWrapper>
</template>

<script lang="ts" setup>
import type { CombineData } from "~/types/OtherData";

const props = defineProps<{
  data: CombineData[];
  blockType?: "flights" | "payments";
}>();

const sortedItems = computed(() => {
  if (!props.data || !Array.isArray(props.data)) {
    return [];
  }
  if (props.blockType === "flights") {
    return [...props.data]
      .filter((item) => item.type === "flight")
      .sort((a, b) => {
        return new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime();
      });
  } else {
    return [...props.data]
      .filter((item) => item.type === "payment")
      .sort((a, b) => {
        return new Date(a.payment.date).getTime() - new Date(b.payment.date).getTime();
      });
  }
});

const visibleItems = computed(() => sortedItems.value?.slice(0, 2));
const hiddenItems = computed(() => sortedItems.value?.slice(2));

const showAllItems = ref(false);
</script>

<style lang="scss" scoped>
.info-panel {
  &__link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    text-decoration: none;
    color: #333;
  }
  &__documents {
    text-align: center;
    font-weight: 500;
    width: fit-content;
    padding: 5px 10px;
    border-radius: 5px;
  }
  &__card:hover {
    box-shadow: 0 0 8px 2px #ccc;
    transition: box-shadow 0.3s ease-in-out;
  }
}

.link {
  cursor: pointer;
  color: #0077cc;
  text-decoration: underline;
  user-select: none;
}

.document-issued {
  background-color: #d8ffdc;
}
.document-not-issued {
  background-color: #ffd8d8;
}

.myanimation-enter-active,
.myanimation-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.myanimation-enter-from,
.myanimation-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
