import { getMeetingRoomSearchList, getUserSearchList } from '@/pages/reservationList/api';
import useSWR from 'swr';

export function useUserList() {
  const res = useSWR('/user/searchList', getUserSearchList); //此接口不需要传参。所以key为固定值
  const { data = {}, error, isLoading } = res;
  const { data: data1 = [] } = data;
  const userList = data1.map(({ id, name }) => {
    return { label: name, value: id };
  });
  return {
    userList,
    isUserListLoading: isLoading,
    isError: error,
  };
}

export function useMeetingRoomSearchList() {
  const res = useSWR(
    '/meetingRoom/searchList', //此接口不需要传参,。所以key为固定值
    getMeetingRoomSearchList,
    {
      revalidateOnFocus: false, // 默认true  当你重新聚焦一个页面或在标签页之间切换时，SWR 会自动重新请求数据 。
    },
  );
  const { data = {}, error, isLoading } = res;
  const { data: data1 = [] } = data;
  const meetingRoomList = data1.map(({ id, roomName }) => {
    return { label: roomName, value: id };
  });
  return {
    meetingRoomList,
    isMeetingRoomListLoading: isLoading,
    isError: error,
  };
}
