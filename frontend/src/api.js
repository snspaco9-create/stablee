import axios from 'axios'
import supabase from './supabase'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
})

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const { data, error: refreshError } = await supabase.auth.refreshSession()

        if (refreshError || !data.session) {
          localStorage.removeItem('token')
          localStorage.removeItem('landlord')
          window.location.href = '/login'
          return Promise.reject(error)
        }

        const newToken = data.session.access_token
        localStorage.setItem('token', newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (refreshErr) {
        localStorage.removeItem('token')
        localStorage.removeItem('landlord')
        window.location.href = '/login'
        return Promise.reject(refreshErr)
      }
    }

    return Promise.reject(error)
  }
)

export default api