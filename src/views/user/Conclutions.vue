<template>
  <div class="consultation-container">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <!-- AI助手信息卡片 -->
      <div class="ai-assistant-card">
        <div class="assistant-avatar-wrap">
          <div class="assistant-avatar">
            <el-image :src="iconUrl1" style="width: 28px; height: 28px" alt="AI助手" />
          </div>
          <div class="avatar-ring"></div>
        </div>
        <h3 class="assistant-name">AI助手</h3>
        <div class="online-status">
          <span class="status-pulse"></span>
          <span class="status-text">在线服务中</span>
        </div>
      </div>

      <!-- 情绪花园 -->
      <div class="emotion-garden">
        <div class="garden-header">
          <span class="garden-icon">🌿</span>
          <span class="garden-title">情绪花园</span>
        </div>

        <div class="emotion-gauge">
          <div class="gauge-circle" :style="gaugeStyle">
            <div class="gauge-inner">
              <span class="gauge-label">{{ currentEmotion.primaryEmotion === 'happy' ? '中性' : currentEmotion.primaryEmotion }}</span>
              <span class="gauge-score">{{ currentEmotion.emotionScore }}</span>
            </div>
          </div>
        </div>

        <div class="emotion-status">
          <div class="status-row">
            <span class="status-label">今天感觉</span>
            <span class="status-badge" :class="{ 'negative': currentEmotion.isNegative }">
              {{ currentEmotion.isNegative ? '需要关注' : '很不错' }}
            </span>
          </div>

          <div class="intensity-bar">
            <div class="intensity-track">
              <div
                class="intensity-fill"
                :style="{ width: `${(currentEmotion.emotionScore / 100) * 100}%` }"
              ></div>
            </div>
            <span class="intensity-text">{{ getRiskText(currentEmotion.risklevel) }}</span>
          </div>
        </div>

        <!-- 建议卡片 -->
        <div class="suggestion-card" v-if="currentEmotion.suggestion">
          <div class="suggestion-icon">💝</div>
          <div class="suggestion-body">
            <div class="suggestion-title">给你一个小建议</div>
            <div class="suggestion-text">{{ currentEmotion.suggestion }}</div>
          </div>
        </div>

        <!-- 治愈行动 -->
        <div class="healing-section" v-if="currentEmotion.improvementSuggestions.length > 0">
          <div class="section-label">治愈小行动</div>
          <div class="healing-list">
            <div v-for="action in currentEmotion.improvementSuggestions" :key="action" class="healing-item">
              <span class="healing-icon">✨</span>
              <span class="healing-text">{{ action }}</span>
            </div>
          </div>
        </div>

        <!-- 风险提示 -->
        <div class="risk-alert" v-if="currentEmotion.isNegative && currentEmotion.riskLevel > 1">
          <div class="risk-icon">⚠️</div>
          <div class="risk-body">
            <div class="risk-title">温馨提示</div>
            <div class="risk-text">{{ currentEmotion.riskDescription }}</div>
          </div>
        </div>
      </div>

      <!-- 会话列表 -->
      <div class="session-panel">
        <div class="panel-header">
          <span class="panel-icon">💬</span>
          <span class="panel-title">会话列表</span>
        </div>
        <div class="session-list">
          <div
            v-for="session in sessionList"
            :key="session.id"
            @click="handleSessionClick(session)"
            class="session-item"
            :class="{ active: currentSession?.sessionId === 'session_' + session.id }"
          >
            <div class="session-main">
              <div class="session-title-row">
                <span class="session-name">{{ session.sessionTitle }}</span>
                <span class="session-time">{{ session.startedAt }}</span>
              </div>
              <div class="session-preview" v-if="session.lastMessageContent">
                {{ session.lastMessageContent }}
              </div>
              <div class="session-meta">
                <span class="meta-tag">
                  <el-icon><ChatRound /></el-icon>
                  {{ session.messageCount || 0 }}
                </span>
                <span class="meta-tag">
                  <el-icon><Clock /></el-icon>
                  {{ session.durationMinutes || 0 }}分钟
                </span>
              </div>
            </div>
            <el-button
              text
              type="danger"
              size="small"
              class="delete-btn"
              @click.stop="handleDeleteSession(session.id)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </aside>

    <!-- 主聊天区 -->
    <main class="chat-main">
      <!-- 聊天头部 -->
      <header class="chat-header">
        <div class="header-left">
          <div class="header-avatar">
            <el-image :src="iconUrl2" style="width: 40px; height: 40px" alt="AI助手" />
          </div>
          <div class="header-info">
            <h2>AI助手</h2>
            <p>您的贴心AI助手</p>
          </div>
        </div>
        <button class="new-session-btn" @click="createNewFrontendSession" title="新建会话">
          <el-icon><Plus /></el-icon>
          <span>新会话</span>
        </button>
      </header>

      <!-- 消息区域 -->
      <div class="chat-messages" ref="chatMessagesRef">
        <!-- 欢迎消息 -->
        <div class="message-item ai-message" v-if="message.length === 0">
          <div class="message-avatar">
            <el-image :src="iconUrl2" style="width: 20px; height: 20px" />
          </div>
          <div class="message-body">
            <div class="message-bubble">
              <p>您好！我是小暖，您的AI心理健康助手。很高兴陪伴您，为您提供温暖的心理支持。请告诉我，今天您感觉怎么样？有什么想要分享的吗？</p>
            </div>
            <span class="message-time">刚刚</span>
          </div>
        </div>

        <!-- 消息列表 -->
        <div
          v-for="msg in message"
          :key="msg.id"
          class="message-item"
          :class="msg.senderType === 1 ? 'user-message' : 'ai-message'"
        >
          <div class="message-avatar">
            <el-image
              v-if="msg.senderType === 1"
              style="width: 20px; height: 20px"
              :src="iconUrl3"
            ></el-image>
            <el-image
              v-if="msg.senderType === 2"
              style="width: 20px; height: 20px"
              :src="iconUrl2"
            ></el-image>
          </div>
          <div class="message-body">
            <div class="message-bubble">
              <!-- AI思考中 -->
              <div v-if="msg.senderType === 2 && isAiTyping && !msg.content" class="typing-indicator">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
              </div>

              <!-- 错误消息 -->
              <div v-else-if="msg.isError" class="error-bubble">
                <p>{{ msg.content }}</p>
              </div>

              <!-- AI正常消息 -->
              <MarkdownRenderer
                v-else-if="msg.senderType === 2 && !msg.isError"
                :content="msg.content"
                :is-ai-message="true"
              />
              <p v-else-if="msg.content" v-html="formatMessageContent(msg.content)"></p>
            </div>
            <span class="message-time">
              {{ msg.senderType === 2 && isAiTyping ? '正在输入中...' : msg.createdAt }}
            </span>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="chat-input">
        <div class="input-wrapper">
          <textarea
            v-model="userMessage"
            placeholder="请输入您想要分享的内容..."
            :disabled="isAiTyping"
            @keydown="handleKeyDown"
            class="chat-textarea"
            rows="2"
            maxlength="500"
          ></textarea>
          <div class="input-footer">
            <span class="hint">按 Enter 发送，Shift + Enter 换行</span>
            <span class="char-count" :class="{ 'near-limit': userMessage.length > 450 }">
              {{ userMessage.length }} / 500
            </span>
          </div>
        </div>
        <button
          class="send-btn"
          :disabled="!userMessage.trim() || userMessage.length > 500 || isAiTyping"
          @click="sendMessage"
        >
          <el-icon><Promotion /></el-icon>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, nextTick, computed } from 'vue';
