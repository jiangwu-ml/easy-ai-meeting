import PageLayout from '@/layout';
import MeetingRoomList from '@/pages/meetingRoomList';
import NotFound from '@/pages/notFound';
import ReservationList from '@/pages/reservationList';
import { ConfigProvider } from 'antd';
import { Navigate, Route, Router, Routes } from 'react-router-dom';

export default function route() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ef8751', // Seed Token，影响范围大
          borderRadius: 2,
          // colorBgContainer: "#c45a35",// 派生变量，影响范围小
        },
      }}>
      <Router>
        <Routes>
          <Route path='/' element={<PageLayout />}>
            {/* 注册 */}
            <Route path='/meeting-room-list' element={<MeetingRoomList />} />
            <Route path='/reservation-list' element={<ReservationList />} />
            <Route path='/not-found' element={<NotFound />} />
            {/* 错误地址的跳转 和 默认的跳转 */}
            <Route path='/*' element={<Navigate to='/not-found' replace />} />
            <Route path='/' element={<Navigate to='/meeting-room-list' replace />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}
