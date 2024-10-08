import request from '@/utils/request';
export function getMeetingRoomList(params) {
  return request({
    method: 'post',
    url: '/meetingRoom/page',
    data: params,
  });
}
export function updateMeetingRoom(params) {
  return request({
    method: 'post',
    url: '/meetingRoom/update',
    data: params,
  });
}
export function addMeetingRoom(params) {
  return request({
    method: 'post',
    url: '/meetingRoom/add',
    data: params,
  });
}

export function bookMeetingRoom(params) {
  return request({
    method: 'post',
    url: '/meetingRoom/book',
    data: params,
  });
}

export function getTimeOccupyList(roomId) {
  return request({
    method: 'get',
    url: `/reservation/occupy/${roomId}`,
  });
}
