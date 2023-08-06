// 自定义指令：判断用户是否拥有按钮权限
export const btnPermission = {
  install(app: any) {
    app.directive('has-btn', {
      mounted(el: any, options: any) {
        // 每次重新渲染页面都从session中拿一下用户btns数据
        const { btns } = JSON.parse((sessionStorage.getItem('User') as string))
        // 如果按钮自定义指令的值不在用户信息btns中，则直接删除此按钮节点
        if (!btns.includes(options.value)) {
          el.parentNode.removeChild(el)
        }
      }
    })
  }
}