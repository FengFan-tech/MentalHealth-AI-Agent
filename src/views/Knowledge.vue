<template>
<div class="knowledge-page">
    <page-header title="知识文章">
        <template #button>
            <el-button type="primary" @click="dialogVisible = true">新增</el-button>
        </template>
    </page-header>
    <from-page :form-item="FromItem" @search="handleSearch"></from-page>
    <el-table :data="tableData" style="width: 100%; margin-top: 20px; min-height: 550px;">
        <el-table-column prop="title" label="文章标题" width="220" fixed="left">
            <template #default="scope">
                <el-icon>
                    <Odometer />
                </el-icon>
                {{ scope.row.title }}
            </template>
        </el-table-column>
        <el-table-column prop="categoryId" label="文章分类" width="300">
            <template #default="scope">
                <el-icon>
                    <Odometer />
                </el-icon>
                {{ categoryMap[scope.row.categoryId] || '未分类' }}
            </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="200">
            <template #default="scope">
                {{ scope.row.status === 1 ? '已发布' : (scope.row.status === 0 ? '草稿' : '未发布') }}
            </template>
        </el-table-column>
        <el-table-column prop="authorName" label="作者" width="150" />
        <el-table-column prop="readCount" label="阅读量" width="150" />
        <el-table-column prop="publishedAt" label="发布时间" width="200" />
        <el-table-column prop="createTime" label="操作" fixed="right">
            <template #default="scope">
                <el-button type="primary" size="small" text>编辑</el-button>
                <el-button type="success" size="small" text
                    v-if="scope.row.status === 0 || scope.row.status === 2">发布</el-button>
                <el-button type="warning" size="small" text v-else>下线</el-button>
                <el-button type="danger" size="small" text>删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="demo-pagination-block">
        <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
            layout="prev, pager, next, jumper" :total="pagination.total"
            @current-change="handleCurrentChange" />
    </div>
    <article-dialog v-model:modelValue="dialogVisible" :formData="formData" :categories="categories"></article-dialog>
</div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue';
import FromPage from '@/components/FromPage.vue';
import ArticleDialog from '@/components/ArticleDialog.vue';
import { reactive, ref, onMounted } from 'vue';
import { categoryTree, articleList } from '../apis/admin';

const router = useRouter()
const categoryMap = reactive({})
const categories = ref([])

// 文章详情弹窗
const dialogVisible = ref(false)

// 表单项
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

const pagination = reactive({
    current: 1,
    size: 10,
    total: 0,
})

const tableData = ref([])
const formData = reactive({
    title: '',
    categoryId: '',
    status: ''
})


// 分页
const handleCurrentChange = (current) => {
    pagination.current = current
    handleSearch()
}

// 分页
const handleSearch = async () => {
    const params = {
        ...pagination,
        ...formData
    }

    const { records, total } = await articleList(params)
    tableData.value = records
    pagination.total = total
    console.log(pagination.total)
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

    handleSearch()
})

</script>


<style lang="scss" scoped>
.knowledge-page {
    background-color: #b1d7ff;
    min-height: 550px;
}
</style>
