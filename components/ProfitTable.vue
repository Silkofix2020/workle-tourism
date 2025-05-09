<template>
  <table>
    <thead>
      <tr>
        <th>
          <AppButton @click="editTable = !editTable">{{ editTable ? "Сохранить" : "Редактировать" }}</AppButton>
        </th>
        <th>Стоимость</th>
        <th>Количество</th>
        <th>Полная стоимость</th>
        <th>Комиссия ТО</th>
        <th>Карьера</th>
        <th>Доход</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, key) in filteredTableCalcForRender" :key="key">
        <td>{{ getItemName(key) }}</td>
        <td>
          <!-- Для обычных позиций -->
          <span v-if="!editTable && key !== 'discount'">
            {{ isTableItem(item) && item.basePrice !== null ? formatPrice(item.basePrice) : "" }}
            <span v-if="'basePrice' in item && item.basePrice !== null">₽</span>
          </span>
          <input
            v-else-if="key !== 'discount' && isTableItem(item)"
            :value="item.basePrice"
            type="text"
            @focus="handleFocus(item, 'basePrice')"
            @input="updateBasePrice(key, $event)"
          />

          <!-- Для скидки -->
          <span v-if="!editTable && key === 'discount'">
            {{ isDiscountItem(item) && item.amount !== null ? formatPrice(item.amount) : "" }}
            <span v-if="'amount' in item && item.amount !== null">₽</span>
          </span>
          <input
            v-else-if="key === 'discount' && isDiscountItem(item)"
            :value="item.amount"
            type="text"
            @focus="handleFocus(item, 'amount')"
            @input="updateAmount(key, $event)"
          />
        </td>
        <td>
          <span v-if="!editTable && key !== 'discount' && isTableItem(item)">
            {{ item.quantity }}
          </span>
          <input
            v-else-if="key !== 'discount' && isTableItem(item)"
            :value="item.quantity"
            type="text"
            @focus="handleFocus(item, 'quantity')"
            @input="updateQuantity(key, $event)"
          />
        </td>
        <td>
          {{ key !== "discount" && isTableItem(item) ? formatPrice(item.fullPrice) : "" }}
          <span v-if="key !== 'discount' && isTableItem(item)">₽</span>
        </td>
        <td>
          <span v-if="!editTable && key !== 'discount' && isTableItem(item)"> {{ item.commission }} % </span>
          <input
            v-else-if="key !== 'discount' && isTableItem(item)"
            :value="item.commission"
            type="text"
            @focus="handleFocus(item, 'commission')"
            @input="updateCommission(key, $event)"
          />
        </td>
        <td>
          <span v-if="!editTable && key !== 'discount' && isTableItem(item)">
            {{ item.career }}
          </span>
          <input
            v-else-if="key !== 'discount' && isTableItem(item)"
            :value="item.career"
            type="text"
            @focus="handleFocus(item, 'career')"
            @input="updateCareer(key, $event)"
          />
        </td>
        <td>
          {{ key !== "discount" ? formatPrice(userProfit[`${key}Profit` as keyof Profit]) : "" }}
          <span v-if="key !== 'discount'">₽</span>
        </td>
      </tr>
      <tr>
        <td>Итого</td>
        <td colspan="2"></td>
        <td>{{ formatPrice(userProfit.totalFullPrice) }}</td>
        <td></td>
        <td style="font-weight: 700">Доход пользователя:</td>
        <td>{{ formatPrice(userProfit.totalProfit) }} ₽</td>
      </tr>
      <tr>
        <td colspan="5"></td>
        <td style="font-weight: 700">Доход Workle:</td>
        <td>{{ formatPrice(userProfit.companyProfit) }} ₽</td>
      </tr>
      <tr>
        <td colspan="5"></td>
        <td style="font-weight: 700">ОП Workle:</td>
        <td @click="copyText(formatPrice(userProfit.opWorkle))">{{ formatPrice(userProfit.opWorkle) }} ₽</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import type { TableCalc, TableItem, DiscountItem } from "~/types/request";
import { useCopyText } from "#imports";

const { copyText } = useCopyText();

// Интерфейсы (можно убрать, если они импортированы из ~/interfaces/Request)
interface Profit {
  [key: string]: number;
  totalFullPrice: number;
  totalProfit: number;
  companyProfit: number;
  opWorkle: number;
}

type TableCalcKey = keyof TableCalc;

const props = defineProps<{
  initialTableCalc: TableCalc | null | undefined;
}>();

const emit = defineEmits<{
  (e: "update:tableCalc", value: TableCalc): void;
}>();

const editTable = ref(false);

// Type guards
const isTableItem = (item: any): item is TableItem => {
  return "basePrice" in item && "quantity" in item;
};

const isDiscountItem = (item: any): item is DiscountItem => {
  return "amount" in item;
};

// Helper functions
const formatPrice = (value: number | null | undefined): string => {
  return value !== null && value !== undefined ? value.toFixed(2) : "";
};

const handleFocus = <T extends object>(item: T, field: keyof T) => {
  if (item[field] === 0) {
    item[field] = null as any;
  }
};

