<template>
<div class="register-container">
    <div class="register-card">
        <div class="register-header">
            <h2>注册</h2>
            <p class="register-subtitle">创建新账号，开始使用心理健康AI助手</p>
        </div>
        <div class="register-form">
            <el-form label-position="top" label-width="100%" :rules="rules" ref="ruleForm">
                <el-form-item label="用户名">
                    <el-input placeholder="请输入用户名或邮箱" class="form-input" 
                        v-model="formData.username" />
                </el-form-item>
                <el-form-item label="密码">
                    <el-input placeholder="请输入密码" type="password" class="form-input" 
                        show-password />
                </el-form-item>
                <el-form-item label="确认密码">
                    <el-input placeholder="请确认密码" type="password" class="form-input" 
                        show-password />
                </el-form-item>
                <el-form-item label="手机号码">
                    <el-input placeholder="请输入手机号码" class="form-input" 
                        v-model="formData.phone" />
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input placeholder="请输入昵称" class="form-input" 
                        v-model="formData.nickname" />
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input placeholder="请输入邮箱" class="form-input" 
                        v-model="formData.email" />
                </el-form-item>
                <div class="form-footer">
                    <el-checkbox v-model="checked">同意注册协议</el-checkbox>
                    <el-link type="primary" @click="handleLogin(ruleForm)">登录账号</el-link>
                </div>
                <el-form-item>
                    <el-button type="primary" class="register-button" @click="handleRegister(ruleForm)">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, reactive } from 'vue';
import { register } from '@/apis/user/register';
import { ElMessage } from 'element-plus';

const router = useRouter()
const checked = ref(false);
const formData = reactive({
    "username": "",
    "email": "",
    "nickname": "",
    "phone": "",
    "password": "",
    "confirmPassword": "",
    "gender": 0,
    "userType": 0
});

const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
    ],
    confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
    ],
    phone: [
        { required: true, message: '请输入手机号码', trigger: 'blur' },
    ],
    nickname: [
        { required: true, message: '请输入昵称', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
    ],
    checked: [
        { required: true, message: '请同意注册协议', trigger: 'change' },
    ],
})

const handleLogin = () => {

    router.push('/auth/login')
}

// 注册处理
const ruleForm = ref(null)
const handleRegister = async (ruleForm) => {
    if ( !ruleForm.value) return
    ruleForm.value.validate( async(valid) => {
        register(formData).then(({data}) => {
            if (!data.code){
                ElMessage.success('注册成功，请登录')
                router.push('/auth/login')
            } else {
                ElMessage.error(data.message)
            }
        })
    })
}
</script>

<style lang="scss" scoped>
.register-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    // padding: 20px;
}

.register-card {
    width: 100%;
    width: 400px;
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        transform: translateY(-5px);
    }
}

.register-header {
    padding: 40px 40px 0;
    text-align: center;

    h2 {
        margin: 0 0 10px;
        font-size: 24px;
        font-weight: 600;
        color: #303133;
    }

    .register-subtitle {
        margin: 0;
        font-size: 14px;
        color: #909399;
    }
}

.register-form {
    padding: 30px 40px 40px;

    .form-input {
        width: 100%;
        border-radius: 8px;
        height: 44px;
        font-size: 14px;
    }

    .verification-code {
        display: flex;
        gap: 10px;

        .code-input {
            flex: 1;
        }

        .code-button {
            width: 120px;
            height: 44px;
            border-radius: 8px;
            font-size: 14px;
        }
    }

    .form-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;

        .el-checkbox__label {
            font-size: 14px;
            color: #606266;
        }

        .el-link {
            font-size: 14px;
        }
    }

    .register-button {
        width: 100%;
        height: 44px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        transition: all 0.3s ease;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(48, 167, 255, 0.4);
        }
    }
}

// 响应式设计
@media (max-width: 480px) {
    .register-card {
        margin: 0 20px;
    }

    .register-header {
        padding: 30px 30px 0;
    }

    .register-form {
        padding: 25px 30px 30px;
    }

    .verification-code {
        flex-direction: column;

        .code-button {
            width: 100%;
        }
    }
}
</style>
