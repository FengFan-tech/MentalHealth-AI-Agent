<template>
<div class="dashboard-container">
    <PageHeader title="数据分析"></PageHeader>
    <el-row :gutter="20">

        <el-col :span="6">
            <el-card v-if="aiData.systemOverview">
                <div class="card-content">
                    <div class="avatar users">
                        <el-image style="width: 40px; height: 40px" :src="iconUrl1" />
                    </div>
                    <div class="info">
                        <p class="title">总用户数</p>
                        <p class="number">{{ aiData.systemOverview.totalUsers }}</p>
                        <p class="subtitle-title">活跃用户：{{ aiData.systemOverview.activeUsers }}</p>
                    </div>
                </div>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card v-if="aiData.systemOverview">
                <div class="card-content">
                    <div class="avatar users">
                        <el-image style="width: 40px; height: 40px" :src="iconUrl2" />
                    </div>
                    <div class="info">
                        <p class="title">情绪日志</p>
                        <p class="number">{{ aiData.systemOverview.totalDiaries }}</p>
                        <p class="subtitle-title">活跃用户：{{ aiData.systemOverview.activeUsers }}</p>
                    </div>
                </div>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card v-if="aiData.systemOverview">
                <div class="card-content">
                    <div class="avatar users">
                        <el-image style="width: 40px; height: 40px" :src="iconUrl3" />
                    </div>
                    <div class="info">
                        <p class="title">咨询会话</p>
                        <p class="number">{{ aiData.systemOverview.totalDiaries }}</p>
                        <p class="subtitle-title">今日新增：{{ aiData.systemOverview.activeUsers }}</p>
                    </div>
                </div>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card v-if="aiData.systemOverview">
                <div class="card-content">
                    <div class="avatar users">
                        <el-image style="width: 40px; height: 40px" :src="iconUrl4" />
                    </div>
                    <div class="info">
                        <p class="title">平均情绪</p>
                        <p class="number">{{ aiData.systemOverview.totalUsers }}</p>
                        <p class="subtitle-title">情绪健康指数</p>
                    </div>
                </div>
            </el-card>
        </el-col>
    </el-row>
</div>
</template>
<script setup>
import PageHeader from '@/components/PageHeader.vue';
import { getDashbroadData } from '@/apis/admin/dashbroad';
import { onMounted, ref } from 'vue';

const aiData = ref({})

const iconUrl1 = new URL('@/assets/images/users.png', import.meta.url).href;
const iconUrl2 = new URL('@/assets/images/comments.png', import.meta.url).href;
const iconUrl3 = new URL('@/assets/images/smile.png', import.meta.url).href;
const iconUrl4 = new URL('@/assets/images/like.png', import.meta.url).href;

onMounted(async () => {
    const data = await getDashbroadData();
    console.log(data)
    aiData.value = data;
})
</script>

<style lang="scss" scoped>
.dashboard-container {
    .card-content {
      display: flex;
      align-items: center;
      .avatar {
        margin-right: 12px;
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        &.users {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        &.like {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        &.comments {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        &.smile {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
      }
      .info {
        .title {
          font-size: 14px;
          color: #7f8c8d;
          margin-bottom: 4px;
        }
        .value {
          font-size: 24px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 4px
        }
        .subtitle-title {
          font-size: 12px;
          color: #95a5a6;
        }
      }
    }
    .chart-content {
      padding: 20px;
      height: 300px;
      position: relative;

      canvas {
        width: 100% !important;
        height: 100% !important;
      }

      .consultation-stats {
        display: flex;
        justify-content: space-around;
        margin-bottom: 20px;

        .stat-item {
          text-align: center;

          .stat-label {
            font-size: 12px;
            color: #7f8c8d;
            margin-bottom: 4px;
          }

          .stat-value {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
          }
        }
      }
    }
  }
</style>