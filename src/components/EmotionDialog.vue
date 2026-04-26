<template>
<div class="emotion-dialog">
    <el-dialog title="情感分析详情" v-model="dialogVisible" width="50%" top="0vh">
        <div v-if="currentDetail" class="dialog-content">
            <!-- 用户信息 -->
            <el-descriptions :column="2" class="info-section">
                <el-descriptions-item label="昵称">{{ currentDetail.nickname || '-' }}</el-descriptions-item>
                <el-descriptions-item label="用户名">{{ currentDetail.username || '-' }}</el-descriptions-item>
                <el-descriptions-item label="用户ID">{{ currentDetail.userId }}</el-descriptions-item>
                <el-descriptions-item label="记录日期">{{ currentDetail.diaryDate || currentDetail.createdAt }}</el-descriptions-item>
            </el-descriptions>
            
            <!-- 情绪状态 -->
            <div class="section">
                <h4 class="section-title">情绪状态</h4>
                <el-descriptions :column="2" class="section-content">
                    <el-descriptions-item label="情绪评分">
                        <el-rate :model-value="currentDetail.moodScore" :max="10" disabled></el-rate>
                    </el-descriptions-item>
                    <el-descriptions-item label="主要情绪">
                        <el-tag :type="getEmotionTagType(currentDetail.dominantEmotion)">{{ currentDetail.dominantEmotion || '平静' }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="睡眠质量">{{ currentDetail.sleepQuality || '3/5' }}</el-descriptions-item>
                    <el-descriptions-item label="压力水平">{{ currentDetail.stressLevel || '1/5' }}</el-descriptions-item>
                </el-descriptions>
            </div>
            
            <!-- 日记内容 -->
            <div class="section">
                <h4 class="section-title">日记内容</h4>
                <el-descriptions :column="2" class="section-content">
                    <el-descriptions-item label="情绪触发因素">{{ currentDetail.emotionTriggers || '无事发生' }}</el-descriptions-item>
                    <el-descriptions-item label="日记内容">{{ currentDetail.diaryContent || '风平浪静' }}</el-descriptions-item>
                </el-descriptions>
            </div>
            
            <!-- AI情绪分析结果 -->
            <div class="section">
                <h4 class="section-title">AI情绪分析结果</h4>
                <el-descriptions :column="2" class="section-content">
                    <el-descriptions-item label="主要情绪">
                        <el-tag :type="getAiEmotionTagType(aiData.primaryEmotion)">{{ aiData.primaryEmotion || '中性' }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="风险等级">{{ currentDetail.stressLevel || '0' }}</el-descriptions-item>
                    <el-descriptions-item label="情绪强度">
                        <div class="progress-container">
                            <el-progress :percentage="aiData.emotionScore || 0" 
                                        :color="getEmotionScoreColor(aiData.emotionScore || 0)"
                                        :stroke-width="8" />
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item label="情绪性质">
                        <el-tag :type="aiData.isNegative ? 'danger' : 'success'"> {{ aiData.isNegative ? '负面' : '正面' }}情绪</el-tag>
                    </el-descriptions-item>
                </el-descriptions>
            </div>
            
            <!-- 专业建议 -->
            <div class="section">
                <h4 class="section-title">专业建议</h4>
                <div class="content-box">{{ aiData.suggestion || '情绪状态平稳，慢慢来就好' }}</div>
            </div>
            
            <!-- 风险描述 -->
            <div class="section">
                <h4 class="section-title">风险描述</h4>
                <div class="content-box">{{ aiData.riskDescription || '当前情绪状态稳定，无需特别关注' }}</div>
            </div>
            
            <!-- 改善建议 -->
            <div class="section">
                <h4 class="section-title">改善建议</h4>
                <div class="content-box">
                    <div v-for="(item, index) in (aiData.improvementSuggestions || ['保持规律作息', '适当运动', '与朋友交流'])" :key="index" class="improvement-item">
                        {{ item }}
                    </div>
                </div>
            </div>
            
            <!-- 时间信息 -->
            <div class="section">
                <h4 class="section-title">时间信息</h4>
                <el-descriptions :column="1" class="section-content">
                    <el-descriptions-item label="记录时间">{{ currentDetail.createdAt }}</el-descriptions-item>
                    <el-descriptions-item label="更新时间">{{ currentDetail.updatedAt || currentDetail.createdAt }}</el-descriptions-item>
                </el-descriptions>
            </div>
        </div>
        <template #footer>
            <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
        </template>
    </el-dialog>
</div>
</template>

<script setup>
import { defineProps } from 'vue';
import { computed, onMounted, watch, ref } from 'vue';
import { defineEmits } from 'vue';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    rowData: {
        type: Object,
        default: () => { }
    }
})