import { Plus, ChatRound, Clock, Delete, Promotion } from '@element-plus/icons-vue';
import { getNewConclution, getConclutionList, deleteConclution } from '@/apis/user/conclution';
import { ElMessage } from 'element-plus';
import MarkdownRenderer from '../../components/MarkdownRenderer.vue';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { getConclutionDetail, getEmotionAnalysis } from '@/apis/user/conclution';

const iconUrl1 = new URL('@/assets/images/robot-fill.png', import.meta.url).href;
const iconUrl2 = new URL('@/assets/images/like.png', import.meta.url).href;
const iconUrl3 = new URL('@/assets/images/users.png', import.meta.url).href;

const message = ref([]);
const chatMessagesRef = ref(null);
const isAiTyping = ref(false);

// 情绪仪表盘样式
const gaugeStyle = computed(() => {
  const score = currentEmotion.value.emotionScore;
  const hue = 200 + (score / 100) * 40; // 蓝色到青色范围
  return {
    background: `conic-gradient(
      hsl(${hue}, 80%, 60%) ${score * 3.6}deg,
      rgba(255, 255, 255, 0.15) ${score * 3.6}deg
    )`,
  };
});

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (chatMessagesRef.value) {
      chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight;
    }
  });
};

watch(message, () => {
  scrollToBottom();
}, { deep: true });

