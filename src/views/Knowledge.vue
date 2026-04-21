<template>
<div class="knowledge-page">
    <page-header>
        <template #button>
            <el-button type="primary">新增</el-button>
        </template>
    </page-header>
    <from-page :form-item="FromItem" @search="handleSearch"></from-page>
</div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue';
import FromPage from '@/components/FromPage.vue';
import { reactive, ref ,onMounted } from 'vue';
import { categoryTree } from '../apis/admin';

const router = useRouter()
const categoryMap = reactive({})
const categories = ref([])

const FromItem = reactive([
    { comp: 'input', label: '文章标题', prop: 'title', placeholder: '请输入文章标题' },
    {
        comp: 'select', label: '文章分类', prop: 'categoryId', placeholder: '请选择文章分类', options: []
    },
    {
        comp: 'select', label: '状态', prop: 'status', placeholder: '请选择状态', options: [
            {
                label: '未发布',
                value: '2',
            },
            {
                label: '已发布',
                value: '1',
            },
            {
                label: '草稿',
                value: '0',
            }
        ]
    }
])

const handleSearch = (data) => {
    console.log(data);
}


// 获取分类
onMounted(async () => {
    const data = await categoryTree();
    categories.value = data.map(item => {
        categoryMap[item.id] = item.categoryName
        return {
            label: item.categoryName,
            value: item.id
        }
    })
    FromItem[1].options = categories.value
})
</script>


<style lang="scss" scoped>
.knowledge-page {
    background-color: aqua;
}
</style>
