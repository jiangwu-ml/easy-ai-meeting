import request from '@/utils/request';
export function getReservationList(params) {
  return request({
    method: 'post',
    url: '/reservation/page',
    data: params,
  });
}
export function cancelReservation(params) {
  return request({
    method: 'get',
    url: '/reservation/cancel/{id}',
    data: params,
  });
}
