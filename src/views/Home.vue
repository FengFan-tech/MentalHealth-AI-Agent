<template>
<div class="content-wrapper">
    <div class="text-section">
        <h2>一次温暖的对话</h2>
        <h3>化孤独为慰藉</h3>
        <p>每个深夜，每个焦虑的时刻，我们都在这里。不必独自承受，让心与心的连接温暖您的每一天</p>
        <div class="btn-group">
            <button class="primary-btn">开始倾诉，获得陪伴</button>
            <button class="secondary-btn">记录心情，释放情感</button>
        </div>
    </div>
    <div class="icon-section">
        <el-image style="width: 120px; height: 120px" :src="iconUrl" />
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue'

const iconUrl = new URL('@/assets/images/robot-fill.png', import.meta.url).href
</script>
<style scoped lang="scss">
.content-wrapper {
    display: flex;
    align-items: center;
    gap: 120px;
    max-width: 1200px;
    padding: 50px;

    .text-section {
        max-width: 400px;

        h2 {
            font-size: 40px;
            font-weight: 600;
            color: #ffffff;
            margin: 0 0 16px;
        }

        h3 {
            font-size: 40px;
            font-weight: 600;
            color: #ffd700;
            margin: 0 0 20px;
        }

        p {
            font-size: 20px;
            color: rgba(255, 255, 255, 0.85);
            line-height: 1.8;
            margin: 0 0 30px;
        }

        .btn-group {
            display: flex;
            gap: 16px;
            flex-wrap: wrap;

            button {
                padding: 10px 24px;
                font-size: 14px;
                border-radius: 4px;
                transition: all 0.3s;

                &.primary-btn {
                    background-color: #ffffff;
                    color: #515151;
                    border: none;

                    &:hover {
                        background-color: #f5f5f5;
                    }
                }

                &.secondary-btn {
                    background-color: transparent;
                    color: #ffffff;
                    border: 1px solid #ffffff;

                    &:hover {
                        background-color: rgba(255, 255, 255, 0.1);
                    }
                }
            }
        }
    }

    .icon-section {
        width: 280px;
        height: 280px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid rgba(255, 255, 255, 0.3);

        img {
            width: 120px;
            height: 120px;
        }
    }
}
</style>
