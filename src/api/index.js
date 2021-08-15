/*
  包含应用所有接口请求函数的模块
  每个函数的返回值都是promise
*/

import ajax from './ajax'
import { BASE_URL } from '../utils/constants'

const BASE = 'http://159.75.128.32:5000/'

//登录
// export function reqLogin(name, password) {
//   return ajax('/api/user/login', { name, password }, 'POST')
// }
export const reqLogin = (name, password) => ajax(BASE + '/api/user/login', { name, password }, 'POST')

//添加用户
// export const reqAddUser = (user) => ajax(BASE + '​/api​/user​/add', user, 'POST')

// 请求天气数据
export const reqWeather = () => {
  const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=44563fef2b551d58c41c58ab44b802f8&city=610100`
  return ajax(url)
}

// 获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE + `/api/category/list/${parentId}`)

// 添加分类
export const reqAddCategory = (parentId, categoryName, name) => ajax(BASE + '/api/category/add', { parentId, categoryName, name }, 'POST')

// 更新分类
export const reqUpdateCategory = (id, parentId, name, categoryName) => ajax(BASE + '/api/category/update', { id, parentId, name, categoryName }, 'PUT')

// 获取一个分类
export const reqCategoryById = (id) => ajax(BASE + `/api/category/findCategoryById/${id}`, 'GET')

// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/api/products/list', { pageNum, pageSize }, 'POST')

// 根据描述搜索商品分页列表
export const reqProductsByDesc = (desc, pageNum, pageSize) => ajax(BASE + `/api/products/searchByDesc/${desc}/${pageNum}/${pageSize}`, 'GET')

// 根据名称搜索商品
export const reqProductsByName = (name, pageNum, pageSize) => ajax(BASE + '/api/products/searchByName', { name, pageNum, pageSize }, 'GET')

//根据ID更新产品状态
export const reqUpdateStatus = (id, status) => ajax(BASE + `/api/products/updateStatus/${id}`, { status }, 'PUT')

// 删除图片
export const reqDeleteProductsImages = (fileName) => ajax(`${BASE_URL}/deleteFile/${fileName}`, {}, 'DELETE')

// 添加商品
export const reqAddProduct = (product) => ajax(BASE + `/api/products/addProduct`, product, 'POST')

// 更新商品
export const reqUpdateProduct = (id, product) => ajax(BASE + `/api/products/updateProduct/${id}`, product, 'PUT')

// 获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/api/role/getRoles', 'GET')

// 创建角色
export const reqCreateRole = (role) => ajax(BASE + '/api/role/createRole', role, 'POST')

// 更新角色权限
export const reqUpdateRole = (id, role) => ajax(BASE + `/api/role/updateRole/${id}`, role, 'PUT')

// 查询所有用户列表
export const reqUsers = () => ajax(BASE + '/api/user/getUsers', 'GET')

// 删除指定用户
export const reqDeleteUser = (id) => ajax(BASE + `/api/user/delete/${id}`, {}, 'DELETE')

// 添加用户
export const reqAddUser = (user) => ajax(BASE + '/api/user/add', user, 'POST')


// 添加用户
export const reqUpdateUser = (user) => ajax(BASE + `/api/user/update/${user.id}`, user, 'PUT')