// Проверяем и инициализируем tableCalc с корректной структурой
const defaultTableCalc: TableCalc = {
  base: {
    basePrice: 0,
    quantity: 0,
    fullPrice: 0,
    commission: 0,
    career: 0,
    profit: 0,
  },
  visa: {
    basePrice: 0,
    quantity: 0,
    fullPrice: 0,
    commission: 0,
    career: 0,
    profit: 0,
  },
  fuel: {
    basePrice: 0,
    quantity: 0,
    fullPrice: 0,
    commission: 0,
    career: 0,
    profit: 0,
  },
  insurance: {
    basePrice: 0,
    quantity: 0,
    fullPrice: 0,
    commission: 0,
    career: 0,
    profit: 0,
  },
  additional: {
    basePrice: 0,
    quantity: 0,
    fullPrice: 0,
    commission: 0,
    career: 0,
    profit: 0,
  },
  discount: {
    amount: 0,
  },
  total: {
    fullPrice: 0,
    totalUserProfit: 0,
    totalCompanyProfit: 0,
  },
};

// Инициализируем tableCalc, исключая лишние ключи (например, id)

const filteredTableCalc =
  props.initialTableCalc && typeof props.initialTableCalc === "object" && !Array.isArray(props.initialTableCalc)
    ? Object.keys(props.initialTableCalc).reduce((acc, key) => {
        const allowedKeys = ["base", "visa", "fuel", "insurance", "additional", "discount"];

        if (allowedKeys.includes(key)) {
          // @ts-ignore
          acc[key] = props.initialTableCalc![key];
        }

        return acc;
      }, {} as TableCalc)
    : {};

// Добавляем total вручную, даже если его нет в initialTableCalc
const tableCalc = reactive<TableCalc>({
  ...defaultTableCalc,
  ...filteredTableCalc,
  total: {
    fullPrice: 0,
    totalUserProfit: 0,
    totalCompanyProfit: 0,
  },
});

const filteredTableCalcForRender = computed(() => {
  const { total, ...rest } = tableCalc;
  return rest;
});

// Следим за изменениями tableCalc и отправляем обновления родителю
watch(
  tableCalc,
  (newValue) => {
    emit("update:tableCalc", newValue);
  },
  { deep: true }
);

// Вычисляемый доход
const userProfit = computed<Profit>(() => {
  const profits: Profit = { totalFullPrice: 0, totalProfit: 0, companyProfit: 0, opWorkle: 0 };

  let totalItemProfit = 0;
  let totalFullPriceBeforeDiscount = 0;

  const validKeys: TableCalcKey[] = ["base", "visa", "fuel", "insurance", "additional"];

  for (const key of validKeys) {
    const item = tableCalc[key];
    if (isTableItem(item)) {
      const itemProfit =
        item.basePrice && item.basePrice > 0
          ? item.basePrice * item.quantity * (item.commission / 100) * item.career
          : 0;

      profits[`${key}Profit`] = itemProfit;
      totalItemProfit += itemProfit;
      totalFullPriceBeforeDiscount += item.fullPrice || 0;

      const baseCommission =
        item.basePrice && item.basePrice > 0 ? item.basePrice * item.quantity * (item.commission / 100) : 0;
      profits.companyProfit += baseCommission - itemProfit;
    }
  }

  const discount = isDiscountItem(tableCalc.discount) ? tableCalc.discount.amount || 0 : 0;
  profits.totalProfit = totalItemProfit - discount;
  profits.totalFullPrice = totalFullPriceBeforeDiscount - discount;
  profits.opWorkle = profits.totalProfit + profits.companyProfit;

  return profits;
});

watchEffect(() => {
  const profit = userProfit.value;

  tableCalc.total = {
    fullPrice: profit.totalFullPrice,
    totalUserProfit: profit.totalProfit,
    totalCompanyProfit: profit.companyProfit,
  };
});

// Методы для обновления значений
const updateBasePrice = (key: TableCalcKey, event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  if (isTableItem(tableCalc[key])) {
    tableCalc[key].basePrice = value ? Number(value) : null;
    updateFullPrice(key);
  }
};

const updateAmount = (key: TableCalcKey, event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  if (key === "discount" && isDiscountItem(tableCalc[key])) {
    tableCalc[key].amount = value ? Number(value) : null;
  }
};

const updateQuantity = (key: TableCalcKey, event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  (tableCalc[key] as TableItem).quantity = value ? Number(value) : 0;
  updateFullPrice(key);
};

const updateCommission = (key: TableCalcKey, event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  (tableCalc[key] as TableItem).commission = value ? Number(value) : 0;
};

const updateCareer = (key: TableCalcKey, event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  (tableCalc[key] as TableItem).career = value ? Number(value) : 0;
};

// Обновление полной стоимости
const updateFullPrice = (key: TableCalcKey) => {
  if (key !== "discount" && isTableItem(tableCalc[key])) {
    const item = tableCalc[key];
    item.fullPrice = (item.basePrice || 0) * item.quantity;
  }
};

// Маппинг ключей на названия
const getItemName = (key: string): string => {
  const names: { [key: string]: string } = {
    base: "Базовая стоимость",
    visa: "Виза",
    fuel: "Топливный сбор",
    insurance: "Страховка от невыезда",
    additional: "Доп.сборы",
    discount: "Скидка",
  };
  return names[key] || key;
};
</script>

<style lang="scss" scoped>
/* Базовые стили таблицы */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 14px;
}

/* Стили заголовков */
thead th {
  background-color: #f5f5f5;
  padding: 12px 15px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #ddd;
  position: sticky;
  top: 0;
}

/* Стили ячеек */
td {
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
  color: #444;
}

/* Чередование строк */
tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

/* Ховер-эффект */
tbody tr:hover {
  background-color: #f1f1f1;
}

/* Первая колонка - полужирный */
td:first-child {
  font-weight: 500;
  color: #333;
}

/* Границы таблицы */
table {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

input {
  width: 70px;
  padding: 2px 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
