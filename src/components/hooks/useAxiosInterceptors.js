// useAxiosInterceptors.js
import axios from "axios";
import { useDispatch } from "react-redux";
import { changeLoading } from "@/redux/loadingSlice";
import { useEffect } from "react";
export function useAxiosInterceptors() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 添加请求拦截器
    const requestInterceptor = axios.interceptors.request.use(
      function (config) {
        // 在发送请求之前显示loading
        dispatch(changeLoading(true));

        return config;
      },
      function (error) {
        // 对请求错误做些什么
        dispatch(changeLoading(false));

        return Promise.reject(error);
      }
    );

    // 添加响应拦截器
    const responseInterceptor = axios.interceptors.response.use(
      function (response) {
        // 对响应数据做点什么
        dispatch(changeLoading(false));

        return response;
      },
      function (error) {
        // 对响应错误做点什么
        dispatch(changeLoading(false));

        return Promise.reject(error);
      }
    );

    // 清理函数，用于移除拦截器
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [dispatch]); // 只有当dispatch改变时才会重新创建Hook
}
