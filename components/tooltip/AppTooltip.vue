<template>
  <div class="tooltip-container copy" @click="copyText(text)">
    {{ text }}
    <template v-if="isCopied">
      <span class="tooltip-text" style="display: flex; align-items: center; gap: 5px">
        Скопировано!
        <Icon style="color: #28a745" name="i-weui-done2-filled" size="20px" />
      </span>
    </template>
    <template v-else>
      <span class="tooltip-text">{{ label }}</span>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useCopyText } from "#imports";

const { copyText, isCopied } = useCopyText();

const props = defineProps<{
  text: string;
  label: string;
}>();
</script>

<style lang="scss" scoped>
.tooltip-container {
  position: relative;
  cursor: help;
  display: inline-block;
  user-select: none;
}

.tooltip-text {
  visibility: visible;
  width: fit-content;
  background: rgba($color: #333, $alpha: 0.9);
  color: #fff;
  text-align: center;
  border-radius: 4px;
  padding: 5px 10px;
  position: absolute;
  z-index: 1;
  bottom: 125%; /* показать над элементом */
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;

  white-space: nowrap;
}

.tooltip-container:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
  transition: 0.3s;
}

.copy {
  cursor: copy;
  &:hover {
    background-color: #ebebeb;
    border-radius: 5px;
  }
  &:active {
    background-color: $pastel-green;
  }
}
</style>
