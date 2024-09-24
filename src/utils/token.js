import { get, remove, set } from './utils';

/**
 * 解析JWT
 * Token是分为三个部分，用 . 分割的 第二部分是有效负载信息 拿出来用base64解码一下就行了
 */
export function getTokenPayload(token) {
  const decoded = atob(token.split('.')[1] || ''); //window.atob 会对经过 Base64 编码的字符串进行解码. btoa是编码
  return JSON.parse(decoded);
}

export function getToken() {
  const token = get('session-token');
  if (!token) {
    return undefined;
  }
  return token;
}

export function getUserInfo() {
  const userInfo = get('token-userInfo');
  return JSON.parse(userInfo);
}

export function setToken(token) {
  set('session-token', token);
}

export function setUserInfo(token) {
  const { userInfo } = getTokenPayload(token);
  set('token-userInfo', JSON.stringify(userInfo));
}

export function removeToken() {
  remove('session-token');
}

export function removeUserInfo() {
  set('token-userInfo');
}
