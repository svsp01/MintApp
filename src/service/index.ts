import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: '',
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers['authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;