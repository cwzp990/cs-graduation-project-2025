import axios, { AxiosInstance, AxiosResponse } from "axios";

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: "/sell", // 设置基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config: any) => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    const { data } = response;
    return data;
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response) {
      switch (error.response.status) {
        case 500:
          // 登出
          // localStorage.removeItem("token");
          // window.location.href = "/login";
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);

// GET 请求
const getData = async (url: string, params): any => {
  try {
    const response = await request.get(url, {
      params,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

// POST 请求
const postData = async (url: string, data): any => {
  try {
    const response = await request.post(url, data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export { getData, postData };
