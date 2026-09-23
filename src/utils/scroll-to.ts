/**
 * 缓动函数：二次进出的缓动
 */
function easeInOutQuad(t: number, b: number, c: number, d: number): number {
  t /= d / 2
  if (t < 1) {
    return (c / 2) * t * t + b
  }
  t--
  return (-c / 2) * (t * (t - 2) - 1) + b
}

/**
 * requestAnimationFrame 兼容封装
 */
const requestAnimFrame = (function () {
  return (
      window.requestAnimationFrame ||
      (window as any).webkitRequestAnimationFrame ||
      (window as any).mozRequestAnimationFrame ||
      function (callback: FrameRequestCallback) {
        window.setTimeout(callback, 1000 / 60)
      }
  )
})()

/**
 * 滚动到指定位置
 * 不同浏览器滚动元素不同，这里同时设置多个
 */
function move(amount: number): void {
  document.documentElement.scrollTop = amount
  const parent = document.body.parentNode as HTMLElement | null
  if (parent) {
    parent.scrollTop = amount
  }
  document.body.scrollTop = amount
}

/**
 * 获取当前滚动位置
 */
function position(): number {
  const parent = document.body.parentNode as HTMLElement | null
  return (
      document.documentElement.scrollTop ||
      (parent ? parent.scrollTop : 0) ||
      document.body.scrollTop
  )
}

/**
 * 平滑滚动到指定位置
 * @param to 目标位置
 * @param duration 动画时长（毫秒），默认 500
 * @param callback 动画完成后的回调
 */
export function scrollTo(to: number, duration?: number, callback?: () => void): void {
  const start = position()
  const change = to - start
  const increment = 20
  let currentTime = 0
  const totalDuration = typeof duration === 'undefined' ? 500 : duration

  function animateScroll() {
    // 递增时间
    currentTime += increment
    // 用缓动函数计算当前位置
    const val = easeInOutQuad(currentTime, start, change, totalDuration)
    // 滚动到计算出的位置
    move(val)
    // 未到时间继续动画
    if (currentTime < totalDuration) {
      requestAnimFrame(animateScroll)
    } else if (callback && typeof callback === 'function') {
      // 动画结束，执行回调
      callback()
    }
  }

  animateScroll()
}
