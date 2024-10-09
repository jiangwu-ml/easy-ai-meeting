import { logout } from '@/pages/login/api';
import { layoutChildren } from '@/router';
import { removeToken, removeUserInfo, setLang } from '@/utils/token';
import { omitArrEmpty } from '@/utils/utils';
import { DownOutlined, ExclamationCircleOutlined, LogoutOutlined } from '@ant-design/icons';

import { Button, Dropdown, Layout, Menu, message, Modal, Space, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import style from './style.module.scss'; //sass中的模块化--样式命名必须要是xxx.module.scss才能被引用

const { Header, Sider, Content } = Layout;

const PageLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState('/');
  const [modal, contextHolder] = Modal.useModal();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const createMenuItems = (oriList) => {
    const res = oriList.map((item) => {
      const { icon, path, children, hidden } = item;
      if (!hidden)
        return {
          key: path,
          icon: icon,
          label: t(`menu.${path}`),
          children: children ? createMenuItems(children) : null,
        };
    });

    return omitArrEmpty(res);
  };
  const menuItem = createMenuItems(layoutChildren);
  useEffect(() => {
    setSelectedKey([location.pathname.split('/')[1]]);
  }, [location.pathname]);

  const changeLang = (e) => {
    const { key } = e;
    i18n.changeLanguage(key);
    setLang(key);
  };
  const logOut = async () => {
    setLoading(true);
    const { success } = await logout();
    if (success) {
      removeToken();
      removeUserInfo();
      navigate('/login');
      message.success(t('login.msg.logout.success'));
    } else {
      message.error(t('login.msg.logout.error'));
    }
    setLoading(false);
  };

  return (
    <Spin spinning={loading}>
      <Layout className={style.wrapper_layout}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className={style.logo}>Easy AI Meeting</div>
          <Menu
            theme='dark'
            mode='inline'
            items={menuItem}
            onClick={(item) => {
              setSelectedKey(item.key);
              navigate('/' + item.keyPath.join('/'));
            }}
            selectedKeys={selectedKey}
          />
        </Sider>
        <Layout className={style.site_layout}>
          <Header className={style.site_layout_header}>
            {/* 收缩功能暂时隐藏 */}
            <span className={style.trigger} onClick={() => setCollapsed(!collapsed)}>
              {/* {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} */}
            </span>
            <div className={style.header_right}>
              <Space>
                <Dropdown
                  className={style.header_right_dropDown}
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
                    onClick: changeLang,
                  }}>
                  <Space>
                    {t('language')}
                    <DownOutlined />
                  </Space>
                </Dropdown>
                <Button
                  onClick={() => {
                    modal.confirm({
                      title: t('login.msg.logout.confirm.title'),
                      icon: <ExclamationCircleOutlined />,
                      content: t('login.msg.logout.confirm.content'),
                      okText: t('msg.modal.okText'),
                      cancelText: t('msg.modal.cancelText'),
                      onOk: logOut,
                    });
                  }}
                  ghost
                  style={{ border: 'none' }}>
                  {t('login.logout')} <LogoutOutlined />
                </Button>
              </Space>
            </div>
          </Header>
          <Content className={style.site_layout_content}>
            <Outlet />
          </Content>
        </Layout>
        {contextHolder}
      </Layout>
    </Spin>
  );
};
export default PageLayout;
