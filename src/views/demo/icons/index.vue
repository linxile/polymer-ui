<template>
  <el-card :header="`点击图标即可复制代码，已提供的图标：${iconList.length}个`">
    <el-row class="iconfont-row">
      <el-col
          v-for="(icon, key) in iconList"
          :key="key"
          class="iconfont-item"
          :xs="12"
          :sm="8"
          :md="6"
          :lg="4"
          :xl="2"
      >
        <div class="iconfont-warp" @click="handleCopy(icon)">
          <svg-icon :icon="icon" class-name="svg-size" />
          <p>{{ icon }}</p>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts" name="IconFont">
import { useClipboard } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { getIconList } from '@/utils/tool'

/** 图标列表 */
const iconList = getIconList()

const { copy } = useClipboard()

/**
 * 复制图标代码
 * @param icon 图标名称
 */
function handleCopy(icon: string) {
  const svgIcon = `<svg-icon icon="${icon}"></svg-icon>`
  copy(svgIcon)
  ElMessage.success('已复制')
}
</script>

<style scoped lang="scss">
:deep(.svg-size) {
  width: 30px !important;
  height: 30px !important;
  margin-bottom: 10px;
}
.iconfont-row {
  border-top: 1px solid var(--theme-border-color-light);
  border-left: 1px solid var(--theme-border-color-light);
}
.iconfont-item {
  text-align: center;
  border-right: 1px solid var(--theme-border-color-light);
  border-bottom: 1px solid var(--theme-border-color-light);
  height: 120px;
  overflow: hidden;
  display: flex;
  transition: all 0.3s ease;
  justify-content: space-around;
  cursor: pointer;
  &:hover {
    background-color: var(--el-border-color-extra-light);
  }
}
.iconfont-warp {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}
</style>
