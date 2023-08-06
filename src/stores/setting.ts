// layout组件相关配置仓库
import { defineStore } from "pinia"
import { computed, ref } from "vue"

export const useLayoutSettingStore = defineStore('SettingStore', () => {
  // 判断Layout是否折叠的数据
  const fold = ref(false)
  const changeFold = () => {
    fold.value = !fold.value
  }

  // 判断是否点击刷新的数据
  const refresh = ref(false)
  const changeRefresh = () => {
    refresh.value = !refresh.value
  }

  return { fold, changeFold, refresh, changeRefresh }
})

export default useLayoutSettingStore