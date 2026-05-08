<template>
<div class="dashboard-container">
    <PageHeader title="数据分析"></PageHeader>
    <el-row :gutter="20">

        <el-col :span="6">
            <el-card v-if="aiData.systemOverview" class="stats-card">
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
            <el-card v-if="aiData.systemOverview" class="stats-card">
                <div class="card-content">
                    <div class="avatar love">
                        <el-image style="width: 40px; height: 40px" :src="iconUrl2" />
                    </div>
                    <div class="info">
                        <p class="title">情绪日志</p>
                        <p class="number">{{ aiData.systemOverview.totalDiaries || 0 }}</p>
                        <p class="subtitle-title">今日新增：{{ aiData.systemOverview.todayNewDiaries || 0 }}</p>
                    </div>
                </div>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card v-if="aiData.systemOverview" class="stats-card">
                <div class="card-content">
                    <div class="avatar message">
                        <el-image style="width: 40px; height: 40px" :src="iconUrl3" />
                    </div>
                    <div class="info">
                        <p class="title">咨询会话</p>
                        <p class="number">{{ aiData.systemOverview.totalSessions || 0 }}</p>
                        <p class="subtitle-title">今日新增：{{ aiData.systemOverview.todayNewSessions || 0 }}</p>
                    </div>
                </div>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card v-if="aiData.systemOverview" class="stats-card">
                <div class="card-content">
                    <div class="avatar smile">
                        <el-image style="width: 40px; height: 40px" :src="iconUrl4" />
                    </div>
                    <div class="info">
                        <p class="title">平均情绪</p>
                        <p class="number">{{ aiData.systemOverview.avgMoodScore || 0 }}/10</p>
                        <p class="subtitle-title">情绪健康指数</p>
                    </div>
                </div>
            </el-card>
        </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
            <el-card style="width: 100%;">
                <template #header>
                    <div class="card-header">
                        <span>情绪趋势分析</span>
                    </div>
                </template>
                <div class="chart-content" v-if="aiData.systemOverview">
                    <div ref="emotionChartRef" style="height: 350px;"></div>
                </div>
            </el-card>
        </el-col>
        <el-col :span="12">
            <el-card style="width: 100%;">
                <template #header>
                    <div class="card-header">
                        <span>咨询会话统计</span>
                    </div>
                </template>
                <div class="consultation-content" v-if="aiData.systemOverview && aiData.consultationStats">
                    <div class="consultation-stats">
                        <div class="stat-item">
                            <p class="stat-value">{{ aiData.consultationStats?.totalSessions || 0 }}</p>
                            <p class="stat-label">总会话数</p>
                        </div>
                        <div class="stat-item">
                            <p class="stat-value">{{ aiData.consultationStats?.avgDurationMinutes || '0' }}分钟</p>
                            <p class="stat-label">平均时长</p>
                        </div>
                        <div class="stat-item">
                            <p class="stat-value">{{ aiData.systemOverview?.activeUsers || 0 }}</p>
                            <p class="stat-label">活跃用户</p>
                        </div>
                    </div>
                    <div class="chart-section">
                        <h4 class="chart-title">咨询活动统计</h4>
                        <div ref="consultationChartRef" style="height: 200px;"></div>
                    </div>
                </div>
            </el-card>
        </el-col>
        <el-col>
            <el-card style="width: 100%; margin-top: 20px;" >
                <template #header>
                    <div class="card-header" >
                        <span>用户活跃度分析</span>
                    </div>
                </template>
                <div class="chart-content" v-if="aiData.systemOverview">
                    <div ref="userActiveChartRef" style="height: 350px;"></div>
                </div>
            </el-card>
        </el-col>
    </el-row>
</div>
</template>
<script setup>
import PageHeader from '@/components/PageHeader.vue';
import { getDashbroadData } from '@/apis/admin/dashbroad';
import { onMounted, ref, nextTick } from 'vue';
import * as echarts from 'echarts';

const aiData = ref({})
const emotionChartRef = ref(null)
const consultationChartRef = ref(null)
const userActiveChartRef = ref(null)
let emotionChart = null
let consultationChart = null
let userActiveChart = null

