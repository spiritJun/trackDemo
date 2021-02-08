import request from '@/api/request'


/* ------------------------------------机构管理------------------------------------------ */

/* 机构列表查询接口 */
export function getOrgOrganizationPagePage(query) {
    return request({
        url: '/api/org/queryOrgOrganizationPage',
        method: 'get',
        params: query
    })
}

/* 获取所有机构列表接口 */
export function getAllOrgOrganization() {
    return request({
        url: '/api/org/getAllOrgOrganization',
        method: 'get'
    })
}

/* 获取所有机构列表接口 */
export function getAllOrgTypes() {
    return request({
        url: '/api/org/getAllOrgTypes',
        method: 'get'
    })
}

/* 获取所有区域接口 */
export function getAllOrgRegion() {
    return request({
        url: '/api/org/getAllOrgRegion',
        method: 'get'
    })
}

/* 添加机构 */
export function addOrgOrgan(data) {
    return request({
        url: '/api/org/addOrgOrganization',
        method: 'post',
        data
    })
}

/* 编辑机构 */
export function updateOrgOrgan(data) {
    return request({
        url: '/api/org/updateOrgOrganization',
        method: 'post',
        data
    })
}
/* 删除机构 */
export function deleteOrgOrgan(data) {
    return request({
        url: '/api/org/deleteOrgOrganization',
        method: 'post',
        data
    })
}

// 机构是否存在
export function ifHasOrg(query) {
    return request({
        url: '/api/org/checkOrgExists',
        method: 'get',
        params: query
    })
}

/* 查看机构关联农行信息接口 */
export function getOrgAccList(query) {
    return request({
        url: '/api/account/queryAbcTotalAccountInfo',
        method: 'get',
        params: query
    })
}

/* 添加农行专户接口 */
export function orgAccAdd(data) {
    return request({
        url: '/api/account/createAbcAccount',
        method: 'post',
        data
    })
}
/* 添加光大银行专户接口 */
export function createEcbAccount(data) {
    return request({
        url: '/api/account/createEcbAccount',
        method: 'post',
        data
    })
}
/* 查看机构关联光大信息接口 */
export function getCebTotalAccountInfo(query) {
    return request({
        url: '/api/account/queryCebTotalAccountInfo',
        method: 'get',
        params: query
    })
}

/* 查询区域下机构列表 */
export function getOrgListByAreaId(query) {
    return request({
        url: '/api/org/selectOrgListByAreaId',
        method: 'get',
        params: query
    })
}
/* 获取出票公司列表 */
export function getServieOrgList(query) {
    return request({
        url: '/api/org/getServieOrgList',
        method: 'get',
        params: query
    })
}
/* ------------------------------------区域管理------------------------------------------ */

/* 区域列表查询接口 */
export function getOrgRegionPage(query) {
    return request({
        url: '/api/org/queryOrgRegionPage',
        method: 'get',
        params: query
    })
}

/* 添加区域 */
export function orgRegionAdd(data) {
    return request({
        url: '/api/org/addOrgRegion',
        method: 'post',
        data
    })
}

/* 更新区域接口 */
export function orgRegionUpdate(data) {
    return request({
        url: '/api/org/updateOrgRegion',
        method: 'post',
        data
    })
}

/* 更新票源地接口 */
export function updateTicketOrgIdById(query) {
    return request({
        url: '/api/org/updateTicketOrgIdById',
        method: 'get',
        params: query
    })
}
/* 获取票源地接口 */
export function getTicketBranchOrganization(query) {
    return request({
        url: '/api/org/getTicketBranchOrganization',
        method: 'get',
        params: query
    })
}
/* ------------------------------------部门管理------------------------------------------ */

/* 部门列表查询接口 */
export function getOrgDepartmentPage(query) {
    return request({
        url: '/api/org/queryOrgDepartmentPage',
        method: 'get',
        params: query
    })
}

/* 添加部门 */
export function orgDepartmentAdd(data) {
    return request({
        url: '/api/org/addOrgDepartment',
        method: 'post',
        data
    })
}

/* 编辑部门 */
export function orgDepartmentUpdate(data) {
    return request({
        url: '/api/org/updateOrgDepartment',
        method: 'post',
        data
    })
}

/* 查询所有部门列表 */
export function getOrgDepartmentList(query) {
    return request({
        url: '/api/org/queryOrgDepartmentList',
        method: 'get',
        params: query
    })
}

/* 查看编辑部门接口 */
export function getOrgDepartment(query) {
    return request({
        url: '/api/org/getOrgDepartment',
        method: 'get',
        params: query
    })
}

/* ------------------------------------职位管理------------------------------------------ */

/* 职位列表查询接口 */
export function getOrgJobPage(query) {
    return request({
        url: '/api/org/queryOrgJobPage',
        method: 'get',
        params: query
    })
}

/* 查询所有职位接口 */
export function getOrgJobList(query) {
    return request({
        url: '/api/org/queryOrgJobList',
        method: 'get',
        params: query
    })
}

/* 添加职位 */
export function orgJobAdd(data) {
    return request({
        url: '/api/org/addOrgJob',
        method: 'post',
        data
    })
}

/* 编辑职位 */
export function orgJobUpdate(data) {
    return request({
        url: '/api/org/updateOrgJob',
        method: 'post',
        data
    })
}

/* 删除职位 */
export function orgJobDelete(data) {
    return request({
        url: '/api/org/deleteOrgJob',
        method: 'post',
        data
    })
}

/* ------------------------------------用户管理------------------------------------------ */

/* 查询用户分页接口 */
export function getOrgEmployeePage(query) {
    return request({
        url: '/api/auth/queryOrgEmployeePage',
        method: 'get',
        params: query
    })
}

