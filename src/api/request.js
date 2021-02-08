import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import store from '@/store'
import router from '@/router'
import {sign} from '@/utils/crypto'
import {removeToken} from '@/utils/auth'
import {getToken, getSSID} from "../utils/auth";

// 创建axios实例
const service = axios.create({
    // baseURL: process.env.BASE_API, // api 的 base_url
    // timeout: 300000 // 请求超时时间
});
/**
 * 请求头
 */
const header = () => {
    const config_ = {
        'X-Kcrm-SSID': '',
        'X-Kcrm-Nonce': '',
        'X-Kcrm-Timestamp': '',
        'X-Kcrm-Sign': '',
    };
    // 随机数
    const nonce = Math.ceil(Math.random() * 1000000000000000); // 16位随机数
    config_["X-Kcrm-Nonce"] = nonce;
    // 时间戳
    const timestamp = new Date().getTime(); // 时间戳 整数 毫秒数
    config_["X-Kcrm-Timestamp"] = timestamp;
    // 获取SSID
    let ssid = store.getters.ssid;
    if (!ssid) {
        ssid = getSSID();
    }
    // 获取key
    const keyString = getToken() || '';
    const key = keyString.substring(0, 16);
    const KP = {
        key: key, // 秘钥 16*n:
        iv: key // 偏移量
    };
    // const ssid = 'WTNPPm8BwcT6WJ8QhDzI9nStso9EFYA';
    config_["X-Kcrm-SSID"] = ssid;
    // 签名串
    const signstr = sign(KP, ssid, nonce, timestamp);
    // console.log(signstr);
    config_["X-Kcrm-Sign"] = signstr;
    return config_
};
// request拦截器
service.interceptors.request.use(
    config => {
        if (getSSID()) { // 判定是否有ssid 如果有的话处理sign信息，在之后的每个http请求中加在header中
            const config_ = header();
            config.headers['X-Kcrm-SSID'] = config_["X-Kcrm-SSID"];
            config.headers['X-Kcrm-Nonce'] = config_["X-Kcrm-Nonce"];
            config.headers['X-Kcrm-Timestamp'] = config_["X-Kcrm-Timestamp"];
            config.headers['X-Kcrm-Sign'] = config_["X-Kcrm-Sign"];
        }
        // 增加get请求参数：时间戳
        if (config.method === 'get') {
            config.params = {
                timestamp: Date.parse(new Date()) / 1000,
                ...config.params
            }
        }
        return config
    },
    error => {
        Promise.reject(error)
    }
)

// function removeTags(tagClass) {
//     const tagElements = document.getElementsByClassName(tagClass);
//     const m = tagElements.length;
//     if (tagElements.length > 0) {
//         tagElements[0].parentNode.removeChild(tagElements[m])
//     }
// }

// response 拦截器
service.interceptors.response.use(
    response => {
        const res = response;
        if (res.data.code && res.data.code !== "000000200") {
            switch (res.data.code) {
                case 10007:
                    Message.closeAll();
                    Message({
                        message: res.data.message,
                        type: "error",
                        duration: 3 * 1000
                    });
                    return response; // 用于更换验证码
                    break;
                // case 99999:
                //     Message.closeAll()
                //     Message({
                //         message: "服务器未知错误",
                //         type: "error",
                //         duration: 3 * 1000
                //     });
                //     return response;
                //     break;
                case 10001:
                case 10004:
                case 10005:
                    // MessageBox({
                    //     title: "登录已过期",
                    //     type: "warning",
                    //     message: "很抱歉，登录已过期，请重新登录",
                    //     confirmButtonText: "重新登录",
                    //     showClose: false,
                    //     closeOnClickModal: false,
                    //     closeOnPressEscape: false,
                    //     duration: 3 * 1000,
                    //     callback: () => {
                    //         // debugger
                    //         store
                    //             .dispatch("LogOut")
                    //             .then(() => {
                    //                 location.reload();
                    //             })
                    //             .catch(err => {
                    //                 removeToken();
                    //                 location.reload();
                    //             });
                    //     }
                    // });
                    break;
                default: // 这里除了目前文档定义好的编码后台还会不定的加其他错误编码编码
                    Message.closeAll();
                    Message({
                        message: res.data.message,
                        type: "error",
                        duration: 3 * 1000
                    });
                    return response;
            }
        } else {
            return response
        }
    },
    error => {
        if (error && error.response) {
            switch (error.response.status) {

                case 400:
                    // error.message = '请求错误(400)';
                    router.push({name: 'error_400'})
                    break;

                case 401:
                    // error.message = '未授权，请重新登录(401)';
                    router.push({name: 'error_401'})
                    break;

                case 403:
                    // error.message= '拒绝访问(403)';
                    router.push({name: 'error_403'})
                    break;

                case 404:
                    // error.message= '请求出错(404)';
                    router.push({name: 'error_404'})
                    break;

                case 408:
                    // error.message= '请求超时(408)';
                    router.push({name: 'error_408'})
                    break;

                case 500:
                    // // error.message= '服务器错误(500)';
                    router.push({name: 'error_500'})
                    break;

                case 501:
                    // error.message= '服务未实现(501)';
                    router.push({name: 'error_501'})
                    break;

                case 502:
                    // error.message= '网络错误(502)';
                    router.push({name: 'error_502'})

                    break;

                case 503:
                    // error.message= '服务不可用(503)';
                    router.push({name: 'error_503'})
                    break;

                case 504:
                    // error.message= '网络超时(504)';
                    router.push({name: 'error_504'})
                    break;

                case 505:
                    // error.message= 'HTTP版本不受支持(505)';
                    router.push({name: 'error_505'})
                    break;

                default:
                    error.message = `连接出错(${error.response.status})!`;
            }
        } else {
            Message.closeAll()
            Message({
                message: error.message,
                type: 'error',
                duration: 6 * 1000
            })
        }
        return Promise.reject(error)
    }
)
export default service
