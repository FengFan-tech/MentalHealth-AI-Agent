<template>
<div class="login-container">
    <div class="login-card">
        <div class="login-header">
            <h2>登录</h2>
            <p class="login-subtitle">欢迎回来，请登录您的账号</p>
        </div>
        <div class="login-form">
            <el-form label-position="top" label-width="100%" ref="ruleForm" :model="formData" :rules="rules">
                <el-form-item label="用户名">
                    <el-input v-model="formData.username" placeholder="请输入用户名" class="form-input" />
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="formData.password" placeholder="请输入密码" type="password" show-password
                        class="form-input" />
                </el-form-item>
                <div class="form-footer">
                    <el-checkbox v-model="checked">记住密码</el-checkbox>
                    <el-link type="primary" @click="handleRegister">注册账号</el-link>
                </div>
                <el-form-item>
                    <el-button type="primary" class="login-button" @click="handleLogin(ruleForm)">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, reactive, onMounted } from 'vue';
import { login } from '../apis/admin/knowledage';
import { ElMessage } from 'element-plus';

const router = useRouter();
const checked = ref(false);
const formData = reactive({
    username: '',
    password: '',
});
const ruleForm = ref(null);

const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
    ],
})

// 切换注册
const handleRegister = () => {
    router.push('/auth/register')
}

// 登录处理
const handleLogin = async (ruleForm) => {
    
    if (!ruleForm) {
        return;
    }
    
    await ruleForm.validate((valid, fields) => {
        console.log( ruleForm)
        if (valid) {
            console.log('valid', valid, fields);
            login(formData).then(res => {
                console.log('res', res);
                if (!res.token) {
                    return ElMessage.error('登录失败，请检查用户名或密码')
                }
                // 登录成功，提示用户
                ElMessage.success('登录成功')
                // 登录成功后，跳转首页
                localStorage.setItem('token', res.token)
                localStorage.setItem('username', JSON.stringify(res.userInfo))
                
                // 判断登录用户类别
                console.log(res.userInfo.userType)
                if ( res.userInfo.userType === 2) {
                    router.push('/')
                }
            }).catch(err => {
                console.log('err', err);
                // 登录失败，提示用户
                ElMessage.error(err.message || '登录失败')
            })
        }
    });
}

</script>

<style lang="scss" scoped>
.login-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    // padding: 20px;
}

.login-card {
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

.login-header {
    padding: 40px 40px 0;
    text-align: center;

    h2 {
        margin: 0 0 10px;
        font-size: 24px;
        font-weight: 600;
        color: #303133;
    }

    .login-subtitle {
        margin: 0;
        font-size: 14px;
        color: #909399;
    }
}

.login-form {
    padding: 30px 40px 40px;

    .form-input {
        width: 100%;
        border-radius: 8px;
        height: 44px;
        font-size: 14px;
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

    .login-button {
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
    .login-card {
        margin: 0 20px;
    }

    .login-header {
        padding: 30px 30px 0;
    }

    .login-form {
        padding: 25px 30px 30px;
    }
}
</style>
