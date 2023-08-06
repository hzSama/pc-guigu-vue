/// <reference types="vite/client" />


// declare module "*.vue" {
//   import { ComponentOptions } from "vue"

//   const componentOptions: ComponentOptions

//   export default componentOptions
// }

declare module "*.vue" {

  import type { DefineComponent } from "vue"

  const vueComponent: DefineComponent<{}, {}, any>

  export default vueComponent

}

declare module 'element-plus'
