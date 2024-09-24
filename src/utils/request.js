// anxios 的二次封装
import { notification } from 'antd';
import Axios from 'axios';
import i18n from 'i18next';
import { getToken } from './token';
// 1. 创建axios
const request = Axios.create({
  // 基础路径
  baseURL: '/api',
  timeout: 5000,
});

// 2. 拦截器 设置全局token
request.interceptors.request.use((config) => {
  config.headers['Authorization'] = getToken();
  return config;
});
request.interceptors.response.use(
  (response) => {
    // 成功的回调
    const { code, message } = response.data;
    // 接口又返回，但错误返回
    const errMsg = code >= 500 ? i18n.t('msg.500') : message;
    if (code !== 200)
      notification['error']({
        message: i18n.t('msg.error.title'),
        description: errMsg,
      });
    return response.data;
  },
  (err) => {
    // 失败的回调。处理 网络错误。比如 500都在这里统一处理了。不用每次调接口都处理
    let message = '';
    const { status } = err.response;
    switch (status) {
      case 401:
        message = i18n.t('msg.401');
        break;
      case 403:
        message = i18n.t('msg.403');
        break;
      case 404:
        message = i18n.t('msg.404');
        break;
      case 500:
        message = i18n.t('msg.500');
        break;
      default:
        break;
    }
    notification['error']({
      message: i18n.t('msg.error.title'),
      description: message,
      onClose: () => {
        if (status === 401) {
          location.href = '/login';
        }
      },
    });

    return err.response.data;
  },
);

export default request;
