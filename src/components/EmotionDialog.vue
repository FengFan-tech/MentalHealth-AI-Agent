<template>
    <div class="emotion-dialog">
        <el-dialog title="情感分析详情" v-model="dialogVisible" width="50%">
            <template #footer>
                <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { computed } from 'vue';
import { defineEmits } from 'vue';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    rowData: {
        type: Object,
        default: () => {}
    }
})

const emit = defineEmits(['update:visible']);

const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
})
</script>