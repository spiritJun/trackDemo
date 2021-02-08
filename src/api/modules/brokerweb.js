import request from '@/api/request'
import Cookies from 'js-cookie'

const userId = Number(Cookies.get('userId'))
const userType = Cookies.get('userType')
const userName = Cookies.get('userName')

// 通用-历史统计
export function getStatistics(query) {
  return request({
    url: '/shipper/bid/getStatistics',
    method: 'get',
    params: Object.assign(query, { userId, userType })
  })
}

// 通用--今日统计
export function getTodayStatistics() {
  return request({
    url: '/shipper/bid/getTodayStatistics',
    method: 'get',
    params: { userType, userId }
  })
}

// 管理员-分配竞标线路列表
export function getNoticePage(query) {
  return request({
    url: '/shipper/notice/getNoticePage',
    method: 'get',
    params: query
  })
}

/* // 管理员-已标记线路列表
export function getBidNoticePage(query) {
  return request({
      url: '/shipper/notice/getBidNoticePage',
      method: 'get',
      params: query
  })
} */

// 管理员-竞标用户列表
export function getBidUserList(query) {
  return request({
    url: '/shipper/bidUser/getBidUserList',
    method: 'get',
    params: query
  })
}

//管理员-分配竞标用户
export function addBatchBidInfo(query) {
  return request({
    url: '/shipper/bid/addBatchBidInfo',
    method: 'post',
    data: Object.assign(query, { createUserId: userId })
  })
}

// 管理员-查看已分配竞标列表
export function getBidInfoList(query) {
  return request({
    url: '/shipper/bid/getBidInfoList',
    method: 'get',
    params: query
  })
}

// 管理员-获取竞标有效期
export function getBidEffectiveTime(query) {
  return request({
      url: '/shipper/bidEffectiveTime/getBidEffectiveTime',
      method: 'get',
      params: query
  })
}

// 管理员-设置竞标有效期
export function addBidEffectiveTime(data) {
  return request({
    url: '/shipper/bidEffectiveTime/addBidEffectiveTime',
    method: 'post',
    data
  })
}

// 派单员-竞标大厅
export function getBidNoticeHallPage(query) {
  return request({
    url: '/shipper/notice/getBidNoticeHallPage',
    method: 'get',
    params: Object.assign(query, { userId, userType })
  })
}

// 派单员-竞标
export function updateBídInfo(data) {
  return request({
    url: '/shipper/bid/updateBídInfo',
    method: 'post',
    data: Object.assign(data, { userId })
  })
}

// 派单员-历史竞标记录列表
export function getBidNoticePage(query) {
  return request({
    url: '/shipper/notice/getBidNoticePage',
    method: 'get',
    params: Object.assign(query, { userId,  userType})
  })
}