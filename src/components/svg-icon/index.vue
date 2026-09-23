<template>
  <div class="svg-icon">
    <svg :class="className" :style="`color:${color};width: ${size};height: ${size}`" aria-hidden="true">
      <use :xlink:href="iconName" />
    </svg>
  </div>
</template>

<script setup lang="ts" name="SvgIcon">
import { computed } from 'vue'

interface IProps {
  /** 图标名称（如 icon-menu） */
  icon?: string
  /** 图标颜色 */
  color?: string
  /** 自定义类名 */
  className?: string
  /** 图标大小（如 20px、1em） */
  size?: string
}

const props = withDefaults(defineProps<IProps>(), {
  icon: 'icon-menu',
  color: '',
  className: '',
  size: ''
})

/** 计算 svg 的 xlink:href，iconfont 需使用 #icon- 前缀 */
const iconName = computed<string>(() => {
  const cleanIcon = props.icon.replace(/^icon-/, '')
  return cleanIcon ? `#icon-${cleanIcon}` : '#icon-database'
})
</script>

<style lang="scss" scoped>
.svg-icon {
  display: inline-block;
  svg {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    flex-shrink: 0;
  }
}
</style>
