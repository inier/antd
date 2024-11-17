import MainLayout from "@/layouts/main";
import {
	HomeFilled,
	SafetyCertificateFilled,
	SettingFilled,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { RouteObject, createBrowserRouter } from "react-router-dom";

export type MenuItem = { key: string } & Required<MenuProps>["items"][number] &
	RouteObject;

export const menus: MenuItem[] = [
	{
		index: true,
		key: "/",
		path: "/",
		label: "总览",
		icon: <HomeFilled />,
		lazy: async () => ({
			Component: (await import("@/pages/dashboard")).default,
		}),
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
				icon: <SafetyCertificateFilled />,
				lazy: async () => ({
					Component: (await import("@/pages/auth/user")).default,
				}),
			},
		],
	},
	{
		key: "/setting",
		path: "/setting",
		label: "设置",
		icon: <SettingFilled />,
		lazy: async () => ({
			Component: (await import("@/pages/setting")).default,
		}),
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
