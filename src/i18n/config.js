import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translation_en from "./en.json";
import translation_mrl_en from "./meetingRoomList/en.json";
import translation_mrl_zh from "./meetingRoomList/zh.json";
import translation_zh from "./zh.json";
const resources = {
  en: {
    translation: { ...translation_en, ...translation_mrl_en },
  },
  zh: {
    translation: { ...translation_zh, ...translation_mrl_zh },
  },
};

i18n.use(initReactI18next).init({
  resources,
  // 默认语言  zh/en  中文/英文
  lng: "zh",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
