<template>
    <div class="emotion-page">
        <PageHeader title="情感分析" />
        <from-page :form-item="FromItem" @search="handleSearch"></from-page>
        <div class="emontion-list">
            <el-table :data="tableData" style="width: 100%; margin-top: 20px; min-height: 700px;"
                :row-style="{ height: '66px' }">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="userId" label="会话ID"></el-table-column>
                <el-table-column prop="createdAt" label="记录日期"></el-table-column>
                <el-table-column prop="moodScore" label="情绪评分"></el-table-column>
                <el-table-column prop="dominantEmotion" label="生活指标"></el-table-column>
                <el-table-column prop="emotionTriggers" label="情绪触发因素"></el-table-column>
                <el-table-column prop="diaryContent" label="日志内容" ></el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="primary" size="small" text @click="handleDetail(scope.row)">详情</el-button>
                        <el-button type="danger" size="small" text @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="demo-pagination-block">
        <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.size"
            layout="prev, pager, next, jumper" :total="pagination.total"
            @current-change="handleCurrentChange(pagination.currentPage)" />
        <emotion-dialog ref="emotionDialog" v-model:visible="dialogVisible" :row-data="rowData"></emotion-dialog>
    </div>
    </div>
</template>

<script setup>
import  PageHeader  from '@/components/PageHeader.vue';
import FromPage from '@/components/FromPage.vue';
import EmotionDialog from '@/components/EmotionDialog.vue';
import { getEmotionLogs } from '@/apis/admin/emotion';
import { ref, reactive, onMounted } from 'vue';

// 情感分析详情弹窗
const dialogVisible = ref(false);
const rowData = ref({});

// 页面数据
const tableData = ref([]);
const FromItem = [
    {
        label: '文本内容',
        prop: 'userId',
        comp: 'input',
        placeholder: '请输入文本内容'
    },
    {
        label: '情感分析',
        prop: 'moodScreRange',
        comp: 'select',
        placeholder: '请选择情感分析',
        options: [
            {
                label: '低分(1-3)',
                value: '1-3',
            },
            {
                label: '中分(4-6)',
                value: '4-6',
            },
            {
                label: '高分(7-10)',
                value: '7-10',
            }
        ]
    }
]

// 获取数据 
const pagination = reactive({
    current: 1,
    size: 10,
    total: 0
})
const handleSearch = async (searchData) => {
    const params = {
        ...pagination,
        ...searchData
    }

    const { records, total } = await getEmotionLogs(params)
    tableData.value = records
    pagination.total = total
    // console.log(pagination)
    console.log(tableData.value)
}

// 获取详情
const handleDetail = (row) => {
    console.log(row)
    dialogVisible.value = true
}

// 删除
const handleDelete = (row) => {
    console.log(row)
}

onMounted(() => {
    handleSearch()
})

</script>
