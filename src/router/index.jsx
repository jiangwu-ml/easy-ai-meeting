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
    /** index: true,
     * 这个的作用是让他默认展示这个组件。
     * 但是路由并不会变化。
     * 拥有index属性的Route，它的path属性（写了也无效，等于这俩属性互斥）无效，它和其他子路由平级，它在父级路由未匹配其他任何子路由时展示
     * （类似于fallback占位）而不是一个路由组件！！只是个占位！！！
     * */
    // index: true, //默认跳转不生效
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
