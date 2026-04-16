<template>
    <div class="sider-bar">
        <div class="sider-bar-left">
            <el-button>展开</el-button>
            <span>AI助手</span>
        </div>
        <div class="sider-bar-right">
            <el-dropdown @command="handleCommand">
                <div class="el-dropdown-link">
                    <el-image src="/src/assets/images/avatar.png" alt="用户头像" class="avatar" />
                    <span class="user-name">用户姓名</span>
                </div>
                <template #reference>
                    <el-dropdown-menu>
                        <el-dropdown-item>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>

const handleCommand = (command) => {
    console.log(command)
}

</script>

<style lang="scss" scoped>
.sider-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    
    .sider-bar-left 
    .sider-bar-right 
    .el-dropdown-link{
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .sider-bar-left {
        margin-left: 300px;
    }
}


</style>