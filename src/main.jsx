import App from '@/App.jsx';
import '@/i18n/config';
import '@/style/index.scss';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { getLang } from './utils/token';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <ConfigProvider locale={getLang() === 'zh' ? zhCN : enUS}>
      <App />
    </ConfigProvider>
  </BrowserRouter>,
);
