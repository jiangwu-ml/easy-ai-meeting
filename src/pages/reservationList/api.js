import request from '@/utils/request';
export function getReservationList(params) {
  return request({
    method: 'post',
    url: '/reservation/page',
    data: params,
  });
}

export function cancelReservation(id) {
  return request({
    method: 'get',
    url: `/reservation/cancel/${id}`,
  });
}

export function getMeetingRoomSearchList() {
  return request({
    method: 'get',
    url: '/meetingRoom/searchList',
  });
}

export function getUserSearchList() {
  return request({
    method: 'get',
    url: '/user/searchList',
  });
}
