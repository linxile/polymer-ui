<script setup lang="ts" name="Redirect">
import { onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 组件挂载前，重定向到原路径
onBeforeMount(() => {
  const { params, query } = route
  const path = params.path as string
  router.replace({ path: '/' + path, query }).catch(err => {
    console.warn(err)
  })
})
</script>

<template>
  <div></div>
</template>
