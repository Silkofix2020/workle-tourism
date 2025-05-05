<template>
  <div class="section-wrapper" :style="{ width: style.widthValue }">
    <slot />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  width: {
    type: String,
    default: "100%",
  },
});

const style = computed(() => {
  const widthValue = props.width?.includes("%") || props.width?.includes("px") ? props.width : `${props.width}px`;

  return {
    widthValue,
  };
});
</script>

<style lang="scss">
.section-wrapper {
  padding: 10px;
  margin: 20px 0;
  border-radius: 5px;
  box-shadow: 0 0 5px 1px #ccc;
}
</style>
