<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const excludeRef = ref([])

router.afterEach((to) => {
  if (to.meta.noCache) {
    if (!excludeRef.value.includes(to.name)) {
      excludeRef.value.push(to.name)
    }
  }
})
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive :exclude="excludeRef">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
