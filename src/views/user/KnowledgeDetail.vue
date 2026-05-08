<template>
    <div class="KnowledgeDetail-page">
        <div class="KnowledgeDetail-page-header">
            <div class="KnowledgeDetail-page-header-title">
                知识库详情
            </div>
        </div>
        <div class="KnowledgeDetail-page-content">
            <div class="KnowledgeDetail-page-content-title">
                <!-- {{ knowledgeDetail.title }} -->
            </div>
            <div class="KnowledgeDetail-page-content-content">
                <!-- {{ knowledgeDetail.content }} -->
            </div>
        </div>
    </div>
</template>

<script setup>
import { getKnowledgeDetail } from "@/apis/user/knowledgedetail";
import { onMounted } from "vue";

import { ref } from "vue";

const knowledgeDetail = ref(null);

const props = defineProps({
    id: {
        type: String,
        required: true
    }
});

const getDetail = () => {
    getKnowledgeDetail(props.id).then(res => {
        knowledgeDetail.value = res.data;
        console.log(knowledgeDetail.value);
    })
}

onMounted(() => {
    getDetail();
})
</script>


<style lang="scss" scoped>
.KnowledgeDetail-page {
    height: 100%;
    width: 100%;

    &-header {
        height: 100px;
        width: 100%;
        display: flex;
        align-items: center;
        border-radius: 10px;
        //渐变背景
        background: linear-gradient( 160deg, #a2c7ff 0%, #f8a8a8 100%);
    }

    &-header-title {
        font-size: 40px;
        font-weight: bold;
        color: #fff;
        margin-left: 20px;
    }
}


</style>
