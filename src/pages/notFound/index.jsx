import { Button, Result } from "antd";
import { useTranslation } from "react-i18next";
const NotFound = () => {
  const { t } = useTranslation();


  return <Result
    status="404"
    title="404"
    subTitle={t("sub-title")}
    extra={<Button type="primary">{t('back-home')}</Button>}
  />


};

export default NotFound;
