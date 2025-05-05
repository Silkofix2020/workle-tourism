<template>
  <NuxtLink class="link" v-if="hasMore && !loading" @click="loadMore" style="display: block; text-align: right"
    >Показать ещё
  </NuxtLink>
  <p v-if="loading">Идёт загрузка...</p>
  <p v-if="!hasMore">Больше заявок нет</p>
</template>

<script setup>
import { useRequestsStore } from "~/stores/requestsStore";

const requestsStore = useRequestsStore();

const { hasMore, loading } = storeToRefs(requestsStore);

const loadMore = async () => {
  await requestsStore.loadMoreRequests();
};
</script>
<style scoped>
.link {
  cursor: pointer;
  color: #0077cc;
  text-decoration: underline;
  user-select: none;
}
</style>