const iconUrl1 = new URL('@/assets/images/users.png', import.meta.url).href;
const iconUrl2 = new URL('@/assets/images/comments.png', import.meta.url).href;
const iconUrl3 = new URL('@/assets/images/smile.png', import.meta.url).href;
const iconUrl4 = new URL('@/assets/images/like.png', import.meta.url).href;

// 初始化图表
const initChart = () => {
    initEmotionChart()
    initConsultationChart()
    initUserActiveChart()
}

// 初始化情绪趋势图表
const initEmotionChart = () => {
    if (!emotionChartRef.value) return
    if (emotionChart) emotionChart.dispose()

    emotionChart = echarts.init(emotionChartRef.value)

    const trendData = aiData.value.emotionTrend || []
    const dates = trendData.map(item => item.date)
    const avgScores = trendData.map(item => item.avgMoodScore)
    const recordCounts = trendData.map(item => item.recordCount)

    const option = {
        title: {
            text: '情绪趋势分析',
            left: 'center',
            top: 10,
            textStyle: { fontSize: 16, fontWeight: 'bold', color: '#333' }
        },
        tooltip: {
            trigger: 'axis',
            borderColor: '#ddd',
            borderWidth: 1,
            textStyle: { fontSize: 12, color: '#333' }
        },
        legend: {
            data: ['平均情绪评分', '记录数量'],
            top: 40,
            textStyle: { fontSize: 12 }
        },
        grid: { left: '3%', right: '4%', bottom: '10%', top: 80 },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dates,
            axisLine: { lineStyle: { color: '#ddd' } },
            axisLabel: { fontSize: 11, color: '#666' }
        },
        yAxis: [{
            type: 'value',
            name: '情绪评分',
            position: 'left',
            min: 0,
            max: 10,
            axisLine: { show: false },
            splitLine: { lineStyle: { color: '#f0f0f0' } },
            axisLabel: { fontSize: 11, color: '#666' }
        }, {
            type: 'value',
            name: '记录数量',
            position: 'right',
            axisLine: { show: false },
            splitLine: { show: false },
            axisLabel: { fontSize: 11, color: '#666' }
        }],
        series: [
            {
                name: '平均情绪评分',
                type: 'line',
                data: avgScores,
                smooth: true,
                lineStyle: { width: 2, color: '#FFD700' },
                itemStyle: { color: '#FFD700' },
                symbol: 'circle',
                symbolSize: 6
            },
            {
                name: '记录数量',
                type: 'line',
                yAxisIndex: 1,
                data: recordCounts,
                smooth: true,
                lineStyle: { width: 2, color: '#FFA500' },
                itemStyle: { color: '#FFA500' },
                symbol: 'circle',
                symbolSize: 6
            }
        ]
    }
    emotionChart.setOption(option)
}

// 初始化咨询活动统计图表
const initConsultationChart = () => {
    if (!consultationChartRef.value) return
    if (consultationChart) consultationChart.dispose()

    consultationChart = echarts.init(consultationChartRef.value)

    const dailyTrend = aiData.value.consultationStats?.dailyTrend || []

    const option = {
        title: {
            text: '咨询活动统计',
            textStyle: {
                fontSize: 16,
                fontWeight: 600,
                color: '#2d3436'
            },
            left: 'center',
            top: 10
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#fab1a0',
            borderWidth: 1,
            textStyle: {
                color: '#2d3436'
            }
        },
        legend: {
            data: ['会话数量', '参与用户数'],
            top: 40,
            textStyle: {
                color: '#636e72'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: 80,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: dailyTrend.map(item => item.date),
            axisLine: {
                lineStyle: {
                    color: 'rgba(244, 162, 97, 0.3)'
                }
            },
            axisLabel: {
                color: '#636e72'
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#636e72'
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(244, 162, 97, 0.3)'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(244, 162, 97, 0.1)'
                }
            }
        },
        series: [
            {
                name: '会话数量',
                type: 'bar',
                data: dailyTrend.map(item => item.sessionCount),
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: '#74b9ff' },
                            { offset: 1, color: '#0984e3' }
                        ]
                    }
                },
                barWidth: '40%'
            },
            {
                name: '参与用户数',
                type: 'bar',
                data: dailyTrend.map(item => item.userCount),
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: '#fdcb6e' },
                            { offset: 1, color: '#f39c12' }
                        ]
                    }
                },
                barWidth: '40%'
            }
        ]
    }
    consultationChart.setOption(option)
}