const emit = defineEmits(['update:visible']);
// 获取父组件传过来的rowData
const currentDetail = computed(() => { return props.rowData })

const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
})

// 转换AI数据格式
const aiData = ref({
    emotionScore: 0,
    primaryEmotion: '',
    isNegative: false,
    suggestion: '',
    riskDescription: '',
    improvementSuggestions: []
})
watch(() => currentDetail.value.aiEmotionAnalysis, (val) => {
    if (val) {
        aiData.value = JSON.parse(val)
        console.log(aiData.value)
    }
}, { immediate: true })


// 情绪相关映射
const getEmotionTagType = (emotion) => {
    const emotionTypes = {
        '快乐': 'success',
        '平静': 'info',
        '兴奋': 'warning',
        '愤怒': 'danger',
        '悲伤': 'info',
        '焦虑': 'warning'
    }
    return emotionTypes[emotion] || 'info'
}
const getAiEmotionTagType = (emotion) => {
    const emotionTagMap = {
        '快乐': 'success',
        '平静': 'success',
        '兴奋': 'warning',
        '满足': 'success',
        '愤怒': 'danger',
        '悲伤': 'info',
        '焦虑': 'warning',
        '恐惧': 'danger',
        '沮丧': 'info',
        '压力': 'warning'
    }
    return emotionTagMap[emotion] || 'info'
}

const getEmotionScoreColor = (score) => {
    if (score >= 80) return '#f56c6c'
    if (score >= 60) return '#e6a23c'
    if (score >= 40) return '#909399'
    return '#67c23a'
}
const getRiskLevelTagType = (riskLevel) => {
    const riskTagMap = {
        0: 'success',
        1: 'info',
        2: 'warning',
        3: 'danger'
    }
    return riskTagMap[riskLevel] || 'info'
}
const getRiskLevelText = (riskLevel) => {
    const riskTextMap = {
        0: '正常',
        1: '关注',
        2: '预警',
        3: '危机'
    }
    return riskTextMap[riskLevel] || '未知风险等级'
}


</script>

<style  lang="scss" scoped>
.emotion-dialog {
  .dialog-content {
    padding: 0 10px;
  }
  
  .info-section {
    background-color: #f0f9ff;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 24px;
  }
  
  .section {
    margin-bottom: 24px;
    
    .section-title {
      margin: 0 0 12px 0;
      color: #303133;
      font-size: 16px;
      font-weight: 600;
    }
    
    .section-content {
      background-color: #f8f9fa;
      padding: 16px;
      border-radius: 8px;
    }
  }
  
  .progress-container {
    position: relative;
    width: 100%;
    
    .progress-percent {
      position: absolute;
      right: 0;
      top: -20px;
      font-size: 14px;
      color: #606266;
    }
  }
  
  .content-box {
    line-height: 1.6;
    color: #606266;
    background-color: white;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ebeef5;
  }
  
  .improvement-item {
    margin-bottom: 8px;
    color: #606266;
    line-height: 1.5;
  }
  
  .el-description {
    width: 100%;
    
    .el-description__item {
      margin-bottom: 12px;
      
      &:nth-child(2n) {
        margin-right: 0;
      }
    }
    
    .el-description__label {
      font-weight: 500;
      color: #606266;
    }
    
    .el-description__content {
      color: #303133;
    }
  }
  
  .el-progress {
    width: 100%;
    
    .el-progress__text {
      font-size: 12px;
      color: #909399;
    }
  }
  
  .el-tag {
    margin-right: 8px;
  }
}
</style>