watch(isAiTyping, (newVal) => {
  if (!newVal) {
    nextTick(() => {});
  }
});

const userMessage = ref('');
watch(userMessage, (newVal, oldVal) => {
  if (newVal.length > 500) {
    userMessage.value = oldVal;
    ElMessage.warning('消息长度不能超过500字');
  }
});

const currentSession = ref(null);
const sessionList = ref([]);

// 情绪花园
const currentEmotion = ref({
  primaryEmotion: 'happy',
  emotionScore: 50,
  isNegative: false,
  risklevel: 0,
  suggestionL: '保持正常的心理健康',
  riskDescription: '您的情绪状态正常，无需关注。',
  improvementSuggestions: [],
});

const getIntensityClass = (score) => {
  if (score >= 61) return 3;
  if (score >= 31) return 2;
  return 1;
};

const getRiskText = (level) => {
  switch (level) {
    case 0: return '正常';
    case 1: return '关注';
    case 2: return '预警';
    default: return '未知';
  }
};

const getEmotionAnalysisData = (sessionId) => {
  const id = sessionId.toString().startsWith('session_') ? sessionId : `session_${sessionId}`;
  getEmotionAnalysis(id).then((res) => {
    currentEmotion.value = res.data;
  });
};

const createNewFrontendSession = () => {
  const newConclution = {
    sessionId: `temp_${Date.now()}`,
    status: 'TEMP',
    sessionTitle: '新会话',
  };
  currentSession.value = newConclution;
  message.value = [];
  getConclutionListData();
};

const handleKeyDown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    sendMessage();
  }
};

const sendMessage = () => {
  if (userMessage.value.trim() === '') return;
  if (isAiTyping.value) {
    ElMessage.error('AI正在输入中...');
    return;
  }
  const newMessage = userMessage.value.trim();
  userMessage.value = '';

  if (currentSession.value.status === 'TEMP') {
    startNewSession(newMessage);
  } else {
    message.value.push({
      id: Date.now(),
      senderType: 1,
      content: newMessage,
      createdAt: new Date().toISOString(),
    });
    nextTick(() => {
      startAiResponse(currentSession.value.sessionId, newMessage);
    });
  }
};

const startNewSession = (newMessage) => {
  const sessionParams = {
    initialMessage: newMessage,
  };
  if (currentSession.value.sessionTitle === '新会话') {
    sessionParams.sessionTitle = `AI助手_${new Date().toLocaleString()}`;
  } else {
    sessionParams.sessionTitle = currentSession.value.sessionTitle;
  }

  getNewConclution(sessionParams)
    .then((res) => {
      const sessionData = {
        sessionId: res.sessionId,
        status: res.status,
        sessionTitle: sessionParams.sessionTitle,
      };

      if (currentSession.value.status === 'TEMP') {
        Object.assign(currentSession.value, sessionData);
      } else {
        currentSession.value = sessionData;
      }

      getConclutionListData();

      message.value.push({
        id: Date.now(),
        senderType: 1,
        content: newMessage,
        createdAt: new Date().toISOString(),
      });

      startAiResponse(currentSession.value.sessionId, newMessage);
    })
    .catch(() => {
      ElMessage.error('会话创建失败，请稍后重试');
      isAiTyping.value = false;
    });
};

