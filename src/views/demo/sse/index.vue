<template>
  <div>
    <h1>实时消息推送</h1>
    <ul>
      <li v-for="(message, index) in messages" :key="index">{{ message }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts" name="SseDemo">
import { onMounted, onUnmounted, ref } from 'vue'

/** SSE 消息 */
interface SseMessage {
  /** 推送者名称 */
  agentName?: string
  /** 消息内容 */
  msg?: string
  [key: string]: any
}

/** 接收到的消息列表 */
const messages = ref<string[]>([])

/** EventSource 实例 */
let eventSource: EventSource | null = null

/** 初始化 SSE 连接 */
function initSSE() {
  eventSource = new EventSource('http://localhost:8081/polymer/message/sse/connect/1')

  eventSource.onmessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data) as SseMessage
      messages.value.push(`${data.agentName}: ${data.msg}`)
    } catch (error) {
      console.error('SSE 消息解析失败:', error, '原始数据:', event.data)
    }
  }

  eventSource.onerror = (error: Event) => {
    console.error('SSE error:', error)
    eventSource?.close()
  }
}

/** 关闭 SSE 连接 */
function closeSSE() {
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
}

onMounted(() => {
  initSSE()
})

onUnmounted(() => {
  closeSSE()
})
</script>

<style scoped>
h1 {
  color: #333;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  background: #eee;
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
}
</style>
