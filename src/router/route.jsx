import PageLayout from '@/layout';
import MeetingRoomList from '@/pages/meetingRoomList';
import NotFound from '@/pages/notFound';
import ReservationList from '@/pages/reservationList';
import { Navigate, Route, Router, Routes } from 'react-router-dom';

export default function route() {
  return (
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
  );
}
