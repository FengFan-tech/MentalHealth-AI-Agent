<template>
<div class="knowledge-page">
    <page-header title="知识文章">
        <template #button>
            <el-button type="primary" @click="handleAdd">新增</el-button>
        </template>
    </page-header>
    <from-page :form-item="FromItem" @search="handleSearch"></from-page>
    <el-table :data="tableData" style="width: 100%; margin-top: 20px; min-height: 700px;"
        :row-style="{ height: '66px' }">
        <el-table-column prop="title" label="文章标题" width="300" fixed="left">
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
        <el-table-column prop="updatedAt" label="发布时间" width="200" />
        <el-table-column prop="createTime" label="操作" fixed="right">
            <template #default="scope">
                <el-button type="primary" size="small" text @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="success" size="small" text v-if="scope.row.status === 0 || scope.row.status === 2"
                    @click="handleUpdateStatus(scope.row)">发布</el-button>
                <el-button type="warning" size="small" text v-else @click="handleUpdateStatus(scope.row)">下线</el-button>
                <el-button type="danger" size="small" text @click="handleDelete(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="demo-pagination-block">
        <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.size"
            layout="prev, pager, next, jumper" :total="pagination.total"
            @current-change="handleCurrentChange(pagination.currentPage)" />
    </div>
    <article-dialog v-model:modelValue="dialogVisible" :formData="formData" :categories="categories"
        @success="handleSuccess" :editFormData="editFormData"></article-dialog>
</div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue';
import FromPage from '@/components/FromPage.vue';
import ArticleDialog from '@/components/ArticleDialog.vue';
import { reactive, ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { categoryTree, articleList, articleDetail, updateArticleStatus, deleteArticle } from '../apis/admin/knowledage';

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
    currentPage: 1,
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
    console.log('Current page changed:', current);
    pagination.currentPage = current;
    handleSearch();
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
    // console.log(pagination)
    console.log(tableData.value)
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

// 新增文章
const editFormData = ref(null)
const handleAdd = () => {
    dialogVisible.value = true
    editFormData.value = null
}

// 新增成功
const handleSuccess = () => {
    dialogVisible.value = false
    handleSearch()
}

// 编辑文章
const handleEdit = (row) => {
    if (row.id) {
        dialogVisible.value = true
        console.log(" 编辑文章 id:", row.id)
        articleDetail(row.id).then(res => {
            console.log(res)
            editFormData.value = res
        })
    }
}

// 更新文章状态
const handleUpdateStatus = (row) => {
    ElMessageBox.confirm(`确定将文章状态更新为${row.status === 1 ? '草稿' : '发布'}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        updateArticleStatus(row.id, row.status === 1 ? 2 : 1).then(res => {
            console.log(res)
            if (res.status === 1) {
                ElMessage.success('发布成功')
                handleSearch()
            } else if (res.status === 2) {
                ElMessage.success('下线成功')
                handleSearch()
            } else {
                ElMessage.error(res.msg || '状态更新失败')
            }
        })
    })
}

// 删除文章
const handleDelete = (row) => {
    ElMessageBox.confirm(`确定删除文章《${row.title}》吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteArticle(row.id).then(() => {
            ElMessage.success('删除成功')
            handleSearch()
        })
    })
}

</script>


<style lang="scss" scoped>
.knowledge-page {
    background-color: #b1d7ff;
    min-height: 550px;

}
</style>
