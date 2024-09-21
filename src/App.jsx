import PageLayout from "@/layout";
import MeetingRoomList from "@/pages/meetingRoomList";
import ReservationList from "@/pages/reservationList";
import { ConfigProvider } from "antd";
import { Route, Routes } from "react-router-dom";
import NotFound from "./pages/notFound";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token，影响范围大
          colorPrimary: "#ef8751",
          // 派生变量，影响范围小
          colorBgContainer: "#c45a35",
          borderRadius: 2,
        },
      }}
    >
      <Routes>
        <Route path="/" element={<PageLayout />}>
          <Route path="/meeting-room-list" element={<MeetingRoomList />} />
          <Route path="/reservation-list" index element={<ReservationList />} />
          <Route path="/*" element={<NotFound />} />
        </Route>
      </Routes>
    </ConfigProvider>
  );
}

export default App;
