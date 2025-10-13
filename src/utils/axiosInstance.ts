// src/lib/axios.ts
import axios from 'axios'
import { store } from '../store/store'

const axiosInstance = axios.create({
    baseURL: 'https://uatgateway.supermoney.in/', // 🔁 Replace with your actual base URL
    headers: {
        'Content-Type': 'application/json',
    },
})

// Optional: Attach Bearer token dynamically
axiosInstance.interceptors.request.use((config) => {
    const token = store.getState().auth.token || localStorage.getItem("authtoken")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default axiosInstance;
