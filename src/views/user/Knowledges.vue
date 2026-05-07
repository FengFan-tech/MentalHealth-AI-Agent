<template>
<div class="Knowledges-page">
    <div class="Knowledges-page-header">
        <div class="Knowledges-page-header-title">
            知识库
        </div>
    </div>
    <div class="Knowledges-page-content">
        <!-- 左边区域 -->
        <div class="Knowledges-page-left">
            <div class="Knowledges-page-left-title">
                推荐列表
            </div>
            <div class="Knowledges-page-left-content">
                <div v-for="item in knowledges" :key="item.id" class="Knowledges-page-left-content-item">
                    <h4>{{ item.title }}</h4>
                    <p>
                        <el-icon><Histogram/></el-icon>
                        阅读量 {{  item.readCount }}
                    </p>
                </div>
            </div>
        </div>
        <!-- 右边区域 -->
        <div class="Knowledges-page-right">
            <div class="Knowledges-page-right-title">
                知识库列表
            </div>
            <div class="Knowledges-page-right-content">
                <div v-for="item in knowledges" :key="item.id" class="Knowledges-page-right-content-item">
                    <el-image :src="handleCoverImage(item.coverImage)"></el-image>
                    <div class="Knowledges-page-right-content-item-title">
                        <h2>{{ item.title }}</h2>
                    </div>
                    <div class="Knowledges-page-right-content-item-desc">
                        <p>{{ item.authorName }} {{ item.tags }}</p>
                        <p>{{ item.summary }}</p>
                        <span> 发布时间： {{ item.publishedAt }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 分页 -->
    <div class="Knowledges-page-pagination">
        <el-pagination layout="total, prev, pager, next, jumper" :total="pageForm.total" :page-size="pageForm.size"
            :current-page="pageForm.currentPage" @current-change="handlePageChange(val)" />
    </div>
</div>
</template>

<script setup>
import { getKnowledges } from '@/apis/user/knowledges'
import { Histogram } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'

const knowledges = ref([])

// 分页
const pageForm = ref({
    currentPage: 1,
    size: 5,
    total: 0
})

const articleForm = ref({
    sortField: '',
    sortDirection: '',
})

const handlePageChange = (val) => {
    pageForm.value.currentPage = val
    fetchKnowledges()
}

const fetchKnowledges = async () => {
    const res = await getKnowledges({
        ...pageForm.value,
        ...articleForm.value
    })
    knowledges.value = res.records || []
    pageForm.value.total = res.total
    console.log(res)
}

const handleCoverImage = (coverImage) => {
    return coverImage ? 'http://159.75.169.224:2235' + coverImage : 'https://file.inedo.com/ps/ajq9pi'
}

onMounted(() => {
    fetchKnowledges()
})


</script>

<style lang="scss" scoped>
.Knowledges-page {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
}

.Knowledges-page-header {
    margin-bottom: 20px;
    margin-top: 0;
    height: 100px;
    width: 100;
    border-radius: 10px;
    // 渐变
    background: linear-gradient(to bottom, #79a1dc, #e38787);

    &-title {
        // 垂直居中
        line-height: 100px;
        margin-left: 20px ;
        font-size: 40px;
        font-weight: 700;
        color: #ececec;
    }
}

.Knowledges-page-content {
    display: flex;
    gap: 24px;
    align-items: flex-start;
    margin: 20px;
}

.Knowledges-page-left {
    width: 260px;
    height: 100%;
    flex-shrink: 0;
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

    &-title {
        font-size: 18px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #ebeef5;
    }

    &-content {
        height: 605px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        overflow: auto;

        &-item {
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 16px;
            border-radius: 10px;
            border: 1px solid #ebeef5;
            transition: all 0.3s;
            cursor: pointer;

            &:hover {
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
                border-color: #c6e2ff;
                background: #f5f9ff;
            }
        }

    }
}


.Knowledges-page-right {
    flex: 1;
    min-width: 0;
    background: #fff;
    border-radius: 12px;
    padding: 20px;

    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

    &-title {
        font-size: 18px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #ebeef5;
    }

    &-content {
        display: flex;
        flex-direction: column;
        gap: 16px;

        &-item {
            display: flex;
            gap: 16px;
            padding: 16px;
            border-radius: 10px;
            border: 1px solid #ebeef5;
            transition: all 0.3s;
            cursor: pointer;

            &:hover {
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
                border-color: #c6e2ff;
                background: #f5f9ff;
            }

            .el-image {
                width: 100px;
                height: 70px;
                flex-shrink: 0;
                border-radius: 8px;
                overflow: hidden;

                :deep(img) {
                    object-fit: cover;
                }
            }

            &-title {
                h2 {
                    font-size: 16px;
                    font-weight: 600;
                    color: #303133;
                    margin: 0 0 8px;
                    line-height: 1.4;
                }
            }

            &-desc {
                flex: 1;

                p {
                    font-size: 13px;
                    color: #909399;
                    margin: 0 0 6px;
                    line-height: 1.5;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    overflow: hidden;

                    &:first-child {
                        color: #606266;
                    }
                }

                span {
                    font-size: 12px;
                    color: #c0c4cc;
                }
            }
        }
    }
}

.Knowledges-page-pagination {
    display: flex; // 分页组件居中
    justify-content: center;
}
</style>