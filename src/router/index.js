import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    role: ['admin','editor']     will control the page role (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/index',
  //   meta: { role: ['admin'] },
  //   children: [{
  //     path: 'index',
  //     component: _import('permission/index'),
  //     name: 'permission',
  //     meta: {
  //       title: 'permission',
  //       icon: 'lock',
  //       role: ['admin']
  //     }
  //   }]
  // },

  // {
  //   path: '/components',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'component-demo',
  //   meta: {
  //     title: 'components',
  //     icon: 'component'
  //   },
  //   children: [
  //     { path: 'tinymce', component: _import('components-demo/tinymce'), name: 'tinymce-demo', meta: { title: 'tinymce' }},
  //     { path: 'markdown', component: _import('components-demo/markdown'), name: 'markdown-demo', meta: { title: 'markdown' }},
  //     { path: 'json-editor', component: _import('components-demo/jsonEditor'), name: 'jsonEditor-demo', meta: { title: 'jsonEditor' }},
  //     { path: 'dnd-list', component: _import('components-demo/dndList'), name: 'dndList-demo', meta: { title: 'dndList' }},
  //     { path: 'splitpane', component: _import('components-demo/splitpane'), name: 'splitpane-demo', meta: { title: 'splitPane' }},
  //     { path: 'avatar-upload', component: _import('components-demo/avatarUpload'), name: 'avatarUpload-demo', meta: { title: 'avatarUpload' }},
  //     { path: 'dropzone', component: _import('components-demo/dropzone'), name: 'dropzone-demo', meta: { title: 'dropzone' }},
  //     { path: 'sticky', component: _import('components-demo/sticky'), name: 'sticky-demo', meta: { title: 'sticky' }},
  //     { path: 'count-to', component: _import('components-demo/countTo'), name: 'countTo-demo', meta: { title: 'countTo' }},
  //     { path: 'mixin', component: _import('components-demo/mixin'), name: 'componentMixin-demo', meta: { title: 'componentMixin' }},
  //     { path: 'back-to-top', component: _import('components-demo/backToTop'), name: 'backToTop-demo', meta: { title: 'backToTop' }}
  //   ]
  // },

  {
    path: '/member',
    component: Layout,
    redirect: 'noredirect',
    name: 'member',
    meta: {
      title: 'member',
      icon: 'peoples'
    },
    children: [
      { path: 'memberlist', component: _import('member/memberlist'), name: 'memberList', meta: { title: 'memberList', noCache: true }},
      { path: 'certification', component: _import('member/certification'), name: 'certification', meta: { title: 'certification', noCache: true }}
    ]
  },

  {
    path: '/recharge',
    component: Layout,
    redirect: 'noredirect',
    name: 'recharge',
    meta: {
      title: 'recharge',
      icon: 'money'
    },
    children: [
      { path: 'memberStorageValue', component: _import('recharge/memberStorageValue'), name: 'memberStorageValue', meta: { title: 'memberStorageValue', noCache: true }},
      { path: 'memberPoints', component: _import('recharge/memberPoints'), name: 'memberPoints', meta: { title: 'memberPoints', noCache: true }},
      // { path: 'store', component: _import('recharge/store'), name: 'store', meta: { title: 'store', noCache: true }},
      { path: 'limit', component: _import('recharge/limit'), name: 'limit', meta: { title: 'limit', noCache: true }}
    ]
  },

  {
    path: '/order',
    component: Layout,
    redirect: 'noredirect',
    name: 'order',
    meta: {
      title: 'order',
      icon: 'form'
    },
    children: [
      { path: 'allOrder', component: _import('order/allOrder'), name: 'allOrder', meta: { title: 'allOrder', noCache: true }},
      { path: 'consumptionTask', component: _import('order/consumptionTask'), name: 'consumptionTask', meta: { title: 'consumptionTask', noCache: true }},
      { path: 'claimAward', component: _import('order/claimAward'), name: 'claimAward', meta: { title: 'claimAward', noCache: true }}
    ]
  },

  {
    path: '/store',
    component: Layout,
    redirect: 'noredirect',
    name: 'store',
    meta: {
      title: 'store',
      icon: 'international'
    },
    children: [
      { path: 'storelist', component: _import('store/storelist'), name: 'storelist', meta: { title: 'storelist', noCache: true }},
      { path: 'storeadd', component: _import('store/storeadd'), name: 'storeadd', meta: { title: 'storeadd', noCache: true }},
      { path: 'storestaff', component: _import('store/storestaff'), name: 'storestaff', meta: { title: 'storestaff', noCache: true }}
    ]
  },

  {
    path: '/commodity',
    component: Layout,
    redirect: 'noredirect',
    name: 'commodity',
    meta: {
      title: 'commodity',
      icon: 'shoppingCard'
    },
    children: [
      { path: 'commoditylist', component: _import('commodity/commoditylist'), name: 'commoditylist', meta: { title: 'commoditylist', noCache: true }},
      { path: 'commodityadd', component: _import('commodity/commodityadd'), name: 'commodityadd', meta: { title: 'commodityadd', noCache: true }},
      { path: 'commoditytype', component: _import('commodity/commoditytype'), name: 'commoditytype', meta: { title: 'commoditytype', noCache: true }}
    ]
  },

  {
    path: '/supplier',
    component: Layout,
    redirect: 'noredirect',
    name: 'supplier',
    meta: {
      title: 'supplier',
      icon: 'component'
    },
    children: [
      { path: 'supplierlist', component: _import('supplier/supplierlist'), name: 'supplierlist', meta: { title: 'supplierlist', noCache: true }},
      { path: 'supplieradd', component: _import('supplier/supplieradd'), name: 'supplieradd', meta: { title: 'supplieradd', noCache: true }}
    ]
  },

  {
    path: '/sale',
    component: Layout,
    redirect: 'noredirect',
    name: 'sale',
    meta: {
      title: 'sale',
      icon: 'star'
    },
    children: [
      { path: 'salelist', component: _import('sale/salelist'), name: 'salelist', meta: { title: 'salelist', noCache: true }},
      { path: 'saleinfo', component: _import('sale/saleinfo'), name: 'saleinfo', meta: { title: 'saleinfo', noCache: true }}
    ]
  },

  {
    path: '/stock',
    component: Layout,
    redirect: 'noredirect',
    name: 'stock',
    meta: {
      title: 'stock',
      icon: 'chart'
    },
    children: [
      { path: 'stocklist', component: _import('stock/stocklist'), name: 'stocklist', meta: { title: 'stocklist', noCache: true }},
      { path: 'stocksearch', component: _import('stock/stocksearch'), name: 'stocksearch', meta: { title: 'stocksearch', noCache: true }},
      { path: 'stockwarning', component: _import('stock/stockwarning'), name: 'stockwarning', meta: { title: 'stockwarning', noCache: true }}
    ]
  },

  {
    path: '/content',
    component: Layout,
    redirect: 'noredirect',
    name: 'content',
    meta: {
      title: 'content',
      icon: 'documentation'
    },
    children: [
      { path: 'articleStyles', component: _import('content/articleStyles'), name: 'articleStyles', meta: { title: 'articleStyles', noCache: true }},
      { path: 'article', component: _import('content/article'), name: 'article', meta: { title: 'article', noCache: true }},
      { path: 'carousel', component: _import('content/carousel'), name: 'carousel', meta: { title: 'carousel', noCache: true }},
      // { path: 'storeInfo', component: _import('content/storeInfo'), name: 'storeInfo', meta: { title: 'storeInfo', noCache: true }},
      { path: 'memberInfo', component: _import('content/memberInfo'), name: 'memberInfo', meta: { title: 'memberInfo', noCache: true }}
    ]
  },

  {
    path: '/system',
    component: Layout,
    redirect: 'noredirect',
    name: 'system',
    meta: {
      title: 'system',
      icon: 'component'
    },
    children: [
      { path: 'parameter', component: _import('system/parameter'), name: 'parameter', meta: { title: 'parameter', noCache: true }},
      // { path: 'homeCarousel', component: _import('system/homeCarousel'), name: 'homeCarousel', meta: { title: 'homeCarousel', noCache: true }},
      // { path: 'threeShoppingAreas', component: _import('system/threeShoppingAreas'), name: 'threeShoppingAreas', meta: { title: 'threeShoppingAreas', noCache: true }},
      // { path: 'homeAdverArea', component: _import('system/homeAdverArea'), name: 'homeAdverArea', meta: { title: 'homeAdverArea', noCache: true }},
      // { path: 'homeInfoArea', component: _import('system/homeInfoArea'), name: 'homeInfoArea', meta: { title: 'homeInfoArea', noCache: true }},
      // { path: 'gameZone', component: _import('system/gameZone'), name: 'gameZone', meta: { title: 'gameZone', noCache: true }},
      { path: 'release', component: _import('system/release'), name: 'release', meta: { title: 'release', noCache: true }}
    ]
  },

  {
    path: '/team',
    component: Layout,
    redirect: 'noredirect',
    name: 'team',
    meta: {
      title: 'team',
      icon: 'lock'
    },
    children: [
      { path: 'list', component: _import('team/list'), name: 'list', meta: { title: 'list', noCache: true }},
      { path: 'powerGroup', component: _import('team/powerGroup'), name: 'powerGroup', meta: { title: 'powerGroup', noCache: true }}
    ]
  },
  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'errorPages',
  //   meta: {
  //     title: 'errorPages',
  //     icon: '404'
  //   },
  //   children: [
  //     { path: '401', component: _import('errorPage/401'), name: 'page401', meta: { title: 'page401', noCache: true }},
  //     { path: '404', component: _import('errorPage/404'), name: 'page404', meta: { title: 'page404', noCache: true }}
  //   ]
  // },

  { path: '*', redirect: '/404', hidden: true }
]
