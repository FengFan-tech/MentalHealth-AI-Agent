<template>
<div class="auth-layout">
    <div class="auth-layout-left">
        <div class="auth-layout-left-content">
            <div class="auth-layout-left-content-title">
                <h2>AI Agent</h2>
                <p>基于大模型的智能助手</p>
            </div>
        </div>
        <div class="auth-image">
            <el-image src="/src/assets/images/robot-fill.png" alt="logo" class="logo" />
        </div>
    </div>
    <div class="auth-layout-right">
        <router-view></router-view>
    </div>
</div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
    formItem: {
        type: Array,
        default: () => [],
    },
});
</script>

<style lang="scss" scoped>
.auth-layout {
    height: 100%;
    display: flex;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    .auth-layout-left {
        height: 100%;
        width: 50%;
        background-color: #63a1ff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 40px;
 
        .auth-layout-left-content {
            text-align: center;
            color: #4a4a4a
            ;

            h2 {
                font-size: 40px;
                font-weight: 700;
                margin: 0 0 10px;
            }

            p {
                font-size: 18px;
                margin: 0;
            }
        }

        .auth-image {
            height: 250px;
            width: 250px;
            border-radius: 50%;
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
            position: relative;
            background-color: rgba(0, 0, 0, 0.1);

            .el-image {
                height: 60%;
                width: 60%;    
                position: absolute; 
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

        }
    }

    .auth-layout-right {
        height: 100%;
        width: 50%;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