const startAiResponse = (sessionId, initialMessage) => {
  if (isAiTyping.value) {
    ElMessage.error('AI正在输入中...');
    return;
  }
  isAiTyping.value = true;

  if (!sessionId) {
    isAiTyping.value = false;
    ElMessage.error('会话ID无效，请刷新页面后重试');
    message.value.pop();
    return;
  }

  const aiMessage = {
    id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    senderType: 2,
    content: '',
    createdAt: new Date().toISOString(),
  };
  message.value.push(aiMessage);

  const ctrl = new AbortController();

  let isStreamFinished = false;
  const finishAiResponse = () => {
    if (isStreamFinished) return;
    isStreamFinished = true;
    isAiTyping.value = false;
    try { ctrl.abort(); } catch (e) { /* ignore */ }
    getEmotionAnalysisData(currentSession.value.sessionId);
  };

  fetchEventSource('/api/psychological-chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Token': localStorage.getItem('token'),
      'Accept': 'text/event-stream',
    },
    body: JSON.stringify({
      sessionId,
      userMessage: initialMessage,
    }),
    signal: ctrl.signal,
    onopen: async (response) => {
      if (response.status !== 200) {
        ElMessage.error(`服务器返回HTTP ${response.status}`);
        ctrl.abort();
        isAiTyping.value = false;
        return;
      }
      if (!response.headers.get('Content-Type')?.includes('text/event-stream')) {
        ElMessage.error('服务器返回非事件流内容');
        ctrl.abort();
        isAiTyping.value = false;
        return;
      }
    },
    onmessage: (event) => {
      const raw = event.data.trim();
      if (!raw) return;
      const eventName = event.event;

      const aiMsg = message.value[message.value.length - 1];

      const isDoneEvent = eventName === 'done';
      const isDoneData = raw === '[DONE]' || raw === 'DONE';

      if (isDoneEvent || isDoneData) {
        finishAiResponse();
        return;
      }

      try {
        const payload = JSON.parse(raw);

        if (payload.done === true || (payload.data && payload.data.done === true)) {
          finishAiResponse();
          return;
        }

        const ok = String(payload.code) === '200';
        if (ok && payload.data && payload.data.content) {
          aiMsg.content += payload.data.content;
        } else if (!ok) {
          const errMsg = payload.msg || payload.message || 'AI服务异常';
          handleError(errMsg);
        }
      } catch (parseError) {
        handleError('数据解析异常');
      }
    },
    onerror: (event) => {
      handleError(event || '连接错误');
    },
    onclose: () => {
      finishAiResponse();
    },
  });
};

const handleError = (errMsg) => {
  const lastMsg = message.value[message.value.length - 1];
  if (lastMsg && lastMsg.senderType === 2) {
    lastMsg.content = lastMsg.content || 'AI服务异常';
    lastMsg.isError = true;
  }
  isAiTyping.value = false;
  ElMessage.error(errMsg || 'AI服务异常');
};

const getConclutionListData = () => {
  getConclutionList({
    pageNum: 1,
    pageSize: 10,
  }).then((res) => {
    sessionList.value = res.records || [];
  });
};

const handleDeleteSession = (sessionId) => {
  deleteConclution({ sessionId }).then(() => {
    ElMessage.success('删除成功');
    getConclutionListData();
  });
};

const handleSessionClick = (session) => {
  getConclutionDetail(session.id).then((res) => {
    message.value = res || [];
  });
  const newSession = {
    sessionId: 'session_' + session.id,
    status: 'ACTIVE',
    sessionTitle: session.sessionTitle,
  };
  currentSession.value = newSession;
  getEmotionAnalysisData(session.id);
};

