<template>
<div class="emotionDiary-container">
    <div class="header-section">
        <div class="header-content">
            <h2>情绪日记</h2>
            <el-image :src="iconUrl" style="width: 30px; height: 30px;"></el-image>
        </div>
    </div>
    <div class="content">
        <div class="diary-card">
            <div class="title">今日情绪评分</div>
            <div class="section">
                <p>您今天心情怎么样</p>
                <div class="rate">
                    <el-rate v-model="diaryForm.moodScore" show-text :texts="emotionStatus" :max="10"
                        size="large"></el-rate>
                </div>
            </div>
        </div>
        <div class="diary-card">
            <div class="title">今日主要情绪</div>
            <div class="emotion-gird">
                <div v-for="emotion in emotionOption" :key="emotion.name" class="emotion-card"
                    @click="sessionEmotion(emotion.name)"
                    :class="{ 'selected': emotion.name === diaryForm.dominantEmotion }">
                    <el-image :src="emotion.url" style="width: 40px; height: 40px;"></el-image>
                    <p>{{ emotion.name }}</p>
                </div>
            </div>
        </div>
        <div class="diary-card">
            <div class="title">详细记录</div>
            <div class="detail-form">
                <div class="form-group">
                    <div class="form-label">情绪触发因素</div>
                    <el-input v-model="diaryForm.emotionTriggers" placeholder="请输入情绪触发因素" type="textarea" :rows="3"
                        show-word-limit maxlength="1000"></el-input>
                </div>

                <div class="form-group">
                    <div class="form-label">今日感想</div>
                    <el-input v-model="diaryForm.diaryContent" placeholder="请输入您的想法或趣事" type="textarea" :rows="5"
                        show-word-limit maxlength="2000"></el-input>
                </div>

                <!--  生活指标 -->
                <div class="life-indicator">
                    <div class="indicator-group">
                        <div class="form-label">睡眠质量</div>
                        <el-select v-model="diaryForm.sleepQuality" placeholder="请选择睡眠质量">
                            <el-option label="很好" value="1"></el-option>
                            <el-option label="好" value="2"></el-option>
                            <el-option label="中" value="3"></el-option>
                            <el-option label="差" value="4"></el-option>
                            <el-option label="很差" value="5"></el-option>
                        </el-select>
                    </div>
                    <div class="indicator-group">
                        <div class="form-label">睡眠压力</div>
                        <el-select v-model="diaryForm.stressLevel" placeholder="请选择睡眠压力">
                            <el-option label="很高" value="1"></el-option>
                            <el-option label="高" value="2"></el-option>
                            <el-option label="中" value="3"></el-option>
                            <el-option label="低" value="4"></el-option>
                            <el-option label="很低" value="5"></el-option>
                        </el-select>
                    </div>
                </div>

                <div class="action-buttons">
                    <el-button type="primary" @click="submitForm">提交</el-button>
                    <el-button type="info" @click="resetForm">重置</el-button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
import { dayjs } from 'element-plus';
import { reactive } from 'vue';
import { createOrUpdateEmotionDiary } from '@/apis/user/emotiondiary';
import { ElMessage } from 'element-plus';

const emotionStatus = ['绝望崩溃', '消沉抑郁', '焦虑烦躁', '低落不悦', '平静淡然', '轻松惬意', '愉悦舒心', '欢欣满足', '兴奋欣喜', '极致幸福']

const emotionOption = [
    { name: '开心', url: new URL('@/assets/images/开心.png', import.meta.url).href },
    { name: '平静', url: new URL('@/assets/images/平静.png', import.meta.url).href },
    { name: '焦虑', url: new URL('@/assets/images/焦虑.png', import.meta.url).href },
    { name: '悲伤', url: new URL('@/assets/images/悲伤.png', import.meta.url).href },
    { name: '兴奋', url: new URL('@/assets/images/兴奋.png', import.meta.url).href },
    { name: '疲惫', url: new URL('@/assets/images/疲惫.png', import.meta.url).href },
    { name: '惊讶', url: new URL('@/assets/images/惊讶.png', import.meta.url).href },
    { name: '困惑', url: new URL('@/assets/images/困惑.png', import.meta.url).href },
]

const sessionEmotion = (emotion) => {
    diaryForm.dominantEmotion = emotion
}

const diaryForm = reactive({
    diaryDate: dayjs().format('YYYY-MM-DD'),
    moodScore: null,
    dominantEmotion: '',
    emotionTriggers: '',
    diaryContent: '',
    sleepQuality: null,
    stressLevel: null,
})

const resetForm = () => {
    Object.assign(diaryForm, {
        diaryDate: dayjs().format('YYYY-MM-DD'),
        moodScore: null,
        dominantEmotion: '',
        emotionTriggers: '',
        diaryContent: '',
        sleepQuality: null,
        stressLevel: null,
    })
}

const submitForm = () => {
    if (!diaryForm.moodScore) {
        ElMessage.error('请选择您的心情')
        return
    }
    createOrUpdateEmotionDiary(diaryForm).then(() => {
        ElMessage.success('提交成功')
        resetForm()
    })
        .catch(() => {
            ElMessage.error('提交失败')
        })

}

const iconUrl = new URL('@/assets/images/like.png', import.meta.url).href
</script>

<style lang="scss" scoped>
.emotionDiary-container {
    min-height: 100%;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
}

.header-section {
    margin-bottom: 20px;
    .header-content {
        height: 100px;
        width: 100%;
        display: flex;
        align-items: center;
        border-radius: 10px;
        //渐变背景
        background: linear-gradient( 160deg, #ffe346 0%, #f8a8a8 100%);
        h2 {
            font-size: 40px;
            font-weight: 700;
            color: #303133;
            margin-left: 20px;
        }
    }
}

.content {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.diary-card {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

    .title {
        font-size: 18px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 20px;
        padding-bottom: 12px;
        border-bottom: 1px solid #ebeef5;
    }

    .section {
        p {
            font-size: 14px;
            color: #606266;
            margin-bottom: 16px;
        }

        .rate {
            display: flex;
            justify-content: flex-start;
        }
    }
}

.emotion-gird {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;

    .emotion-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px 12px;
        border-radius: 12px;
        background: #f5f7fa;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
            background: #e8f4ff;
        }

        &.selected {
            background: #e8f8e8;
            border: 2px solid #67c23a;
        }

        p {
            margin: 8px 0 0;
            font-size: 13px;
            color: #606266;
        }

        .el-image {
            :deep(img) {
                border-radius: 50%;
                background: #fff;
                padding: 8px;
            }
        }
    }
}

.detail-form {
    .form-group {
        margin-bottom: 20px;

        .form-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #606266;
            margin-bottom: 8px;
        }

        .el-input {
            :deep(textarea) {
                resize: none;
            }
        }
    }

    .life-indicator {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        margin-bottom: 24px;

        .indicator-group {
            .form-label {
                display: block;
                font-size: 14px;
                font-weight: 500;
                color: #606266;
                margin-bottom: 8px;
            }
        }
    }

    .action-buttons {
        display: flex;
        gap: 12px;
        justify-content: flex-start;

        .el-button {
            padding: 10px 24px;
            font-size: 14px;
            border-radius: 6px;
        }
    }
}
</style>