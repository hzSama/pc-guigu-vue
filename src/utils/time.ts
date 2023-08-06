// 封装判断时段工具函数
export const getTime = () => {
  let msg = ''
  const h = new Date().getHours()
  if (h <= 9) {
    msg = '早上'
  } else if (h <= 12) {
    msg = '上午'
  } else if (h <= 18) {
    msg = '下午'
  } else {
    msg = '晚上'
  }
  return msg
}