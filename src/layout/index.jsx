import routeList from "@/router";
import { omitEmpty } from "@/utils/utils";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Layout, Menu, Space } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import style from "./style.module.scss"; //sass中的模块化--样式命名必须要是xxx.module.scss才能被引用

const { Header, Sider, Content } = Layout;

const PageLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("/");
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const createMenuItems = oriList => {
    const res = oriList.map(item => {
      const { icon, path, children, hidden } = item;
      if (!hidden)
        return {
          key: path,
          icon: icon,
          label: t(`menu.${path}`),
          children: children ? createMenuItems(children) : null,
        };
    });

    return omitEmpty(res);
  };
  const menuItem = createMenuItems(routeList);
  useEffect(() => {
    setSelectedKey([location.pathname.split("/")[1]]);
  }, [location.pathname]);

  const handleMenuClick = e => {
    const { key } = e;
    i18n.changeLanguage(key);
  };
  return (
    <Layout className={style["wrapper-layout"]}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className={style.logo}>Easy AI Meeting</div>
        <Menu
          theme="dark"
          mode="inline"
          items={menuItem}
          onClick={item => {
            setSelectedKey(item.key);
            navigate("/" + item.keyPath.join("/"));
          }}
          selectedKeys={selectedKey}
        />
      </Sider>
      <Layout className={style["site-layout"]}>
        <Header className={style["site-layout-header"]}>
          {/* 收缩功能暂时隐藏 */}
          <span
            className={style["trigger"]}
            onClick={() => setCollapsed(!collapsed)}
          >
            {/* {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} */}
          </span>

          <div className={style["header-left"]}>
            <Dropdown
              className={style["header-left-dropDown"]}
              menu={{
                items: [
                  {
                    key: "zh",
                    label: t("lang-zh"),
                  },
                  {
                    key: "en",
                    label: t("lang-en"),
                  },
                ],
                onClick: handleMenuClick,
              }}
            >
              <Space>
                {t("language")}
                <DownOutlined />
              </Space>
            </Dropdown>
            <img
              className={style["header-left-avatar"]}
              src="https://pic36.photophoto.cn/20150810/0017029569625120_b.jpg"
            ></img>
          </div>
        </Header>
        <Content className={style["site-layout-content"]}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default PageLayout;
