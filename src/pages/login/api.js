import request from '@/utils/request';

export function login(params) {
  return request({
    method: 'post',
    url: '/user/login',
    data: params,
  });
}
export function logout() {
  return request({
    method: 'get',
    url: '/user/logout',
  });
}
