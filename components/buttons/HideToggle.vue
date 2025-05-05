<template>
  <NuxtLink class="link" @click.prevent="toggle" role="button">{{ isOpen ? "Скрыть" : "Показать" }}</NuxtLink>
</template>

<script lang="ts" setup>
const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["update:isOpen"]);

const toggle = () => {
  emit("update:isOpen", !props.isOpen);
};
</script>

<style lang="scss" scoped>
.link {
  cursor: pointer;
  color: #0077cc;
  text-decoration: underline;
  text-transform: none;
  font-weight: 400;
  display: block;
  text-align: right;
}
</style>
