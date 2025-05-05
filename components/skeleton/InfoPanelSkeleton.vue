<template>
  <SectionWrapper width="50%" class="info-panel">
    <h4 class="info-panel__title">{{ props.blockType === "flights" ? "Ближайшие вылеты" : "Ближайшие оплаты" }}:</h4>
    <SectionWrapper v-for="n in 2">
      <div class="info-panel__link">
        <div class="info-panel__info">
          <h4 class="info-panel__label"></h4>
          <div class="info-panel__value"></div>
        </div>
        <div class="info-panel__info">
          <h4 class="info-panel__label"></h4>
          <div class="info-panel__value"></div>
        </div>
        <div class="info-panel__info">
          <h4 class="info-panel__label"></h4>
          <div class="info-panel__value info-panel__documents"></div>
        </div>
        <Icon style="color: #333" name="i-line-md-external-link" size="20px" />
      </div>
    </SectionWrapper>
  </SectionWrapper>
</template>

<script lang="ts" setup>
const props = defineProps<{
  blockType?: String;
}>();
</script>

<style lang="scss" scoped>
.info-panel {
  &__link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }
}

.info-panel {
  &__link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }
  &__label,
  &__value {
    width: 100%;
    height: 20px;
    background: #747474;
    animation: loading 2s infinite;
    border-radius: 5px;
  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;

    & h4 {
      margin: 0;
    }

    &:first-child {
      flex: 1;
      align-items: flex-start;
    }
    &:nth-child(2) {
      width: 90px;
      margin-right: 40px;
    }
    &:nth-child(3) {
      width: 96px;
    }
  }
}

@keyframes loading {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    opacity: 0.5;
  }
}
</style>
