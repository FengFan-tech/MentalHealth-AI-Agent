<template>
<div class="from-page">
  <el-form :model="formData" ref="formRef">
    <el-row :gutter="24">
      <template v-for="item in newFormItem" :key="item.prop">
        <el-col v-bind="item.col">
          <el-form-item :label="item.label" :prop="item.prop">
            <component :is="isComp(item.comp)" :placeholder="item.placeholder" v-model="formData[item.prop]">
              <template v-if="isComp(item.comp) === 'el-select'">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="option in item.options" :key="option.value" :label="option.label"
                  :value="option.value"></el-option>
              </template>
            </component>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
    <el-row>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button type="primary" @click="handleReset(formRef)">重置</el-button>
    </el-row>
  </el-form>
</div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  formItem: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["search"]);

// 用于存储表单数据的对象
const formData = ref({});

const formRef = ref(null);

// 监听formItem变化，初始化formData
watch(
  () => props.formItem,
  (newItems) => {
    newItems.forEach((item) => {
      if (!formData.value[item.prop]) {
        formData.value[item.prop] = item.value || "";
      }
    });
  },
  { immediate: true, deep: true }
);

const newFormItem = computed(() => {
  const { formItem } = props;
  formItem.forEach((item) => {
    item.col = { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 };
  });

  return formItem;
});

const isComp = (comp) => {
  return {
    input: "el-input",
    select: "el-select",
  }[comp];
};

const handleSearch = () => {
  console.log(formData.value);
  emit("search", formData.value);
  handleReset(formRef.value);
};

const handleReset = (formRef) => {
  if (!formRef) {
    return;
  }
  formRef.resetFields();
};
</script>

<style lang="scss" scoped>
.from-page {
  margin-left: 20px;
}
</style>
