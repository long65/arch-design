import { ref, watch } from 'vue'

export const bindArray = <T>(target: T[], getModels: (e: T[]) => Array<any>) => {
  const res = ref(getModels(target))
  watch(target, (newVal) => {
    const newArr = getModels(newVal)
    res.value = newArr
  })
  return res
}
