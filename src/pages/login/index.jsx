import { setToken, setUserInfo } from '@/utils/token';
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, Input, message, Space } from 'antd';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { login } from './api';
import style from './style.module.scss';

function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    const {
      success,
      data: { token },
    } = await login(values);
    if (success) {
      message.success(t('login.msg.login.success'));
      setToken(token);
      setUserInfo(token);
      navigate('/');
      return;
    }
    message.error(t('login.msg.login.error'));
  };

  const handleMenuClick = (e) => {
    const { key } = e;
    i18n.changeLanguage(key);
  };
  return (
    <div className={style.login_container}>
      <div className={style.lang}>
        <Dropdown
          className={style['header-left-dropDown']}
          menu={{
            items: [
              {
                key: 'zh',
                label: t('lang-zh'),
              },
              {
                key: 'en',
                label: t('lang-en'),
              },
            ],
            onClick: handleMenuClick,
          }}>
          <Space>
            {t('language')}
            <DownOutlined />
          </Space>
        </Dropdown>
      </div>
      <Form
        name='basic'
        className={style.login_form}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 20,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        autoComplete='true'>
        <h1>Hello</h1>
        <h5>{t('login.h5')} Easy AI Meeting</h5>
        <Form.Item
          label={t('login.username')}
          name='username'
          rules={[
            {
              required: true,
              message: t('login.form.msg.username'),
            },
          ]}>
          <Input />
        </Form.Item>
        <Form.Item
          label={t('login.password')}
          name='password'
          rules={[
            {
              required: true,
              message: t('login.form.msg.password'),
            },
          ]}>
          <Input.Password />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 4,
            span: 20,
          }}>
          <Button type='primary' htmlType='submit'>
            {t('login.submit')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
export default Login;
