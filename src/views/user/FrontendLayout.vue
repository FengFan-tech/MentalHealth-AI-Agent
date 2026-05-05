<template>
<div class="frontend-layout">
  <div class="navbar-container">
    <div class="brand-section">
      <el-image style="width: 50px; height: 50px" :src="iconUrl" alt="品牌logo" class="brand-logo" />
      <h1 class="brand-name">心理健康AI助手</h1>
    </div>
    <div class="nav-section">
      <router-link to="/" class="nav-link">首页</router-link>
      <router-link to="/conclutions" class="nav-link" v-if="isLoggedIn">AI咨询</router-link>
      <router-link to="/emotion-diary" class="nav-link" v-if="isLoggedIn">情绪日记</router-link>
      <router-link to="/knowledges" class="nav-link">知识库</router-link>
      <el-button v-if="isLoggedIn" class="logout-btn" @click="handleLogout">退出登录</el-button>
      <template v-else>
        <router-link to="/auth/login" class="nav-link">登录</router-link>
        <router-link to="/auth/register" class="nav-link">注册</router-link>
      </template>
    </div>
  </div>
  <div class="main-content">
    <router-view />
  </div>
  <div class="footer-container">
    <p>© 2026 心理健康AI助手. 保留所有权利.</p>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Home from '../Home.vue';
import { useRouter } from 'vue-router';
import { logout } from '@/apis/admin/logout';

const router = useRouter();

const iconUrl = new URL('@/assets/images/机器人.png', import.meta.url).href

const isLoggedIn = ref(false)

const handleLogout =async () => {
  await logout().then(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    isLoggedIn.value = false
    router.push('/auth/login')
  })
}

onMounted(() => {
  isLoggedIn.value = localStorage.getItem('token') !== null
})
</script>

<style lang="scss" scoped>
.frontend-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 50px;
    height: 60px;
    background-color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    .brand-section {
      display: flex;
      align-items: center;
      gap: 12px;

      .brand-logo {
        width: 40px;
        height: 40px;
      }

      .brand-name {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin: 0;
      }
    }

    .nav-section {
      display: flex;
      align-items: center;
      gap: 30px;

      .nav-link {
        text-decoration: none;
        font-size: 14px;
        color: #666;
        transition: color 0.3s;

        &:hover {
          color: #4facfe;
        }
      }

      .logout-btn {
        padding: 6px 16px;
        font-size: 13px;
        background-color: #fff;
        color: #666;
        border: 1px solid #ddd;
        border-radius: 4px;

        &:hover {
          background-color: #f5f5f5;
        }
      }
    }
  }

  .main-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: -100px;
      right: -100px;
      width: 400px;
      height: 400px;
      border-radius: 50%;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -80px;
      left: -80px;
      width: 300px;
      height: 300px;
      border-radius: 50%;
    }
  }

  .footer-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    background-color: #2c3e50;

    p {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
    }
  }
}
</style>