/* 添加用户 */
export function orgEmployeeAdd(data) {
    return request({
        url: '/api/auth/addOrgEmployee',
        method: 'post',
        data
    })
}

/* 编辑用户 */
export function orgEmployeeUpdate(data) {
    return request({
        url: '/api/auth/updateOrgEmployee',
        method: 'post',
        data
    })
}

/* 重置密码 */
export function resetPassword(data) {
    return request({
        url: '/api/auth/resetPassword',
        method: 'post',
        data
    })
}

/* 冻结账户 */
export function fronzenUser(data) {
    return request({
        url: '/api/auth/fronzenUser',
        method: 'post',
        data
    })
}
/* 删除账户 */
export function doDeleteOrgEmployee(data) {
    return request({
        url: '/api/auth/deleteOrgEmployee',
        method: 'post',
        data
    })
}

/* 查看分管范围接口 */
// export function getOrgEmployeeOrganization(query) {
//     return request({
//         url: '/api/auth/addOrgEmployeeOrganizationByUserId',
//         method: 'get',
//         params: query
//     })
// }

/* 查看分管范围接口 */
export function getAllRangeOrgOrganization(query) {
    return request({
        url: '/api/org/getAllRangeOrgOrganization',
        method: 'get',
        params: query
    })
}

/* 根据机构列表ID查询企业列表 */
export function queryEnterpriseListByOrganIds(data) {
    return request({
        url: '/api/enterprise/queryEnterpriseListByOrganIds',
        method: 'post',
        data
    })
}



/* 获取员工分管范围信息 */
export function getOrgEmployeeManageRangeInfo(query) {
    return request({
        url: '/api/auth/getOrgEmployeeManageRangeInfo',
        method: 'get',
        params: query
    })
}
 /* 获取管辖机构 */
 export function getJurisdictionOrgan(query) {
    return request({
        url: '/api/auth/getJurisdictionOrgan',
        method: 'get',
        params: query
    })
}

/* 添加用户分管范围 */
export function addOrgEmployeeOrganization(data) {
    return request({
        url: '/api/auth/addExtendRange',
        method: 'post',
        data
    })
}

/* 批量插入用户角色接口 */
export function batchInsertRole(data) {
    return request({
        url: '/api/auth/batchInsertRoleById',
        method: 'post',
        data
    })
}

/* 根据条件查询用户列表 */
export function getOrgEmployeeList(query) {
    return request({
        url: '/api/auth/queryOrgEmployeeList',
        method: 'get',
        params: query
    })
}

/* ------------------------------------角色管理------------------------------------------ */

/* 查询角色分页接口 */
export function getRolePermissionPage(query) {
    return request({
        url: '/api/auth/querySysRolePermissionPage',
        method: 'get',
        params: query
    })
}

/* 查询所有角色列表 */
export function getRolePermissionList(query) {
    return request({
        url: '/api/auth/querySysRolePermissionList',
        method: 'get',
        params: query
    })
}

/* 添加角色接口 */
export function roleAdd(data) {
    return request({
        url: '/api/auth/addSysRolePermission',
        method: 'post',
        data
    })
}

/* 编辑角色接口 */
export function roleUpdate(data) {
    return request({
        url: '/api/auth/updateSysRolePermission',
        method: 'post',
        data
    })
}

/* 添加角色用户接口 */
export function userRoleAdd(data) {
    return request({
        url: '/api/auth/addSysUserRole',
        method: 'post',
        data
    })
}

/* 查询权限配置接口 */
export function getRoleConfig(query) {
    return request({
        url: '/api/auth/selectAuthorityConfig',
        method: 'get',
        params: query
    })
}

/* 保存权限菜单按钮接口 */
export function userRoleSave(data) {
    return request({
        url: '/api/auth/saveAuthorityConfig',
        method: 'post',
        data
    })
}

/* 根据角色id查询用户列表 */
export function getOrgEmployeeByRoleIdPage(query) {
    return request({
        url: '/api/auth/queryOrgEmployeeByRoleIdPage',
        method: 'get',
        params: query
    })
}

/* 将用户从某一个角色中移除 */
export function userRemove(data) {
    return request({
        url: '/api/auth/removeUserById',
        method: 'post',
        data
    })
}

/* ------------------------------------菜单管理------------------------------------------ */

/* 查询菜单分页列表接口 */
export function getSysMenuPage(query) {
    return request({
        url: '/api/auth/querySysMenuPage',
        method: 'get',
        params: query
    })
}

/* 查询所有菜单列表口 */
export function getAllSysMenu(query) {
    return request({
        url: '/api/auth/selectAllMenuListByLevel',
        method: 'get',
        params: query
    })
}

/* 添加菜单 */
export function addSysMenu(data) {
    return request({
        url: '/api/auth/addSysMenu',
        method: 'post',
        data
    })
}

/* 编辑菜单 */
export function updateSysMenu(data) {
    return request({
        url: '/api/auth/updateSysMenu',
        method: 'post',
        data
    })
}

/* 停用菜单 */
export function updateSysMenuStatus(data) {
    return request({
        url: '/api/auth/updateSysMenuStatus',
        method: 'post',
        data
    })
}

/* 通过菜单获取角色列表 */
export function getRolesByMenuId(query) {
    return request({
        url: '/api/auth/getRolesByMenuId',
        method: 'get',
        params: query
    })
}

/* 停用菜单 */
export function deleteSysMenuByIds(query) {
    return request({
        url: '/api/auth/deleteSysMenuByIds',
        method: 'get',
        params: query
    })
}

/* 获取欢迎页数据大屏 */
export function getHomeInfo(query) {
    return request({
        url: '/api/sys/getHomeInfo',
        method: 'get',
        params: query
    })
}
