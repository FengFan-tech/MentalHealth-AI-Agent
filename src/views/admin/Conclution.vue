<template>
<div class="conclution-page">
    <PageHeader title="会话记录" />
    <el-table :data="sessionMessages" style="width: 100%; margin-top: 20px; min-height: 780px;" :row-style="{ height: '74px' }">
        <el-table-column label="用户头像" width="100px">
            <template #default="scope">
                <el-avatar size="medium">{{ scope.row.userNickname }}</el-avatar>
            </template>
        </el-table-column>
        <el-table-column prop="sessionTitle" label="情绪日志">
            <template #default="scope">
                <div class="emotion-session">
                    <div class="emotion-title">{{ scope.row.sessionTitle }}</div>
                    <div class="emotion-content">{{ scope.row.lastMessageContent }}</div>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="lastMessageTime" label="创建时间" width="100px" />
        <el-table-column prop="messageCount" label="消息数量" width="100px" />
        <el-table-column label="详情" width="100px">
            <template #default="scope">
                <el-button type="primary" size="small" text @click="handleDetail(scope.row)">查看详情</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="demo-pagination-block">
        <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.size"
            layout="prev, pager, next, jumper" :total="pagination.total"
            @current-change="handleCurrentChange(pagination.currentPage)" />
    </div>
    <ConclutionDialog ref="conclutionDialog" v-model:visible="dialogVisible" :sessionInfo="sessionInfo"/>
</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { getSessionMessages } from '@/apis/admin/psychological'
import ConclutionDialog from '@/components/ConclutionDialog.vue'

const sessionMessages = ref([])

// 结论弹窗
const dialogVisible = ref(false)

// 会话ID
const sessionInfo = ref({})

// 分页
const pagination = {
    total: 0,
    size: 10,
    currentPage: 1,
}

// 分页切换
const handleCurrentChange = (current) => {
    console.log('Current page changed:', current);
    pagination.currentPage = current;
    getSessionInfo()
}

// 获取会话信息
const getSessionInfo = async () => {
    getSessionMessages(pagination).then(res => {
        console.log(res)
        const { records, total } = res
        sessionMessages.value = records
        pagination.total = total
        console.log(sessionMessages.value)
    })
}

// 会话详情
const handleDetail = (row) => {
    dialogVisible.value = true
    sessionInfo.value = row
    console.log(sessionInfo.value)
}

// 获取会话消息
onMounted(() => {
    getSessionInfo()
})






</script>

<style lang="scss" scoped>
.conclution-page {
    background-color: #b1d7ff;

    .emotion-title {
        font-size: 16px;
        font-weight: bold;
        color: #333;
    }
}
</style>