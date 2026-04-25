<template>
  <div class="conclution-dialog">
    <el-dialog
      title="咨询会话详情"
      v-model="dialogVisible"
      width="70%"
    >
    <div class="session-info">
        <div class="info-item">
            <span class="info-label">用户：</span>
            <span class="info-value">{{ sessionInfo.userNickname }}</span>
        </div>
        <div class="info-item">
            <span class="info-label">开始时间：</span>
            <span class="info-value">{{ sessionInfo.lastMessageTime }}</span>
        </div>
        <div class="info-item">
            <span class="info-label">消息数：</span>
            <span class="info-value">{{ sessionInfo.messageCount }}条</span>
        </div>
    </div>
    <div class="session-container">
        <div class="session-container-title">对话记录</div>
        <div class="session-container-content">
            <div v-for="item in sessionDetail" :key="item.sessionId" 
                 :class="['message-item', item.senderType === 1 ? 'user-message' : 'ai-message']">
                <div class="message-header">
                    <span class="message-role">{{ item.senderType === 1 ? '用户' : 'AI助手' }}</span>
                    <span class="message-time">{{ item.createdAt }}</span>
                </div>
                <div class="message-content">{{ item.content }}</div>
            </div>
        </div>
    </div>
      <template #footer>
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { defineProps, defineEmits } from 'vue'
import { getSessionDetail } from '@/apis/admin/psychological'
import { computed } from 'vue'

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    sessionInfo: {
        type: Object,
        default: {}
    }
})

const sessionId = computed(() => props.sessionInfo.id)
const sessionInfo = computed(() => props.sessionInfo)

const emit = defineEmits(['update:visible'])

const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
})

// 会话详情
const sessionDetail = ref({})

// 获取会话详情
watch(() => props.visible, (val) => {
    if (val) {
        getSessionDetail(sessionId.value).then(res => {
            sessionDetail.value = res
            console.log(sessionDetail.value)
        })
    }
})
</script>

<style lang="scss" scoped>
.conclution-dialog {
    width: 100%;
    
    .session-info {
        background-color: #f5f7fa;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 24px;
        
        .info-item {
            margin-bottom: 8px;
            
            .info-label {
                font-weight: 500;
                margin-right: 8px;
            }
            
            .info-value {
                color: #333;
            }
        }
    }
    
    .session-container {
        .session-container-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 16px;
            color: #333;
        }
        
        .session-container-content {
            max-height: 500px;
            overflow-y: auto;
            
            .message-item {
                margin-bottom: 16px;
                padding: 12px 16px;
                border-radius: 8px;
                
                &.user-message {
                    background-color: #e6f7ff;
                    border-left: 4px solid #1890ff;
                }
                
                &.ai-message {
                    background-color: #f0f9ff;
                    border-left: 4px solid #69c0ff;
                }
                
                .message-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                    
                    .message-role {
                        font-weight: 500;
                        font-size: 14px;
                    }
                    
                    .message-time {
                        font-size: 12px;
                        color: #999;
                    }
                }
                
                .message-content {
                    font-size: 14px;
                    line-height: 1.5;
                    color: #333;
                    white-space: pre-wrap;
                }
            }
        }
    }
}

</style>
