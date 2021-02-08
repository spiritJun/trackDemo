// import router from './router'
// import store from './store'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import {getToken} from '@/utils/auth'
// NProgress.configure({showSpinner: false}); // NProgress configuration

// /**
//  * 处理路由到本地直接指定页面组件的情况
//  * 比如'首页'是要求直接绑定到'dashboard'页面组件
//  */
// function handleStaticComponent(router, dynamicRoutes) {
//     router.options.routes[0].children = router.options.routes[0].children.concat(dynamicRoutes)
// }

// /**
//  * 添加动态(菜单)路由
//  * @param {*} menuList 菜单列表
//  * @param {*} routes 递归创建的动态(菜单)路由
//  */
// function addDynamicRoutes(menuList = [], routes = []) {
//     // 递归处理children下的路由
//     function recursion(obj) {
//         if (obj.children) {
//             obj.children.forEach(item => {
//                 if (item.path !== '*') {
//                     // 创建路由配置
//                     const route = {
//                         path: item.path,
//                         component: null,
//                         name: item.authFlag || item.name, // 按钮通过权限标识标定name，菜单通过name标识
//                         meta: {
//                             title: item.meta.title,
//                             icon: item.meta.icon,
//                             parentName: obj.meta ? obj.meta.title : "dashboard",
//                             // parentIcon: obj.meta ? obj.meta.icon : "iconfont iconliebiaoxiangmu",
//                             parentPath: obj.path,
//                             permission: item.permission
//                         },
//                     };
//                     // 根据菜单path动态加载vue组件，这里要求vue组件须按照path路径存储
//                     // 如path="filiale/subCompany"，则组件路径应是"@/views/filiale/subCompany/index.vue",否则组件加载不到
//                     const array = item.path.split('/');
//                     let url = '';
//                     for (let i = 0; i < array.length; i++) {
//                         url += array[i] + '/'
//                     }
//                     url = url.substring(0, url.length - 1);
//                     route.component = resolve => require([`@/views${url}`], resolve);
//                     routes.push(route)
//                 }
//                 recursion(item);
//             });
//         }
//     }

//     menuList.forEach(item => {
//         recursion(item);
//     });
//     return routes;
// }

// /**
//  * 加载动态菜单和路由
//  */
// function addDynamicMenuAndRoutes(data) {
//     // 添加动态路由
//     const dynamicRoutes = addDynamicRoutes(data);
//     // 处理静态组件绑定路由
//     handleStaticComponent(router, dynamicRoutes);
//     router.addRoutes(router.options.routes);
// }

// const whiteList = ['/login', '/400', '/401', '/403', '/404', '/408', '/500', '/501', '/502', '/503', '/504', '/505']; // 不重定向白名单
// router.beforeEach((to, from, next) => {
//     NProgress.start();
//     // 先判断在不在白名单中，主要是考虑到登录后有cookie，再重启服务后cookie没有清除的情况下跳不到错误路由，
//     // 白名单直接next，不在白名单内的话判断是否有登录，有登陆再判断是否有路由，既不在白名单内，又没有ssid则全部重定向到登录login
//     if (whiteList.indexOf(to.path) !== -1) {
//         next()
//     } else {
//         if (!getToken()) { // 存在登录ssid
//             if (to.path === '/login' || to.path === '/login/') {
//                 next({path: '/'});
//                 NProgress.done();
//             } else {
//               console.log(store.getters.permission_routers)
//               addDynamicMenuAndRoutes(store.getters.permission_routers);
//               next({path: to.path, query: to.query});
//                 if (!store.getters.hasRouter) { // 没有路由 去获取路由数据
//                   // TODO: 先跳过获取userInfo，等有接口了再说
//                     // store.dispatch('GetUserInfo').then(res => { // 拉取user_info
//                     //     store.dispatch('getRoutes').then(() => { // 获取后台返回的权限数据
//                     //         addDynamicMenuAndRoutes(store.getters.permission_routers); // 生成可访问的路由表
//                     //         next({path: to.path, query: to.query});
//                     //         !store.state.menu.isShowUrlParams && resetUrl();//重置地址栏
//                     //         // next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
//                     //     })
//                     // })
//                   //   store.dispatch('getRoutes').then(() => { // 获取后台返回的权限数据
//                   //     console.log(store.getters.permission_routers)
//                   //     addDynamicMenuAndRoutes(store.getters.permission_routers); // 生成可访问的路由表
//                   //     next({path: to.path, query: to.query});
//                   //     !store.state.menu.isShowUrlParams && resetUrl();//重置地址栏
//                   //     // next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
//                   // })
//                 } else {
//                     next()
//                     !store.state.menu.isShowUrlParams && resetUrl();//重置地址栏
//                 }
//             }
//         } else {
//             // if (whiteList.indexOf(to.path) !== -1) {
//             //     console.log(11)
//             //     next()
//             // } else {
//             next(`/login?redirect=${to.path}`); // 否则全部重定向到登录页
//             NProgress.done()
//             // }
//         }
//     }
// });
// router.afterEach(() => {
//     NProgress.done() // 结束Progress
// });
