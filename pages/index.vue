<template>
  <div>
    <div>
      <UserRevenueCalc />
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: "auth",
});

const { user } = useUserSession();
</script>

<style></style>
