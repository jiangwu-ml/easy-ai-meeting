import { HomeOutlined, UnorderedListOutlined } from "@ant-design/icons";
const routeList = [
  {
    path: "meeting-room-list",
    icon: <HomeOutlined />,
  },
  {
    path: "reservation-list",
    icon: <UnorderedListOutlined />,
  },
  {
    path: "not-found",
    hidden: true,
  },
];
export default routeList;
