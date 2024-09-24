import { ConfigProvider } from 'antd';
import PageRoutes from './router';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ef8751', // Seed Token，影响范围大
          borderRadius: 2,
          // colorBgContainer: "#c45a35",// 派生变量，影响范围小
        },
      }}>
      <PageRoutes></PageRoutes>
    </ConfigProvider>
  );
}

export default App;
