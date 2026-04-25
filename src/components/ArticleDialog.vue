<template>
<div class="article-dialog">
    <el-dialog :title="isEdit ? '编辑文章' : '新增文章'" width="50%" v-model="dialogVisible" top="0vh">
        <el-form :model="formData" :label-width="formLabelWidth" ref="formRef" :rules="rules">>
            <el-form-item label="文章标题" prop="title">
                <el-input v-model="formData.title" placeholder="请输入文章标题"></el-input>
            </el-form-item>
            <el-form-item label="所属分类" prop="categoryId">
                <el-select v-model="formData.categoryId" placeholder="请选择所属分类">
                    <el-option v-for="item in props.categories" :key="item.value" :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="文章摘要" prop="summary">
                <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要" :rows="4"></el-input>
            </el-form-item>
            <el-form-item label="文章标签" prop="tags">
                <el-select v-model="formData.tagArray" placeholder="请选择标签" multiple>
                    <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="文章封面" prop="coverImage">
                <el-upload class="avatar-uploader" action="#" :show-file-list="false" :before-upload="beforeUpload"
                    :http-request="handleAvatarSuccess" accept="image/*">
                    <div class="avatar-uploader-text" v-if="!imgUrl">
                        <p>点击上传文章封面</p>
                    </div>
                    <el-image v-else :src="imgUrl" alt="文章封面" />
                </el-upload>
                <div class="remove-btn">
                    <el-button type="danger" size="small" @click="removeImage">移除封面</el-button>
                </div>
            </el-form-item>
            <el-form-item label="文章内容" prop="content">
                <rich-text-editor v-model="formData.content" :height="300" placeholder="请输入文章内容"
                    @change="handleChangeContent" @created="handleEditorCreated" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="content-preview" v-if="btnPreview && formData.content">
                <p>内容预览</p>
                <div v-html="formData.content"></div>
            </div>
            <el-button type="default" @click="btnPreview = !btnPreview; loading = false">预览</el-button>
            <el-button type="primary" @click="handleSubmit" :loading="loading">提交</el-button>
        </template>
    </el-dialog>
</div>
</template>

<script setup>
import { ref, computed, reactive, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadCover, uploadArticle, editArticle } from '../apis/admin/knowledage'
import { fileBaseUrl } from '../config/admin'
import RichTextEditor from '@/components/RichTextEditor.vue'

const formLabelWidth = '120px'

// 新增/编辑文章, 从父组件接收数据
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    categories: {
        type: Array,
        default: () => []
    },
    editFormData: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['update:modelValue', 'success'])

const dialogVisible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

// 表单数据
const formData = reactive({
    "title": "",
    "content": "",
    "coverImage": "",
    "categoryId": 0,
    "summary": "",
    "tags": "",
    "id": ""
})

// 文章标签
const commonTags = [
    '情绪管理', '焦虑', '抑郁', '压力', '睡眠',
    '冥想', '正念', '放松', '心理健康', '自我成长',
    '人际关系', '工作压力', '学习方法', '生活技巧'
]

// 校验规则
const rules = {
    title: [
        { required: true, message: '请输入文章标题', trigger: 'blur' },
        { min: 2, max: 50, message: '文章标题长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    content: [
        { required: true, message: '请输入文章内容', trigger: 'blur' },
        { min: 10, message: '文章内容至少 10 个字符', trigger: 'blur' }
    ],
    categoryId: [
        { required: true, message: '请选择文章分类', trigger: 'blur' }
    ]
}

// 封面上传
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

// 封面上传成功
const businessId = ref('')
const handleAvatarSuccess = async ({ file }) => {
    businessId.value = crypto.randomUUID()
    const res = await uploadCover(file, { businessId: businessId.value })
    console.log(res)
    if (res.filePath) {
        imgUrl.value = fileBaseUrl + res.filePath
        formData.coverImage = res.filePath
    }
}

// 移除封面
const removeImage = () => {
    imgUrl.value = ''
    formData.coverImage = ''
}

// 富文本编辑器
const handleChangeContent = (data) => {
    formData.content = data.html
}

// 富文本编辑器创建完成
const editorRef = ref(null)
const handleEditorCreated = (editor) => {
    editorRef.value = editor

    if (formData.content && editorRef.value) {
        nextTick(() => {
            editorRef.value.setHTML(formData.content)
        })
    }
}
// 内容预览
const btnPreview = ref(null)

// 提交
//  是否编辑
const isEdit = computed(() => !!props.editFormData?.id)
const loading = ref(false)
const formRef = ref(null)
const handleSubmit = async () => {
    // 表单校验
    formRef.value.validate((valid, fields) => {
        if (valid) {
            loading.value = true

        }
        const submitData = {
            ...formData,
            tags: formData.tagArray.join(',')
        }
        console.log(submitData)

        if (isEdit.value) {
            // 编辑文章
            editArticle(props.editFormData.id, submitData).then(res => {
                console.log(res)
                loading.value = false
            })
        } else {
            // 新增文章
            submitData.id = businessId.value
            uploadArticle(submitData).then(res => {
                console.log(res)
                loading.value = false
                formRef.value.resetFields()
                businessId.value = ''
                removeImage()
                // 清空标签
                formData.tagArray = []
                emit('success')
            })
        }
    })
}

// 编辑文章

// 检测编辑数据是否获取
watch(() => props.editFormData, (val) => {
    if (val) {
        nextTick(() => {
            // 
            Object.assign(formData, val)
            businessId.value = val.id
            imgUrl.value = fileBaseUrl + val.coverImage
        })
    }
})

// 检测弹窗是否关闭, 关闭编辑则清除数据，关闭新增不清除数据
watch(() => dialogVisible.value, (val) => {
    if (!val && isEdit.value) {
        console.log(!val && isEdit.value)
        formRef.value.resetFields()
        businessId.value = ''
        removeImage()
        // 清空标签
        formData.tagArray = []
    }
})
</script>

<style lang="scss" scoped>
.article-dialog {
    width: 300px;
    position: relative;
    margin-top: 10px;

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

        .el-image {
            width: 200px;
            height: 150px;
        }
    }

    .remove-btn {
        margin-top: 10px;
        position: absolute;
        top: 10px;
        right: 10px;
    }

    .content-preview {
        // 内容靠左
        width: 300px;
        text-align: left;
        margin-left: 50px;

        p {
            margin-bottom: 10px;

        }
    }

}
</style>
