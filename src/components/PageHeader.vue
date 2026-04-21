<template>
    <div class="page-header">
        <h1 class="page-title">{{ prop.title }}</h1>
        <div class="action-btn">
            <slot name="button"></slot>
        </div>
    </div>
</template>

<script setup>
const prop = defineProps({
    title: {
        type: String,
        default: '页面标题'
    }   
})
</script>

<style lang="scss" scoped>
.page-header {
    display:flex;
    align-items:center;
    justify-content:space-between;
}
</style>