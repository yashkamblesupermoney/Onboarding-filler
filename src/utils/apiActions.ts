// src/lib/apiRequest.ts
import axiosInstance from './axiosInstance'

interface APIOptions {
    successCallBack?: (res: any) => void
    failureCallBack?: (err: any) => void
}

export const makeAPIRequest = async (
    method: 'get' | 'post' | 'put',
    url: string,
    params: any = {},
    data: any = {},
    options: APIOptions = {}
) => {
    try {
        const response = await axiosInstance.request({
            method,
            url,
            params,
            data,
        })

        options.successCallBack?.(response.data)
    } catch (error: any) {
        options.failureCallBack?.(error.response?.data || error.message)
    }
}


export const makeAPIGETRequest = (
    url: string,
    params: any = {},
    options: APIOptions = {}
) => {
    return makeAPIRequest('get', url, params, {}, options)
}

export const makeAPIPOSTRequest = (
    url: string,
    params: any = {},
    data: any = {},
    options: APIOptions = {}
) => {
    return makeAPIRequest('post', url, params, data, options)
}

export const makeAPIPUTRequest = (
    url: string,
    params: any = {},
    data: any = {},
    options: APIOptions = {}
) => {
    return makeAPIRequest('put', url, params, data, options)
}
