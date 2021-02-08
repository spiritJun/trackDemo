// import { getContractDialog,getExportNumbers,setExportNumbers } from '@/utils/auth'
// import $api from '@/api/api';
export default { 
    state: {
        navTree: [],  // 导航菜单树
        menuName:'',//更新系统管理下的菜单名称--详细请看bug 5976
        ActiveAppMain:null,//激活AppMain模块 但是用的是时间戳 嘿嘿嘿~
        isShowContractDialog:true, //用于获取弹框显隐(登录完成后显示一次，后期可能会改)
        taskNumber:2 || 0,//任务数量(需要动态的修改)
        unreadNum:0,//先0吧
        isShowUrlParams: false,//是否展示url上的参数 false为不展示
    },
    getters: {},
    mutations: {
        setNavTree(state, navTree) {  // 设置导航菜单树(这个方法好像被抛弃了)
            state.navTree = navTree;
        },
        updateMenuName(state, menuName){ //更新菜单名称
            state.menuName = menuName;
        },
        updateAppMain(state,ActiveAppMain){
            state.ActiveAppMain = ActiveAppMain;
        },
        updateContractDialog(state,isShowContractDialog){
            state.isShowContractDialog = isShowContractDialog;
        },
        updateTaskNumber(state,taskNumber){
            state.taskNumber = taskNumber;
        },
        updateUnreadNum(state,unreadNum){
            state.unreadNum = unreadNum;
        },
        setUrlParams(state,isShowUrlParams){
            state.isShowUrlParams = isShowUrlParams;
        }
        
    },
    actions: {
       getExportNum({commit},taskNumber){
            return new Promise((res,rej) => {
                $api.business.getExportNumber().then(response => {
                    const data = response.data;
                    if (data.code === 0) {
                        res(data.data);
                        if(data.data*1 !== taskNumber*1 ){//&& data.data*1 !== 0
                            commit('updateTaskNumber',data.data);
                            setExportNumbers(data.data);
                        }
                        // const res = data.data;
                        // console.log(res);
                    }
                
                }).catch(error => {
                    rej(error)
                })
        })
       },
       //获取未读数量
       getUnreadNum({commit},unreadNum){
            return new Promise((res,rej) => {
                $api.business.getUnreadNum().then(response => {
                    const data = response.data;
                    if (data.code === 0) {
                        res(data.data);
                        if(data.data*1 !== unreadNum*1){
                            commit('updateUnreadNum',data.data);
                        }
                    }
                
                }).catch(error => {
                    rej(error)
                })
        })
   },
    }
}
