import { cn } from "@/lib/utils";
import globalModel from "@/models/global.model";
import { menus } from "@/router";
import { ArrowLeftOutlined, ArrowRightOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useReactive } from "ahooks";
import { Avatar, Button, Image, Layout, Menu, Popconfirm, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";

const { Sider } = Layout;

interface SideBarProps {
    active: string;
}

export default function SideBar({ active }: SideBarProps) {
    const state = useReactive({ collapsed: false });
    const nav = useNavigate();
    const { setting, user } = useSnapshot(globalModel.state);

    return (
        <Sider width="220" trigger={null} collapsible collapsed={state.collapsed}>
            <div className="relative flex flex-col h-full w-full bg-background">
                <Button
                    className="absolute top-[50%] -right-4 w-8 h-8 rounded-full text-foreground bg-background hover:bg-primary hover:text-primary-foreground"
                    type="text"
                    icon={state.collapsed ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
                    onClick={() => state.collapsed = !state.collapsed}
                />
                <div className={cn(
                    "flex items-center h-12 py-2 px-4 box-border",
                    state.collapsed && "flex-col"
                )}>
                    <Image src={setting?.logo} />
                    {!state.collapsed && <span className="ml-2 text-sm font-medium">{setting?.name}</span>}
                </div>
                <Menu
                    className={cn(
                        "flex-1 overflow-y-auto no-scrollbar border-none",
                        !state.collapsed ? "[&_.ant-menu-item-group-title]:text-left" : "[&_.ant-menu-item-group-title]:text-center"
                    )}
                    defaultSelectedKeys={[active]}
                    defaultOpenKeys={[active]}
                    selectedKeys={[active]}
                    mode="inline"
                    items={menus}
                    onClick={({ key }) => {
                        nav(key);
                    }}
                />
                <div className={cn(
                    "w-full flex justify-between items-center box-border p-2 cursor-pointer",
                    state.collapsed && "flex-col"
                )
                }>
                    <div className={cn(
                        "flex items-center",
                        state.collapsed && "flex-col"
                    )}>
                        {!state.collapsed ? <Avatar src={user?.avatar} /> : (
                            <Tooltip placement="right" title={user?.nickname}>
                                <Avatar src={user?.avatar} />
                            </Tooltip>
                        )}
                        <span className={cn("ml-2", state.collapsed && "hidden")}>{user?.nickname}</span>
                    </div>

                    {
                        !state.collapsed ?
                            <Popconfirm title="确定要退出登录吗?" onConfirm={globalModel.logout}>
                                <Button type="text">
                                    <span className="mr-2">
                                        退出
                                    </span>
                                    <LogoutOutlined />
                                </Button>
                            </Popconfirm>
                            :
                            <Popconfirm title="确定要退出登录吗?" onConfirm={globalModel.logout}>
                                <Button className="mt-4" type="text" size="large">
                                    <LogoutOutlined />
                                </Button>
                            </Popconfirm>
                    }
                </div>
            </div >
        </Sider>
    );
}