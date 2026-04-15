<template>
    <el-menu
        default-active="2"
        class="el-menu-vertical"
        @open="handleOpen"
        @close="handleClose"
      >
        <div class="logo">
          <img :src="image" alt="logo" style="width: 60px;"/>
          <div class="logo-text">
            <h3>心理健康AI助手</h3>
          </div>
        </div>
        <el-menu-item v-for="item in router.options.routes[0].children" :key="item.path" :index="item.path">
            <el-icon><component :is="item.meta.icon" /></el-icon>
            <span>{{ item.meta.title }}</span>
        </el-menu-item>
        <!-- <el-menu-item index="2">
          <el-icon><location /></el-icon>           
          <span>Navigator Two</span>
        </el-menu-item>
        <el-menu-item index="3" >
          <el-icon><document /></el-icon>
          <span>Navigator Three</span>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><setting /></el-icon>
          <span>Navigator Four</span>
        </el-menu-item> -->
      </el-menu>
</template>

<script setup>
import { useRouter } from 'vue-router'

const image = new URL('@/assets/images/机器人.png', import.meta.url).href

const router = useRouter()

const handleOpen = (key) => {
  console.log(key)
}

const handleClose = (key) => {
  console.log(key)
}

console.log(router)
</script>

<style lang="scss" scoped>
.el-menu-vertical {
  height: 100%;
  background-color: #f5f7fa;

  .logo {
    display: flex;
    justify-content: center;

    .logo-text {
      font-size: 20px;
      font-weight: bold;
      color: #303133;
      margin-top: 15px;
    }
  }
}
</style>