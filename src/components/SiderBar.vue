<template>
    <div class="sider-bar">
        <div class="sider-bar-left">
            <el-button @click="handleOpen">展开</el-button>
            <h2>智能助手</h2>
        </div>
        <div class="sider-bar-right">
            <el-dropdown @command="handleCommand">
                <div class="el-dropdown-link">
                    <el-image src="/src/assets/images/users.png" alt="用户头像" class="avatar" />
                    <span class="user-name">用户姓名</span>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import { useAdminStore } from '@/stores/admin'
import { useRouter } from 'vue-router'

const router = useRouter()

const adminStore = useAdminStore()

const handleOpen = () => {
    adminStore.toggleCollapse()
}



const handleCommand = (command) => {
    router.push({ name: 'Login' })
}

</script>

<style lang="scss" scoped>
.sider-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    
    .sider-bar-left {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-left: 300px;
    }
    
    .sider-bar-right {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .el-dropdown-link {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;

        .el-image {
            // 缩小头像
            height: 30px;
            width: 30px;
            border-radius: 50%;
            // 线条阴影
            box-shadow: 0 0 0 2px #fff, 0 0 0 4px #007bff;
        }
    }
}


</style>