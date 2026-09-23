<template>
  <el-card shadow="hover" header="cropper 图片裁剪">
    <div class="croppers-container">
      <div class="img-cropper">
        <img ref="imgRef" :src="cropperImg" />
      </div>
      <div class="img-preview"></div>
    </div>
    <div style="margin-top: 20px">
      <el-button type="primary" @click="handleUpload">选择图片</el-button>
      <el-button type="primary" @click="handleDownload">下载图片</el-button>
      <input ref="fileRef" style="display: none" type="file" accept="image/*" @change="handleFileChange" />
    </div>
  </el-card>
</template>

<script setup lang="ts" name="Cropper">
import { onMounted, ref } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

const imgRef = ref<HTMLImageElement | null>(null)
const fileRef = ref<HTMLInputElement | null>(null)
const cropperImg = ref<string>('/avatar.png')
const cropper = ref<Cropper | null>(null)

/** 初始化裁剪器 */
function initCropper() {
  if (!imgRef.value) return
  cropper.value = new Cropper(imgRef.value, {
    viewMode: 1,
    dragMode: 'none',
    initialAspectRatio: 1,
    background: true,
    autoCropArea: 0.8,
    aspectRatio: 1,
    preview: '.img-preview'
  })
}

/** 选择图片 */
function handleUpload() {
  fileRef.value?.click()
}

/** 文件选择变化 */
function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || !cropper.value) return

  const objectUrl = URL.createObjectURL(file)
  cropper.value.replace(objectUrl)
}

/** 下载裁剪后的图片 */
function handleDownload() {
  if (!cropper.value) return

  cropper.value.getCroppedCanvas().toBlob(blob => {
    if (!blob) return
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', '')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    // 释放对象 URL
    URL.revokeObjectURL(link.href)
  })
}

// 组件挂载后初始化裁剪器
onMounted(() => {
  initCropper()
})
</script>

<style scoped lang="scss">
.croppers-container {
  display: flex;
  justify-items: center;
}
.img-cropper {
  width: 600px;
  height: 400px;
}
.img-preview {
  width: 400px;
  height: 400px;
  overflow: hidden;
  margin: auto;
}
</style>
