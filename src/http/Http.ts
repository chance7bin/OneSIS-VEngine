import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { ElMessage } from 'element-plus'
import AppOptions from '../config/index'

interface ResType<T> {
    code: number
    msg: string
    data?: any
    err?: string
}

interface Http {
    get<T>(url: string, params?: unknown): Promise<ResType<T>>

    post<T>(url: string, params?: unknown): Promise<ResType<T>>

    delete<T>(url: string, params?: unknown): Promise<ResType<T>>

    upload<T>(url: string, params: unknown, config: AxiosRequestConfig): Promise<ResType<T>>

    download(url: string): void
}

// 设置请求头和请求路径
axios.defaults.baseURL = AppOptions.backend_ip
axios.defaults.timeout = 600000
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

//请求拦截器
axios.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        return config
    },
    (error: Error) => {
        return error
    }
)
// 响应拦截
axios.interceptors.response.use(
    (res: AxiosResponse) => {
        //发请求前做的一些处理，数据转化，配置请求头，设置token,设置loading等，根据需求去添加
        switch (res.data.code) {
            case 200:
                return res
            case 201:
                return res
            default:
                return
        }
    },
    (error: AxiosError) => {
        // 接收到异常响应的处理开始
        if (error && error.response) {
            // 1.公共错误处理
            // 2.根据响应码具体处理
            switch (error.response.status) {
                case 400:
                    error.message = '错误请求'
                    break;
                case 401:
                    error.message = '未授权，请重新登录'
                    break;
                case 403:
                    error.message = '认证失败！请重新登录'
                    break;
                case 404:
                    error.message = '请求错误,未找到该资源'
                    window.location.href = "/NotFound"
                    break;
                case 405:
                    error.message = '请求方法未允许'
                    break;
                case 408:
                    error.message = '请求超时'
                    break;
                case 500:
                    error.message = '服务器端出错'
                    break;
                case 501:
                    error.message = '网络未实现'
                    break;
                case 502:
                    error.message = '网络错误'
                    break;
                case 503:
                    error.message = '服务不可用'
                    break;
                case 504:
                    error.message = '网络超时'
                    break;
                case 505:
                    error.message = 'http版本不支持该请求'
                    break;
                default:
                    error.message = `连接错误${error.response.status}`
            }
        } else {
            // 超时处理
            if (JSON.stringify(error).includes('timeout')) {
                ElMessage({
                    type: 'error',
                    message: '服务器响应超时，请刷新当前页'
                })
            }
            ElMessage({
                type: 'error',
                message: '连接服务器失败'
            })
        }
        ElMessage({
            type: 'error',
            message: error.message
        })
        //处理结束
        //如果不需要错误处理，以上的处理过程都可省略
        return Promise.resolve(error.response)
    }
)

const request: Http = {
    get(url, config: AxiosRequestConfig) {
        return new Promise((resolve, reject) => {
            console.log(config)
            axios
                .get(url, config)
                .then((res) => {
                    console.log(res)
                    resolve(res.data)
                })
                .catch((err) => {
                    console.log(err)
                    reject(err.data)
                })
        })
    },
    post(url, params) {
        return new Promise((resolve, reject) => {
            console.log(params)
            axios
                .post(url, JSON.stringify(params))
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err.data)
                })
        })
    },
    upload(url, params, config) {
        return new Promise((resolve, reject) => {
            axios
                .post(url, params, config)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err.data)
                })
        })
    },
    download(url) {
        const iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        iframe.src = url
        iframe.onload = function () {
            document.body.removeChild(iframe)
        }
        document.body.appendChild(iframe)
    },
    delete(url, params) {
        return new Promise((resolve, reject) => {
            axios.delete(url, { params }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err.data)
            })
        })
    }
}

export default request;