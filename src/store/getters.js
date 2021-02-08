const getters = {
    sidebar: state => state.app.sidebar,
    leftNavState: state => state.app.leftNavState,
    themeActiveName: state => state.app.themeActiveName,
    device: state => state.app.device,
    ssid: state => state.user.ssid,
    userInfo: state => state.user.userInfo,
    menuRouteLoaded: state => state.permission.menuRouteLoaded,
    hasRouter: state => state.permission.hasRouter,
    permission_routers: state => state.permission.routers,
    expireTime: state => state.user.expireTime,
    auditStatus: state => state.user.auditStatus,
    permissionListAll: state => state.permission.permissionListAll,
    checkedUserName: state => state.user.checkedUserName,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
}
export default getters