const formatMessageContent = (content) => {
  return content.replace(/\n/g, '<br>');
};

onMounted(() => {
  getConclutionListData();
  createNewFrontendSession();
});
</script>

<style lang="scss" scoped>
// ============================================
// 天蓝主题设计系统
// ============================================

// 主题色板
$sky-primary: #4facfe;
$sky-light: #7bc6ff;
$sky-dark: #2a8be6;
$sky-pale: #e6f4ff;
$sky-gradient-start: #4facfe;
$sky-gradient-end: #00f2fe;

// 中性色
$white: #ffffff;
$gray-50: #f8fafc;
$gray-100: #f1f5f9;
$gray-200: #e2e8f0;
$gray-300: #cbd5e1;
$gray-400: #94a3b8;
$gray-500: #64748b;
$gray-600: #475569;
$gray-700: #334155;
$gray-800: #1e293b;
$gray-900: #0f172a;

// 功能色
$success: #10b981;
$warning: #f59e0b;
$danger: #ef4444;
$info: #3b82f6;

// 阴影系统
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
$shadow-sky: 0 4px 20px rgba(79, 172, 254, 0.25);

// 圆角
$radius-sm: 8px;
$radius: 12px;
$radius-lg: 16px;
$radius-xl: 20px;
$radius-full: 9999px;

// 过渡
$transition-fast: 150ms ease;
$transition: 250ms ease;
$transition-slow: 350ms ease;

// ============================================
// 全局容器
// ============================================
.consultation-container {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 50%, #e0e7ff 100%);
  font-family: 'PingFang SC', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, sans-serif;
  box-sizing: border-box;
}

// ============================================
// 侧边栏
// ============================================
.sidebar {
  width: 360px;
  min-width: 360px;
  height: 100%;
  overflow: hidden;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba($white, 0.7);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba($sky-primary, 0.1);
  box-sizing: border-box;
}

// ============================================
// AI助手卡片
// ============================================
.ai-assistant-card {
  background: linear-gradient(135deg, rgba($sky-primary, 0.1) 0%, rgba($sky-light, 0.05) 100%);
  border: 1px solid rgba($sky-primary, 0.15);
  border-radius: $radius-lg;
  padding: 16px;
  text-align: center;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba($sky-primary, 0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  .assistant-avatar-wrap {
    position: relative;
    display: inline-block;
    margin-bottom: 8px;

    .assistant-avatar {
      width: 52px;
      height: 52px;
      border-radius: $radius-full;
      background: linear-gradient(135deg, $sky-primary 0%, $sky-light 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: $shadow-sky;
      position: relative;
      z-index: 1;
    }

    .avatar-ring {
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      border-radius: $radius-full;
      border: 2px solid rgba($sky-primary, 0.3);
      animation: ringPulse 3s ease-in-out infinite;
    }
  }

  .assistant-name {
    font-size: 16px;
    font-weight: 700;
    color: $gray-800;
    margin: 0 0 6px;
    position: relative;
    z-index: 1;
  }

  .online-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    position: relative;
    z-index: 1;

    .status-pulse {
      width: 8px;
      height: 8px;
      border-radius: $radius-full;
      background: $success;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 16px;
        height: 16px;
        border-radius: $radius-full;
        background: rgba($success, 0.3);
        animation: pulseRing 2s ease-out infinite;
      }
    }

    .status-text {
      font-size: 12px;
      color: $gray-500;
      font-weight: 500;
    }
  }
}

