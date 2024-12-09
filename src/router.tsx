import MainLayout from "@/layouts/main";
import {
	AlertOutlined,
	ApartmentOutlined,
	BarsOutlined,
	ClusterOutlined,
	DeleteRowOutlined,
	DeploymentUnitOutlined,
	FileDoneOutlined,
	FileImageOutlined,
	FileSearchOutlined,
	FileTextOutlined,
	FileUnknownOutlined,
	FolderOutlined,
	GoldOutlined,
	MoneyCollectOutlined,
	ProductOutlined,
	SafetyOutlined,
	SettingOutlined,
	TagsOutlined,
	UserAddOutlined,
	UserOutlined,
	UsergroupAddOutlined
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { type RouteObject, createBrowserRouter } from "react-router-dom";

export type MenuItem = { key: string } & Required<MenuProps>["items"][number] &
	RouteObject;

export const searchItemByKey = (items: MenuItem[], key: string): MenuItem | null => {
	let target = null;
	for (const item of items) {
		if (item.key === key) {
			target = item;
		}
		if (!target) {
			const children = item?.children ?? [];
			if (children?.length > 0) {
				target = searchItemByKey(children as MenuItem[], key);
			}
		}
	}
	return target;
};

export const menus: MenuItem[] = [
	{
		index: true,
		key: "/",
		path: "/",
		label: "总览",
		icon: <ProductOutlined />,
		lazy: async () => ({
			Component: (await import("@/pages/dashboard")).default,
		}),
	},
	{
		key: '/operation',
		path: '/operation',
		label: '运营管理',
		type: 'group',
		children: [
			{
				key: '/operation/banner',
				path: 'banner',
				label: '轮播图管理',
				icon: <FileImageOutlined />,
				lazy: async () => ({
					Component: (await import("@/pages/operation/banner")).default,
				}),
			},
		]
	},
	{
		key: "/content",
		path: "/content",
		label: "内容管理",
		type: "group",
		children: [
			{
				key: "/content/list",
				path: "list",
				label: "文章列表",
				icon: <FileTextOutlined />,
				lazy: async () => ({
					Component: (await import("@/pages/content/list")).default,
				}),
			},
			{
				key: "/content/category",
				path: "category",
				label: "文章分类",
				icon: <FileUnknownOutlined />,
				lazy: async () => ({
					Component: (await import("@/pages/content/category")).default,
				})
			}
		]
	},
	{
		key: "/flow",
		path: "/flow",
		label: "流程管理",
		type: "group",
		children: [
			{
				key: "/flow/list",
				path: "list",
				label: "流程管理",
				icon: <DeleteRowOutlined />,
				lazy: async () => ({
					Component: (await import("@/pages/flow/list")).default,
				}),
			},
			{
				key: "/flow/order",
				path: "order",
				label: "流程工单",
				icon: <FileDoneOutlined />,
				lazy: async () => ({
					Component: (await import("@/pages/flow/order")).default,
				})
			}
		],
	},
	{
		key: "/product",
		path: "/product",
		label: "产品管理",
		type: "group",
		children: [
			{
				key: "/product/list",
				path: "list",
				label: "产品列表",
				icon: <GoldOutlined />,
				lazy: async () => ({
					Component: (await import("@/pages/product/list")).default,
				}),
			},
			{
				key: "/product/category",
				path: "category",
				label: "产品分类",
				icon: <BarsOutlined />,
				lazy: async () => ({
					Component: (await import("@/pages/product/category")).default,
				})
			},
			{
				key: "/product/package",
				path: "package",
				label: "定价模型",
				icon: <MoneyCollectOutlined />,
				lazy: async () => ({
					Component: (await import("@/pages/product/package")).default,
				})
			}
		]
	},
	{
		key: '/customer',
		path: '/customer',
		label: '客户管理',
		type: 'group',
		children: [
			{
				key: '/customer/list',
				path: 'list',
				label: '客户列表',
				icon: <UsergroupAddOutlined />,
				lazy: async () => ({
					Component: (await import("@/pages/customer/list")).default,
				})
			},
			{
				key: '/customer/category',
				path: 'list',
				label: '客户类型',
				icon: <TagsOutlined />,
				lazy: async () => ({
					Component: (await import("@/pages/customer/category")).default,
				})
			}
		]
	},
	{
		key: '/knowledge',
		path: '/knowledge',
		label: '知识管理',
		type: 'group',
		children: [
			{
				key: '/knowledge/list',
				path: 'list',
				label: '知识列表',
				icon: <FolderOutlined />,
				lazy: async () => ({
					Component: (await import("@/pages/knowledge/list")).default,
				})
			},
			{
				key: '/knowledge/category',
				path: 'category',
				label: '知识类型',
				icon: <AlertOutlined />,
				lazy: async () => ({
					Component: (await import("@/pages/knowledge/category")).default,
				})
			}
		]
	},
	{
		key: "/auth",
		path: "/auth",
		label: "权限管理",
		type: "group",
		children: [
			{
				key: "/auth/user",
				path: "user",
				label: "用户管理",
				icon: <UserOutlined />,
				lazy: async () => ({
					Component: (await import("@/pages/auth/user")).default,
				}),
			},
			{
				key: '/auth/department',
				path: 'department',
				label: '部门管理',
				icon: <ApartmentOutlined />,
				lazy: async () => ({
					Component: (await import("@/pages/auth/department")).default,
				})
			},
			{
				key: "/auth/role",
				path: "role",
				label: "角色管理",
				icon: <UserAddOutlined />,
				lazy: async () => ({
					Component: (await import("@/pages/auth/role")).default,
				}),
			},
			{
				key: "/auth/permission",
				path: "permission",
				label: "权限管理",
				icon: <SafetyOutlined />,
				lazy: async () => ({
					Component: (await import("@/pages/auth/permission")).default,
				}),
			},
		],
	},
	{
		key: "/metadata",
		path: "/metadata",
		label: "元数据",
		type: "group",
		children: [
			{
				key: "/metadata/region",
				path: "region",
				label: "行政区域",
				icon: <ClusterOutlined />,
				lazy: async () => ({
					Component: (await import("@/pages/metadata/region")).default,
				}),
			},
			{
				key: "/metadata/industry",
				path: "industry",
				label: "行业分类",
				icon: <DeploymentUnitOutlined />,
				lazy: async () => ({
					Component: (await import("@/pages/metadata/industry")).default,
				}),
			},
		]
	},
	{
		key: "/system",
		path: "/system",
		label: "系统管理",
		type: "group",
		children: [
			{
				key: "/system/log",
				path: "log",
				label: "日志",
				icon: <FileSearchOutlined />,
				lazy: async () => ({
					Component: (await import("@/pages/system/log")).default,
				}),
			},
			{
				key: "/system/setting",
				path: "setting",
				label: "设置",
				icon: <SettingOutlined />,
				lazy: async () => ({
					Component: (await import("@/pages/system/setting")).default,
				}),
			},
		]
	},
];

const router = createBrowserRouter([
	{
		path: "/login",
		lazy: async () => ({
			Component: (await import("@/pages/login")).default,
		}),
	},
	{
		path: "/",
		element: <MainLayout />,
		children: menus,
	},

	// // Error routes
	// { path: "/500", Component: GeneralError },
	// { path: "/404", Component: NotFoundError },
	// { path: "/503", Component: MaintenanceError },
	// { path: "/401", Component: UnauthorisedError },

	// // Fallback 404 route
	// { path: "*", Component: NotFoundError },
]);

export default router;
