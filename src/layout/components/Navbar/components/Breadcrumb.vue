<template>
  <el-breadcrumb separator="/" :separator-icon="ArrowRight" class="navbar-breadcrumb">
    <el-breadcrumb-item key="home">
      <span>{{ $t('router.home') }}</span>
    </el-breadcrumb-item>
    <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">
      <span>{{ item }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts" name="NavbarBreadcrumb">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'

const route = useRoute()

/** 面包屑列表 */
const breadcrumb = computed<string[]>(() => {
  const meta = route.meta.breadcrumb
  return Array.isArray(meta) ? meta : []
})
</script>

<style lang="scss" scoped>
.navbar-breadcrumb {
	::v-deep(.el-breadcrumb__inner) {
		color: var(--theme-header-text-color) !important;
	}
	padding-left: 10px;
}
</style>
