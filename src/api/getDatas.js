import request from '@/config/request'
import {HttpPost} from "./getDatelist";

/**
 * 获取首页默认地址
 */

export const getProductInfo = (productId, cityName) => {
  return request('POST', '/product/getProductInfo', {
    productId: productId,
    cityName: cityName,
  }) //登陆管理员获取自身信息
 }

/**
 * 获取商品类型
 */
export const getCatalogs= data => {
  return request('POST', '/product/getProductInfo', data) //获取商品类型
};

// export const getProductInfo = (productId, cityName) => request('/product/getProductInfo', {
// 	productId: productId,
// 	cityName: cityName,
// }, 'POST');
