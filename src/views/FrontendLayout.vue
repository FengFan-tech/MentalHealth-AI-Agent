<template>
<div class="frontend-layout">
    <div class="navbar-container">
        <div class="brand-section">
            <el-image style="width: 50px; height: 50px" :src="iconUrl" alt="品牌logo" class="brand-logo" />
            <h1 class="brand-name">心理健康AI助手</h1>
        </div>
        <div class="nav-section">
            <router-link to="/" class="nav-link">首页</router-link>
            <router-link to="/consultation" class="nav-link" v-if="isLoggedIn">AI咨询</router-link>
            <router-link to="/emotion-diary" class="nav-link" v-if="isLoggedIn">情绪日记</router-link>
            <router-link to="/knowledge" class="nav-link">知识库</router-link>
            <el-button v-if="isLoggedIn" class="logout-btn">退出登录</el-button>
            <template v-else>
                <router-link to="/login" class="nav-link">登录</router-link>
                <router-link to="/register" class="nav-link">注册</router-link>
            </template>
        </div>
    </div>
    <div class="main-content"></div>
    <div class="footer-container"></div>
</div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
