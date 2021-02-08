
import Vue from 'vue'
import Router from 'vue-router'
import TopNav from '@/views/layout/components/topNav.vue'
import LeftNav from '@/views/layout/components/leftNav.vue'
import Layout from '@/views/layout'
import Dashboard from '@/views/workbench/dashboard.vue'
import AlreadyPriceLine from '@/views/workbench/alreadyPriceLine.vue'
import DistributingLine from '@/views/workbench/distributingLine.vue'
import SetDate from '@/views/workbench/setDate.vue'
import BiddingHall from '@/views/bidding/biddingHall.vue'
import BiddingRecord from '@/views/bidding/biddingRecord.vue'
//轨迹相关
import TrackSearch from '@/views/trackManage/trackSearch';

import MySettings from '@/views/workbench/mySettings.vue'
import Plan from '@/views/workbench/plan.vue'
import EnterpriseList from '@/views/enterprise/index.vue'
import EnterpriseAdd from '@/views/enterprise/add.vue'
import { getUrlKey } from '@/utils'
import Cookies from 'js-cookie'
// 懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/views/login'], resolve)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)

export const constantRouterMap = [ // 静态路由
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index'),
        hidden: true,
      }
    ]
  },
  { path: '/login', name: 'login', component: () => import('@/views/login/index'), hidden: true },
  {
    path: '/auth-redirect',
    name: 'auth-redirect',
    component: () => import('@/views/login/authRedirect'),
    hidden: true
  },
  { path: '*', name: '404', component: () => import('@/views/error/404'), hidden: true },
  { path: '/400', name: 'error_400', component: () => import('@/views/error/400'), hidden: true },
  { path: '/401', name: 'error_401', component: () => import('@/views/error/401'), hidden: true },
  { path: '/403', name: 'error_403', component: () => import('@/views/error/403'), hidden: true },
  { path: '/404', name: 'error_404', component: () => import('@/views/error/404'), hidden: true },
  { path: '/408', name: 'error_408', component: () => import('@/views/error/408'), hidden: true },
  { path: '/500', name: 'error_500', component: () => import('@/views/error/500'), hidden: true },
  { path: '/501', name: 'error_501', component: () => import('@/views/error/501'), hidden: true },
  { path: '/502', name: 'error_502', component: () => import('@/views/error/502'), hidden: true },
  { path: '/503', name: 'error_503', component: () => import('@/views/error/503'), hidden: true },
  { path: '/504', name: 'error_504', component: () => import('@/views/error/504'), hidden: true },
  { path: '/505', name: 'error_505', component: () => import('@/views/error/505'), hidden: true },
];

// 注：路由的一级需要包含topname，需与type值相同，后端如果不返回，前端想办法处理，到时再根据具体情况看
// 管理员路由
const asyncAdminRouterMap = [
  {
    path: '/',
    type: 'home',
    name: '竞标管理',
    topname: 'home',
    redirect: '/dashboard',
    component: Layout,
    children: [
      {
        path: '/dashboard',
        name: '我的竞标',
        components: {
          default: Dashboard,
          top: TopNav,
          aside: LeftNav
        },
        iconCls: 'icon iconfont iconjingpai', // 图标样式class
        menuShow: true
      },
      {
        path: '/alreadypriceline',
        name: '已标价线路',
        components: {
          default: AlreadyPriceLine,
          top: TopNav,
          aside: LeftNav
        },
        iconCls: 'icon iconfont iconjingpai', // 图标样式class
        menuShow: true
      },
      {
        path: '/distributingline',
        name: '分配竞标线路',
        components: {
          default: DistributingLine,
          top: TopNav,
          aside: LeftNav
        },
        iconCls: 'icon iconfont iconfenpei', // 图标样式class
        menuShow: true
      },
      {
        path: '/setdate',
        name: '设置竞标有效期',
        components: {
          default: SetDate,
          top: TopNav,
          aside: LeftNav
        },
        iconCls: 'icon iconfont iconshezhi2',
        menuShow: true,
      }
    ]
  },
]
// 派单员路由
const asyncSenderRouterMap = [
  {
    path: '/',
    type: 'home',
    name: '竞标大厅',
    topname: 'home',
    redirect: '/dashboard',
    component: Layout,
    children: [
      {
        path: '/dashboard',
        name: '我的竞标',
        components: {
          default: Dashboard,
          top: TopNav,
          aside: LeftNav
        },
        iconCls: 'icon iconfont iconjingpai', // 图标样式class
        menuShow: true
      },
      {
        path: '/biddingHall',
        components: {
          default: BiddingHall,
          top: TopNav,
          aside: LeftNav
        },
        name: '竞标大厅',
        iconCls: 'icon iconfont iconjingbiaodating',
        menuShow: true,
      },
      {
        path: '/biddingRecord',
        components: {
          default: BiddingRecord,
          top: TopNav,
          aside: LeftNav
        },
        name: '竞标记录',
        iconCls: 'icon iconfont iconshezhishijian',
        menuShow: true,
      }
    ]
  },
]
//轨迹路由
const asyncTrack = [
  {
    path: '/trail',
    type: 'trail',
    name: '运输监控',
    topname: 'trail',
    redirect: '/trail',
    component: Layout,
    children: [
      {
        path: '/trail',
        name: '轨迹查询',
        components: {
          default: TrackSearch,
          top: TopNav,
          aside: LeftNav
        },
        iconCls: 'icon iconfont iconlight3', // 图标样式class
        menuShow: true
      },
    ]
  },
]
/**
 * userType: 1：管理员，18：派单员
 */
let userType = getUrlKey('userType', window.location.href)
let userId = getUrlKey('userId', window.location.href)
let userName = getUrlKey('userName', window.location.href)
if (userType) {
  Cookies.set('userType', userType)
} else {
  userType = Cookies.get('userType')
}
if (userId) {
  Cookies.set('userId', userId)
} else {
  userId = Cookies.get('userId')
}
if (userName) {
  Cookies.set('userName', userName)
} else {
  userName = Cookies.get('userName')
}


export const asyncRouterMap = userType == 1 ? asyncAdminRouterMap.concat(asyncTrack) : asyncSenderRouterMap.concat(asyncTrack)
let router = new Router({
  mode: 'history',
  routes: constantRouterMap.concat(asyncRouterMap)
});

export default router
