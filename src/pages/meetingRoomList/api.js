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
