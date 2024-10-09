import { getLang } from '@/utils/token';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translation_en from './en.json';
import translation_login_en from './login/en.json';
import translation_login_zh from './login/zh.json';
import translation_mrl_en from './meetingRoomList/en.json';
import translation_mrl_zh from './meetingRoomList/zh.json';
import translation_rl_en from './reservationList/en.json';
import translation_rl_zh from './reservationList/zh.json';
import translation_zh from './zh.json';
const resources = {
  en: {
    translation: { ...translation_en, ...translation_mrl_en, ...translation_rl_en, ...translation_login_en },
  },
  zh: {
    translation: { ...translation_zh, ...translation_mrl_zh, ...translation_rl_zh, ...translation_login_zh },
  },
};

i18n.use(initReactI18next).init({
  resources,
  // 默认语言  zh/en  中文/英文
  lng: getLang(),
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
