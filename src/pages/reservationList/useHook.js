import useSWR from 'swr';
import { getMeetingRoomSearchList, getUserSearchList } from './api';

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
  const res = useSWR('/meetingRoom/searchList', getMeetingRoomSearchList); //此接口不需要传参。所以key为固定值
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
