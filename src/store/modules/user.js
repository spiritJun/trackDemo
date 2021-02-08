import $api from '@/api/api'
import {
    setUserName,
    setROLE,
    setSSID,
    setToken,
    removeToken,
    setContractDialog,
    removeContractDialog,
    removeExportNumbers,
    setExpireTime,
    getAuditStatus,
    setAuditStatus,
    removeUserChecked,
    setUserChecked,
    setLoginUserName,
    removeLoginUserName
} from '@/utils/auth'


const user = {
    state: {
        userInfo: '',
        key: '',
        ssid: '',
        expireTime: 0,
        auditStatus: getAuditStatus()?getAuditStatus():1,
        checkedUserName: false,
        LoginuserName: '',
    },

    mutations: {
        SET_USERINFO: (state, userInfo) => {
            state.userInfo = userInfo
        },
        SET_KEY: (state, key) => {
            state.key = key
        },
        SET_SSID: (state, ssid) => {
            state.ssid = ssid
        },
        SET_EXPIRE_TIME: (state, expire) => {
            state.expireTime = expire
        },
        SET_AUDIT_STATUS: (state, auditStatus) => {
            setAuditStatus(auditStatus)
            state.auditStatus = auditStatus
        },
        // 记住用户名
        remmber(state, remberInfo) {
            if(remberInfo.checkedUserName) {
                setUserChecked(remberInfo.checkedUserName)
                setLoginUserName(remberInfo.userName)
            } else {
                removeUserChecked('checkedUserName')
                removeLoginUserName('LoginuserName')
            }
        },
    },

    actions: {
        // 登录
        Login({commit}, userInfo) {
            return new Promise((resolve, reject) => {
                $api.login.login(userInfo).then(response => {
                    const data = response.data;
                    if (data.code === 0) {
                        const res = data.data;
                        setToken(res.key);
                        setContractDialog(true);
                        setSSID(res.ssid);
                        setExpireTime(res.expired)
                        commit('SET_KEY', res.key); // 保存key
                        commit('SET_SSID', res.ssid); // 保存ssid
                        //  resolve('success')
                        commit('SET_EXPIRE_TIME', res.expired); // 保存expire
                        commit('updateContractDialog',true);
                    }
                    resolve(response);
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息
        GetUserInfo({commit, state}) {
            return new Promise((resolve, reject) => {
                $api.login.getInfo(state.token).then(response => {
                    const data = response.data;
                    // if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                    //     commit('SET_ROLES', data.roles)
                    // } else {
                    //     reject('getInfo: roles must be a non-null array !')
                    // }
                    if (data.code === 0) {
                        const res = data.data;
                        setUserName(res.userName);
                        setROLE(res.roleList);
                        commit('SET_USERINFO', res);
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 登出
        LogOut({commit, state}) {
            return new Promise((resolve, reject) => {
                $api.login.logout().then(res => {
                    const data = res.data;
                    if (data.code === 0) {
                        removeToken();
                        /* 首页弹框控制 */
                        removeContractDialog();
                        commit('updateContractDialog',false);
                        /* 重置导出数量的数据 */ 
                        removeExportNumbers();
                        resolve()
                    }
                }).catch(error => {
                    removeToken()
                    reject(error)
                })
            })
        }
    }
};

export default user