// ============================================
// 情绪花园
// ============================================
.emotion-garden {
  background: rgba($white, 0.8);
  border: 1px solid rgba($sky-primary, 0.12);
  border-radius: $radius-lg;
  padding: 16px;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;

  .garden-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;

    .garden-icon {
      font-size: 16px;
    }

    .garden-title {
      font-size: 14px;
      font-weight: 700;
      color: $gray-800;
    }
  }

  // 情绪仪表盘
  .emotion-gauge {
    display: flex;
    justify-content: center;
    margin-bottom: 12px;

    .gauge-circle {
      width: 80px;
      height: 80px;
      border-radius: $radius-full;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);

      .gauge-inner {
        width: 64px;
        height: 64px;
        border-radius: $radius-full;
        background: $white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: $shadow-sm;

        .gauge-label {
          font-size: 11px;
          color: $gray-500;
          font-weight: 500;
        }

        .gauge-score {
          font-size: 20px;
          font-weight: 700;
          color: $sky-primary;
          line-height: 1;
        }
      }
    }
  }

  // 情绪状态
  .emotion-status {
    .status-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 8px;

      .status-label {
        font-size: 12px;
        color: $gray-500;
      }

      .status-badge {
        font-size: 12px;
        font-weight: 600;
        padding: 3px 10px;
        border-radius: $radius-full;
        background: linear-gradient(135deg, rgba($success, 0.1) 0%, rgba($success, 0.05) 100%);
        color: $success;
        border: 1px solid rgba($success, 0.2);

        &.negative {
          background: linear-gradient(135deg, rgba($warning, 0.1) 0%, rgba($warning, 0.05) 100%);
          color: $warning;
          border-color: rgba($warning, 0.2);
        }
      }
    }

    .intensity-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;

      .intensity-track {
        flex: 1;
        height: 5px;
        background: $gray-200;
        border-radius: $radius-full;
        overflow: hidden;

        .intensity-fill {
          height: 100%;
          border-radius: $radius-full;
          background: linear-gradient(90deg, $sky-primary 0%, $sky-light 100%);
          transition: width $transition-slow;
        }
      }

      .intensity-text {
        font-size: 11px;
        color: $gray-500;
        font-weight: 500;
        white-space: nowrap;
      }
    }
  }

  // 建议卡片
  .suggestion-card {
    background: linear-gradient(135deg, rgba($sky-primary, 0.05) 0%, rgba($sky-light, 0.03) 100%);
    border: 1px solid rgba($sky-primary, 0.1);
    border-radius: $radius-sm;
    padding: 10px 12px;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 10px;

    .suggestion-icon {
      font-size: 16px;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .suggestion-body {
      flex: 1;

      .suggestion-title {
        font-size: 12px;
        font-weight: 600;
        color: $sky-dark;
        margin-bottom: 2px;
      }

      .suggestion-text {
        font-size: 11px;
        color: $gray-600;
        line-height: 1.5;
      }
    }
  }

  // 治愈行动
  .healing-section {
    margin-bottom: 10px;

    .section-label {
      font-size: 12px;
      font-weight: 600;
      color: $gray-700;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;

      &::before {
        content: '';
        width: 4px;
        height: 4px;
        border-radius: $radius-full;
        background: $sky-primary;
      }
    }

    .healing-list {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .healing-item {
        background: rgba($white, 0.9);
        border: 1px solid rgba($sky-primary, 0.08);
        border-radius: $radius-sm;
        padding: 8px 10px;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all $transition-fast;

        &:hover {
          border-color: rgba($sky-primary, 0.2);
          box-shadow: $shadow-sm;
        }

        .healing-icon {
          font-size: 12px;
          flex-shrink: 0;
        }

        .healing-text {
          font-size: 11px;
          color: $gray-600;
          line-height: 1.4;
        }
      }
    }
  }

  // 风险提示
  .risk-alert {
    background: linear-gradient(135deg, rgba($warning, 0.08) 0%, rgba($warning, 0.03) 100%);
    border: 1px solid rgba($warning, 0.15);
    border-radius: $radius-sm;
    padding: 10px 12px;
    display: flex;
    align-items: flex-start;
    gap: 8px;

    .risk-icon {
      font-size: 16px;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .risk-body {
      flex: 1;

      .risk-title {
        font-size: 12px;
        font-weight: 600;
        color: $warning;
        margin-bottom: 2px;
      }

      .risk-text {
        font-size: 11px;
        color: $gray-600;
        line-height: 1.5;
      }
    }
  }
}

// ============================================
// 会话列表面板
// ============================================
.session-panel {
  background: rgba($white, 0.8);
  border: 1px solid rgba($sky-primary, 0.12);
  border-radius: $radius-lg;
  padding: 12px;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .panel-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    flex-shrink: 0;

    .panel-icon {
      font-size: 14px;
    }

    .panel-title {
      font-size: 14px;
      font-weight: 700;
      color: $gray-800;
    }
  }

  .session-list {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    scrollbar-width: thin;
    scrollbar-color: rgba($sky-primary, 0.2) transparent;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba($sky-primary, 0.2);
      border-radius: $radius-full;
    }

    .session-item {
      background: rgba($gray-50, 0.8);
      border: 1px solid transparent;
      border-radius: $radius-sm;
      padding: 10px;
      cursor: pointer;
      transition: all $transition-fast;
      position: relative;
      display: flex;
      align-items: flex-start;
      gap: 8px;

      &:hover {
        background: rgba($sky-primary, 0.05);
        border-color: rgba($sky-primary, 0.15);
      }

      &.active {
        background: linear-gradient(135deg, rgba($sky-primary, 0.08) 0%, rgba($sky-light, 0.04) 100%);
        border-color: rgba($sky-primary, 0.25);
        box-shadow: 0 0 0 1px rgba($sky-primary, 0.1);
      }

      .session-main {
        flex: 1;
        min-width: 0;

        .session-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 4px;

          .session-name {
            font-size: 13px;
            font-weight: 600;
            color: $gray-800;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .session-time {
            font-size: 10px;
            color: $gray-400;
            flex-shrink: 0;
          }
        }

        .session-preview {
          font-size: 11px;
          color: $gray-500;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .session-meta {
          display: flex;
          align-items: center;
          gap: 10px;

          .meta-tag {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            font-size: 10px;
            color: $gray-400;

            .el-icon {
              font-size: 11px;
            }
          }
        }
      }

      .delete-btn {
        opacity: 0;
        transition: opacity $transition-fast;
        flex-shrink: 0;
        margin-top: 2px;
      }

      &:hover .delete-btn {
        opacity: 1;
      }
    }
  }
}

