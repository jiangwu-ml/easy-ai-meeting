import PageLayout from '@/layout';
import Login from '@/pages/login';
import MeetingRoomList from '@/pages/meetingRoomList';
import NotFound from '@/pages/notFound';
import ReservationList from '@/pages/reservationList';
import { HomeOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Navigate, useRoutes } from 'react-router-dom';

export const layoutChildren = [
  // 注册
  {
    // index:true,//不生效
    path: 'meeting-room-list',
    element: <MeetingRoomList />,
    icon: <HomeOutlined />,
  },
  {
    path: 'reservation-list',
    element: <ReservationList />,
    icon: <UnorderedListOutlined />,
  },
  {
    path: 'not-found',
    element: <NotFound />,
    hidden: true,
  },
  // 错误地址的跳转 和 默认的跳转
  {
    path: '/*',
    element: <Navigate to='/not-found' replace />,
    hidden: true,
  },
  {
    path: '/',
    element: <Navigate to='/meeting-room-list' replace />,
    hidden: true,
  },
];
// 此处必须是个组件
export default function PageRoutes() {
  const routerObj = [
    {
      path: '/',
      element: <PageLayout />,
      children: layoutChildren,
    },
    {
      path: '/login',
      element: <Login />,
    },
  ];
  return useRoutes(routerObj);
}
