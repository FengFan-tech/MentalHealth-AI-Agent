<template>
    <el-aside :width="isCollapse ? '64px' : '264px'">
      <el-menu
        default-active="2"
        class="el-menu-vertical"
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <div class="logo" v-if="!isCollapse">
          <img :src="image" alt="logo" style="width: 60px;"/>
          <div class="logo-text">
            <h3>心理健康AI助手</h3>
          </div>
        </div>
        <el-menu-item  @click="selectMenu(item.path)" v-for="item in menuItems" :key="item.path" :index="item.path">
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
    </el-aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { computed } from 'vue'
import { router as routerConfig } from '@/router'

const image = new URL('@/assets/images/机器人.png', import.meta.url).href

const router = useRouter()

const adminStore = useAdminStore()

const isCollapse = computed(() => adminStore.isCollapse)

const menuItems = computed(() => {
  const backRoute = routerConfig.options.routes.find(r => r.path === '/back')
  return backRoute ? backRoute.children : []
})

const selectMenu = (path) => {
  router.push('/back' + path)
}
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