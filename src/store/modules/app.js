import Cookies from 'js-cookie'

import { setthemeActiveName,getthemeActiveName } from '@/utils/auth'
console.log(!+Cookies.get('sidebarStatus'),'3543')
const app = {
    state: {
        sidebar: {
            opened: !+Cookies.get('sidebarStatus'),
            withoutAnimation: false
        },
        device: 'desktop',
        systemInfo: null,  //判断为绥德还是crm平台
        leftNavState:'',  // 当该值与router的根路由的name相等时加载相应菜单组
    },
    mutations: {
        TOGGLE_SIDEBAR: state => {
            if (state.sidebar.opened) {
                Cookies.set('sidebarStatus', 1)
            } else {
                Cookies.set('sidebarStatus', 0)
            }
            state.sidebar.opened = !state.sidebar.opened
            state.sidebar.withoutAnimation = false
        },
        CLOSE_SIDEBAR: (state, withoutAnimation) => {
            Cookies.set('sidebarStatus', 1)
            state.sidebar.opened = false
            state.sidebar.withoutAnimation = withoutAnimation
        },
        TOGGLE_DEVICE: (state, device) => {
            state.device = device
        },
        SYSTEM_INFO: (state, systemInfo) => {
            state.systemInfo = systemInfo;
        },
        UPDATE_LEFTNAVSTATe:(state, leftNavState) => {
            state.leftNavState = leftNavState;
        },
    },
    actions: {
        ToggleSideBar: ({commit}) => {
            commit('TOGGLE_SIDEBAR')
        },
        CloseSideBar({commit}, {withoutAnimation}) {
            commit('CLOSE_SIDEBAR', withoutAnimation)
        },
        ToggleDevice({commit}, device) {
            commit('TOGGLE_DEVICE', device)
        },
        getSystemInfo({commit}, systemInfo) {
            commit('SYSTEM_INFO', systemInfo)
        },
        updateleftNavState({commit}, leftNavState) {
            commit('UPDATE_LEFTNAVSTATe', leftNavState)
        }
    }
}

export default app
