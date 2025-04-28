<template>
  <div class="form-group">
    <label v-if="label" :for="id">{{ label }}</label>
    <select :id="id" v-model="selectedValue" @change="onChange">
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value" :disabled="option.disabled">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script lang="ts" setup>
interface SelectOpton {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface Props {
  modelValue?: string | number;
  options: SelectOpton[];
  id?: string;
  label?: string;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: "select",
  placeholder: "Выбрать",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
  (e: "change", value: string | number): void;
}>();

const selectedValue = ref(props.modelValue ?? "");

watch(
  () => props.modelValue,
  (newValue) => {
    selectedValue.value = newValue ?? "";
  }
);

const onChange = () => {
  emit("update:modelValue", selectedValue.value);
  emit("change", selectedValue.value);
};
</script>

<style lang="scss" scoped>
.form-group {
  width: 280px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
  }

  input,
  select {
    width: 150px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
    }
  }
}
</style>
