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
import { ref, watch, computed, onBeforeUnmount } from "vue";

const props = defineProps({
  formItem: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["search"]);

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

// 搜索防抖：输入时自动触发搜索，300ms 内重复输入只执行最后一次
let searchTimer = null
const debouncedSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    emit("search", formData.value)
  }, 300)
}

// 监听表单数据变化，自动触发防抖搜索
watch(formData, () => {
  debouncedSearch()
}, { deep: true })

// 点击查询按钮时立即搜索（跳过防抖）
const handleSearch = () => {
  clearTimeout(searchTimer)
  emit("search", formData.value);
};

const handleReset = (formRef) => {
  if (!formRef) {
    return;
  }
  formRef.resetFields();
};

onBeforeUnmount(() => {
  clearTimeout(searchTimer)
})
</script>

<style lang="scss" scoped>
.from-page {
  margin-left: 20px;
}
</style>
