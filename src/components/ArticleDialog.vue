<template>
<div class="article-dialog">
    <el-dialog title="文章详情" width="50%" v-model="dialogVisible">
        <el-form :model="formData" :label-width="formLabelWidth" ref="formRef">
            <el-form-item label="文章标题" prop="title">
                <el-input v-model="formData.title" placeholder="请输入文章标题"></el-input>
            </el-form-item>
            <el-form-item label="所属分类" prop="categoryId">
                <el-select v-model="formData.categoryId" placeholder="请选择所属分类">
                    <el-option v-for="item in props.categories" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="文章摘要" prop="content">
                <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要" :rows="4"></el-input>
            </el-form-item>
            <el-form-item label="文章标签" prop="tags">
                <el-select v-model="formData.tags" placeholder="请选择标签" multiple>
                    <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="文章封面" prop="coverImage">
                <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :before-upload="beforeUpload" :http-request="handleAvatarSuccess" accept="image/*">
                    <div class="avatar-uploader-text" v-if="!imgUrl">
                        <p>点击上传文章封面</p>
                    </div>
                    <el-image v-else :src="imgUrl" alt="文章封面" />
                </el-upload>
            </el-form-item>
        </el-form>
    </el-dialog>
</div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    categories: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const formData = reactive({
    "title": "",
    "content": "",
    "coverImage": "",
    "categoryId": 0,
    "summary": "",
    "tags": "",
    "id": ""
})

const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠',
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]

const imgUrl = ref('')
const beforeUpload = (file) => {
    const isJPG = file.type.startsWith('image/')
    const isLt5M = file.size / 1024 / 1024 < 5

    if (!isJPG) {
        ElMessage.error('上传图片只能是 JPG/PNG 格式!')
        return false
    }

    if (!isLt5M) {
        ElMessage.error('上传图片大小不能超过 5MB!')
        return false
    }
    return true
}
</script>

<style lang="scss" scoped>
.article-dialog {
    width: 300px;

    .el-dialog__body {
        padding: 20px;
    }

    .avatar-uploader {
        width: 200px;
        height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgb(229, 234, 234);
    }
}
</style>
