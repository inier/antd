import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Dropdown,
  MenuProps,
  Space,
  Tabs,
  theme,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useUserStore } from "@/stores/user";
import { useTabStore } from "@/stores/tab";

interface NavBarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export interface TabItem {
  key: string;
  label: string;
  closable?: boolean;
}

export default function NavBar({ collapsed, onCollapse }: NavBarProps) {
  const { token } = theme.useToken();
  const { user, logout } = useUserStore();
  const { tabs, activeTab, addTab, removeTab, setActiveTab } = useTabStore();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 监听路由变化，自动添加标签页
  useEffect(() => {
    const { pathname } = location;
    // 这里可以根据路由配置获取标签页标题
    const title = getRouteTitle(pathname);
    if (title) {
      addTab({
        key: pathname,
        label: title,
        closable: pathname !== "/dashboard",
      });
      setActiveTab(pathname);
    }
  }, [location, addTab, setActiveTab]);

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "个人信息",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "设置",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
      danger: true,
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = async ({ key }) => {
    if (key === "logout") {
      setLoading(true);
      try {
        await logout();
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    navigate(key);
  };

  const handleTabEdit = (
    targetKey: string,
    action: "add" | "remove"
  ) => {
    if (action === "remove") {
      removeTab(targetKey);
      // 如果关闭的是当前标签页，则自动切换到最后一个标签页
      if (targetKey === activeTab) {
        const lastTab = tabs[tabs.length - 1];
        if (lastTab) {
          setActiveTab(lastTab.key);
          navigate(lastTab.key);
        }
      }
    }
  };

  // 获取路由标题的函数，你需要根据实际路由配置实现
  const getRouteTitle = (pathname: string): string => {
    const routeMap: Record<string, string> = {
      "/dashboard": "仪表盘",
      "/users": "用户管理",
      "/settings": "系统设置",
      // 添加更多路由映射
    };
    return routeMap[pathname] || "未知页面";
  };

  return (
    <div className="flex flex-col">
      <div
        style={{
          height: 48,
          padding: "0 16px",
          backgroundColor: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="flex items-center">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => onCollapse(!collapsed)}
          />
          <Link
            to="/"
            className="ml-4 text-lg font-semibold"
            style={{ color: token.colorText }}
          >
            ELL Admin
          </Link>
        </div>

        <div className="flex items-center">
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleMenuClick,
            }}
            placement="bottomRight"
          >
            <Space className="cursor-pointer">
              <Avatar
                size="small"
                icon={<UserOutlined />}
                src={user?.avatar}
              />
              <span>{user?.name || "用户"}</span>
            </Space>
          </Dropdown>
        </div>
      </div>

      <Tabs
        type="editable-card"
        onChange={handleTabChange}
        activeKey={activeTab}
        onEdit={handleTabEdit}
        items={tabs}
        hideAdd
        className="px-2 border-b border-gray-200"
      />
    </div>
  );
}