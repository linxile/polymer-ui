import { defineStore } from 'pinia'

/** localStorage 键名：锁屏状态 */
const LOCK_KEY = 'screen-lock'
/** localStorage 键名：锁屏返回路径 */
const LOCK_PATH_KEY = 'screen-lock-path'

/** 锁屏状态 */
interface LockState {
  /** 是否锁屏 */
  isLock: boolean
  /** 锁屏后解锁返回的路径 */
  lockPath: string
}

/**
 * 从 localStorage 读取锁屏状态
 */
function getLockFromStorage(): boolean {
  try {
    return JSON.parse(localStorage.getItem(LOCK_KEY) || 'false') === true
  } catch {
    return false
  }
}

export const useLockStore = defineStore('lock', {
  state: (): LockState => ({
    isLock: getLockFromStorage(),
    lockPath: localStorage.getItem(LOCK_PATH_KEY) || '/index'
  }),
  actions: {
    /**
     * 锁定屏幕，同时记录当前路径
     * @param currentPath 当前路径，解锁后返回
     */
    lockScreen(currentPath: string) {
      this.lockPath = currentPath || '/index'
      localStorage.setItem(LOCK_PATH_KEY, this.lockPath)
      this.isLock = true
      localStorage.setItem(LOCK_KEY, 'true')
    },
    /**
     * 解锁屏幕，清除路径
     */
    unlockScreen() {
      this.isLock = false
      localStorage.setItem(LOCK_KEY, 'false')
      this.lockPath = '/index'
      localStorage.setItem(LOCK_PATH_KEY, '/index')
    }
  }
})

export default useLockStore