// 初始化用户活跃度图表
const initUserActiveChart = () => {
    if (!userActiveChartRef.value) return
    if (userActiveChart) userActiveChart.dispose()

    userActiveChart = echarts.init(userActiveChartRef.value)
    const activityData = aiData.value.userActivity || []
    const option = {
        title: {
            text: '用户活跃度趋势',
            textStyle: {
                fontSize: 16,
                fontWeight: 600,
                color: '#2d3436'
            },
            left: 'center',
            top: 10
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#fab1a0',
            borderWidth: 1,
            textStyle: {
                color: '#2d3436'
            }
        },
        legend: {
            data: ['活跃用户', '新增用户', '日记用户', '咨询用户'],
            top: 40,
            textStyle: {
                color: '#636e72'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: 80,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: activityData.map(item => item.date),
            axisLine: {
                lineStyle: {
                    color: 'rgba(244, 162, 97, 0.3)'
                }
            },
            axisLabel: {
                color: '#636e72'
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#636e72'
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(244, 162, 97, 0.3)'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(244, 162, 97, 0.1)'
                }
            }
        },
        series: [
            {
                name: '活跃用户',
                type: 'line',
                data: activityData.map(item => item.activeUsers),
                smooth: true,
                lineStyle: {
                    width: 3,
                    color: '#a29bfe'
                },
                itemStyle: {
                    color: '#a29bfe'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(162, 155, 254, 0.4)' },
                            { offset: 1, color: 'rgba(162, 155, 254, 0.1)' }
                        ]
                    }
                }
            },
            {
                name: '新增用户',
                type: 'line',
                data: activityData.map(item => item.newUsers),
                smooth: true,
                lineStyle: {
                    width: 3,
                    color: '#fdcb6e'
                },
                itemStyle: {
                    color: '#fdcb6e'
                }
            },
            {
                name: '日记用户',
                type: 'line',
                data: activityData.map(item => item.diaryUsers),
                smooth: true,
                lineStyle: {
                    width: 3,
                    color: '#00b894'
                },
                itemStyle: {
                    color: '#00b894'
                }
            },
            {
                name: '咨询用户',
                type: 'line',
                data: activityData.map(item => item.consultationUsers),
                smooth: true,
                lineStyle: {
                    width: 3,
                    color: '#fab1a0'
                },
                itemStyle: {
                    color: '#fab1a0'
                }
            }
        ]
    }
    userActiveChart.setOption(option)
}

    onMounted(async () => {
        const data = await getDashbroadData()
        aiData.value = data
        console.log(aiData.value)
        await nextTick()
        initChart()
    })
</script>

<style lang="scss" scoped>
.dashboard-container {
    .stats-card {
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        height: 100%;
        min-height: 100px;
    }

    .card-content {
        display: flex;
        align-items: center;

        .avatar {
            margin-right: 12px;
            width: 50px;
            height: 50px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;

            &.users {
                background: linear-gradient(135deg, #9c88ff 0%, #6c5ce7 100%);
            }

            &.love {
                background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%);
            }

            &.message {
                background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
            }

            &.smile {
                background: linear-gradient(135deg, #55efc4 0%, #00b894 100%);
            }
        }

        .info {
            .title {
                font-size: 13px;
                color: #666;
                margin-bottom: 2px;
            }

            .number {
                font-size: 24px;
                font-weight: 600;
                color: #333;
                margin-bottom: 2px;
            }

            .subtitle-title {
                font-size: 11px;
                color: #999;
            }
        }
    }

    .card-header {
        font-size: 14px;
        font-weight: 600;
        color: #333;
    }

    .chart-content {
        padding: 10px 0;
    }

    .consultation-content {
        padding: 10px;
    }

    .consultation-stats {
        display: flex;
        justify-content: space-around;
        padding: 24px 0;
        border-bottom: 1px solid #f0f0f0;
        margin-bottom: 15px;

        .stat-item {
            text-align: center;

            .stat-value {
                font-size: 24px;
                font-weight: 600;
                color: #333;
                margin-bottom: 4px;
            }

            .stat-label {
                font-size: 12px;
                color: #999;
            }
        }
    }

    .chart-section {
        .chart-title {
            font-size: 13px;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
            text-align: center;
        }
    }
}
</style>