// ============================================
// 主聊天区
// ============================================
.chat-main {
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba($white, 0.6);
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;

  // 聊天头部
  .chat-header {
    flex-shrink: 0;
    background: linear-gradient(135deg, $sky-primary 0%, $sky-light 100%);
    padding: 12px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      pointer-events: none;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
      position: relative;
      z-index: 1;

      .header-avatar {
        width: 40px;
        height: 40px;
        border-radius: $radius-full;
        background: rgba($white, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
      }

      .header-info {
        h2 {
          font-size: 16px;
          font-weight: 700;
          color: $white;
          margin: 0 0 2px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        p {
          font-size: 12px;
          color: rgba($white, 0.85);
          margin: 0;
        }
      }
    }

    .new-session-btn {
      position: relative;
      z-index: 1;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px;
      border-radius: $radius-sm;
      background: rgba($white, 0.2);
      border: 1px solid rgba($white, 0.3);
      color: $white;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all $transition-fast;
      backdrop-filter: blur(10px);

      &:hover {
        background: rgba($white, 0.3);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .el-icon {
        font-size: 14px;
      }
    }
  }

  // 消息区域
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-height: 0;
    scrollbar-width: thin;
    scrollbar-color: rgba($sky-primary, 0.2) transparent;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba($sky-primary, 0.2);
      border-radius: $radius-full;
    }

    .message-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      animation: messageSlideIn 0.3s ease-out;

      .message-avatar {
        width: 32px;
        height: 32px;
        border-radius: $radius-full;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        overflow: hidden;
      }

      .message-body {
        max-width: 70%;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .message-bubble {
          border-radius: $radius;
          padding: 10px 14px;
          position: relative;
          word-break: break-word;

          p {
            margin: 0;
            line-height: 1.6;
            font-size: 14px;
          }
        }

        .message-time {
          font-size: 11px;
          color: $gray-400;
        }
      }

      // AI消息
      &.ai-message {
        .message-avatar {
          background: linear-gradient(135deg, $sky-primary 0%, $sky-light 100%);
          box-shadow: $shadow-sky;
        }

        .message-bubble {
          background: $white;
          border: 1px solid rgba($sky-primary, 0.1);
          box-shadow: $shadow-sm;
          border-bottom-left-radius: 4px;
          color: $gray-700;
        }
      }

      // 用户消息
      &.user-message {
        flex-direction: row-reverse;

        .message-avatar {
          background: linear-gradient(135deg, $gray-600 0%, $gray-700 100%);
          box-shadow: 0 4px 12px rgba($gray-700, 0.2);
        }

        .message-body {
          align-items: flex-end;

          .message-bubble {
            background: linear-gradient(135deg, $sky-primary 0%, $sky-light 100%);
            color: $white;
            border-bottom-right-radius: 4px;
            box-shadow: $shadow-sky;
          }

          .message-time {
            align-self: flex-end;
          }
        }
      }
    }
  }

  // 输入区域
  .chat-input {
    flex-shrink: 0;
    padding: 12px 20px;
    background: rgba($white, 0.8);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba($sky-primary, 0.1);
    display: flex;
    align-items: flex-end;
    gap: 10px;

    .input-wrapper {
      flex: 1;
      min-width: 0;

      .chat-textarea {
        width: 100%;
        padding: 10px 14px;
        border: 1px solid rgba($sky-primary, 0.2);
        border-radius: $radius;
        font-size: 14px;
        line-height: 1.5;
        color: $gray-700;
        background: $white;
        resize: none;
        outline: none;
        font-family: inherit;
        transition: all $transition-fast;
        box-sizing: border-box;
        min-height: 40px;

        &:focus {
          border-color: $sky-primary;
          box-shadow: 0 0 0 3px rgba($sky-primary, 0.1);
        }

        &:disabled {
          background: $gray-100;
          color: $gray-400;
          cursor: not-allowed;
        }

        &::placeholder {
          color: $gray-400;
        }
      }

      .input-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 4px;
        padding: 0 4px;

        .hint {
          font-size: 11px;
          color: $gray-400;
        }

        .char-count {
          font-size: 11px;
          color: $gray-400;
          font-weight: 500;
          transition: color $transition-fast;

          &.near-limit {
            color: $warning;
          }
        }
      }
    }

    .send-btn {
      width: 40px;
      height: 40px;
      border-radius: $radius;
      background: linear-gradient(135deg, $sky-primary 0%, $sky-light 100%);
      border: none;
      color: $white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all $transition-fast;
      box-shadow: $shadow-sky;
      flex-shrink: 0;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba($sky-primary, 0.35);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }

      &:disabled {
        background: $gray-300;
        box-shadow: none;
        cursor: not-allowed;
      }

      .el-icon {
        font-size: 16px;
      }
    }
  }
}

// ============================================
// 打字指示器
// ============================================
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 0;

  .typing-dot {
    width: 8px;
    height: 8px;
    border-radius: $radius-full;
    background: $gray-300;
    animation: typingBounce 1.4s ease-in-out infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

// ============================================
// 错误气泡
// ============================================
.error-bubble {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 1px solid #fecaca;
  border-radius: $radius;
  padding: 12px 16px;
  color: #991b1b;
  font-weight: 500;

  p {
    margin: 0;
  }
}

// ============================================
// 动画
// ============================================
@keyframes ringPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
}

@keyframes pulseRing {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes typingBounce {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-6px);
  }
}

// ============================================
// 响应式适配
// ============================================
@media (max-width: 1024px) {
  .sidebar {
    width: 300px;
    min-width: 300px;
  }
}

@media (max-width: 768px) {
  .consultation-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    min-width: auto;
    height: 35vh;
    max-height: 35vh;
    padding: 12px;
    gap: 8px;
  }

  .chat-main {
    height: 65vh;
  }
}
</style>