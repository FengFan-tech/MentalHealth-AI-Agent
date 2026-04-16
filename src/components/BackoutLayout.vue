<template>
  <div class="common-layout">
    <el-container class="navbar-section">
      <el-header class="sider-bar">
        <SiderBar></SiderBar>
      </el-header>
      <el-container>
        <el-aside width="264px" >
          <NavBar></NavBar>
        </el-aside>
        <el-main>
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import NavBar from "@/components/NavBar.vue";
import SiderBar from "@/components/SiderBar.vue";

</script>


<style lang="scss" scoped>
.common-layout {
  height: 100vh;
  background-color: #f5f7fa;

  .sider-bar {
    height: 100%;
    // background-color: blue;
  }
  
  .navbar-section {
    height: 100%;
  }

}
</style>