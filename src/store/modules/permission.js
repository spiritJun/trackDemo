import {constantRouterMap, asyncRouterMap} from '@/router'

const permission = {
    state: {
        routers: asyncRouterMap.concat(constantRouterMap),
        addRouters: [],
        hasRouter: false, // 菜单和路由是否已经加载
        permissionListAll: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => { // 設置路由
            state.addRouters = routers;
            state.routers = asyncRouterMap.concat(routers);
        },
        SET_HAS_ROUTER: (state, hasRouter) => { // 改变菜单和路由的加载状态
            state.hasRouter = hasRouter;
        },
        SET_PERLIST: (state, perList) => {
            state.permissionListAll = perList
        }
    },
    actions: {
        /**
         * 加载动态菜单和路由
         */
        getRoutes({commit}) {
            return new Promise((resolve, reject) => {
              resolve()
            });
        },
        GenerateRoutes({commit}) {
            return new Promise(resolve => {
                // return getLimit('all-Limits');
                resolve()
            })
        }
    }
}

export default permission
