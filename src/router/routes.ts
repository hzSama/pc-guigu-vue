// 封装路由数组

// 常量路由：全部用户都可以访问到的路由
export const constantRoute = [
  { path: '/login', component: () => import('@/views/login/index.vue'), name: 'Login', meta: { hidden: true } },

  {
    path: '/', component: () => import('@/views/layout/index.vue'), name: 'Layout', meta: { hidden: false }, redirect: '/home',
    children: [
      { path: '/home', component: () => import('@/views/home/index.vue'), name: 'Home', meta: { hidden: false, title: '首页', icon: 'HomeFilled', needLogged: true } }
    ]
  },

  { path: '/screen', component: () => import('@/views/screen/index.vue'), name: 'Screen', meta: { hidden: false, title: '数据大屏', icon: 'Monitor', needLogged: true }, },

  { path: '/404', component: () => import('@/views/404/index.vue'), name: '404', meta: { hidden: true, needLogged: true } },


]

// 异步路由：需要权限才可以访问到
export const asyncRoute = [
  {
    path: '/acl', component: () => import('@/views/layout/index.vue'), name: 'Acl', redirect: '/acl/user', meta: { hidden: false, title: '权限管理', icon: 'Lock' },
    children: [
      { path: '/acl/user', component: () => import('@/views/acl/user/index.vue'), name: 'User', meta: { hidden: false, title: '用户管理', icon: 'User', needLogged: true } },
      { path: '/acl/role', component: () => import('@/views/acl/role/index.vue'), name: 'Role', meta: { hidden: false, title: '角色管理', icon: 'Avatar', needLogged: true } },
      { path: '/acl/permission', component: () => import('@/views/acl/permission/index.vue'), name: 'Permission', meta: { hidden: false, title: '菜单管理', icon: 'Files', needLogged: true } }
    ]
  },

  {
    path: '/product', component: () => import('@/views/layout/index.vue'), name: 'Product', redirect: '/product/trademark', meta: { hidden: false, title: '产品管理', icon: 'Goods' },
    children: [
      { path: '/product/trademark', component: () => import('@/views/product/trademark/index.vue'), name: 'Trademark', meta: { hidden: false, title: '品牌管理', icon: 'ShoppingCartFull', needLogged: true } },
      { path: '/product/attr', component: () => import('@/views/product/attr/index.vue'), name: 'Attr', meta: { hidden: false, title: '属性管理', icon: 'Document', needLogged: true } },
      { path: '/product/spu', component: () => import('@/views/product/spu/index.vue'), name: 'Spu', meta: { hidden: false, title: 'SPU管理', icon: 'Calendar', needLogged: true } },
      { path: '/product/sku', component: () => import('@/views/product/sku/index.vue'), name: 'Sku', meta: { hidden: false, title: 'SKU管理', icon: 'SetUp', needLogged: true } },
    ]
  },
]

// 任意路由：除了声明过的其它所有路由都指向404
export const anyRoute = [
  { path: '/:pathMatch(.*)*', redirect: '/404', name: 'Any', meta: { hidden: true, needLogged: true } }
]