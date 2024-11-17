import constants from "@/constants";
import { cn } from "@/lib/utils";
import { MenuItem, searchItemByKey } from "@/router";

import { useReactive } from "ahooks";
import { Button, Dropdown, MenuProps, Tabs } from "antd";
import { KeepAliveRef } from "keepalive-for-react";
import {
	ArrowLeftToLine,
	ArrowRightToLine,
	Minus,
	RefreshCw,
	X,
} from "lucide-react";
import React, { MutableRefObject, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

type NavBarContext = {
	aliveRef: MutableRefObject<KeepAliveRef | undefined>;
	current: string;
	defaultItem: MenuItem;
	menus: MenuItem[];
	items: MenuItem[];
	navigate: (key: string) => void;
	refresh: (key: string) => void;
	refreshCurrent: () => void;
	close: (key: string) => void;
	closeCurrent: () => void;
	closeLeft: (key: string) => void;
	closeRight: (key: string) => void;
	closeOther: (key: string) => void;
	closeAll: () => void;
};

const NavBarContext = React.createContext<NavBarContext | null>(null);

function useNavBar() {
	const context = React.useContext(NavBarContext);
	if (!context) {
		throw new Error("useNavBar must be used within a NavBarProvider.");
	}

	return context;
}

const loadItemsFromLocalStorage = (defaultItem: MenuItem) => {
	const storedItems = localStorage.getItem(
		`${constants.localStorageKeyPrefix}-navbar-items`,
	);
	let items = [];
	if (storedItems) {
		try {
			items = JSON.parse(storedItems);
		} catch (error) {
			items = [defaultItem];
		}
	}
	if (!items.length) {
		items = [defaultItem];
	}

	return items;
};

const saveItemsToLocalStorage = (items: MenuItem[]) => {
	localStorage.setItem(
		`${constants.localStorageKeyPrefix}-navbar-items`,
		JSON.stringify(items),
	);
};

const NavBarProvider = ({
	aliveRef,
	current,
	menus,
	children,
}: React.ComponentProps<"div"> & {
	aliveRef: MutableRefObject<KeepAliveRef | undefined>;
	current: string;
	menus: MenuItem[];
	getLinkIcon: (link: MenuItem) => React.ReactNode;
}) => {
	const state = useReactive<{
		items: MenuItem[];
	}>({
		items: [],
	});
	const nav = useNavigate();
	const defaultItem = menus[0];

	useEffect(() => {
		state.items = loadItemsFromLocalStorage(defaultItem);
	}, [defaultItem]);

	useEffect(() => {
		saveItemsToLocalStorage(state.items);
	}, [state.items]);

	const contextValue = React.useMemo<NavBarContext>(() => {
		const navigate = (key: string) => {
			nav(key);
			if (!state.items.some((l) => l.key === key)) {
				const item = searchItemByKey(menus, key);
				if (!item) return;
				state.items = [...state.items, item];
			}
		};

		const refresh = (key: string) => {
			aliveRef.current?.refresh(key);
		};

		const refreshCurrent = () => {
			aliveRef.current?.refresh();
		};

		const close = (key: string) => {
			const index = state.items.findIndex((l) => l.key === key);
			const newItems = state.items.filter((l) => l.key !== key);
			const nextItem = index > 0 ? newItems[index - 1] : newItems[index] ?? newItems[newItems.length - 1];
			state.items = [...newItems];
			if (current === key) {
				navigate(nextItem?.key ?? defaultItem.key);
			} else {
				navigate(current);
			}
		};

		const closeCurrent = () => {
			if (current === defaultItem.key) return;
			close(current);
		};

		const closeLeft = (key: string) => {
			const currentIndex = state.items.findIndex((l) => l.key === current);
			const index = state.items.findIndex((l) => l.key === key);
			state.items = state.items.filter((_, i) => i >= index || i === 0);
			if (currentIndex < index) {
				navigate(key);
			}
		};

		const closeRight = (key: string) => {
			const currentIndex = state.items.findIndex((l) => l.key === current);
			const index = state.items.findIndex((l) => l.key === key);
			state.items = state.items.filter((_, i) => i <= index || i === 0);
			if (currentIndex > index) {
				navigate(key);
			}
		};

		const closeOther = (key: string) => {
			const newItems = state.items.filter((l) => l.key === key);
			state.items =
				key === defaultItem.key
					? [...newItems]
					: [defaultItem, ...newItems];
			navigate(key);
		};

		const closeAll = () => {
			state.items = [defaultItem];
			navigate(defaultItem.key);
		};

		return {
			aliveRef,
			defaultItem,
			current,
			menus,
			items: state.items,
			navigate,
			refresh,
			refreshCurrent,
			close,
			closeCurrent,
			closeLeft,
			closeRight,
			closeOther,
			closeAll,
		};
	}, [aliveRef, nav, current, state.items]);

	return (
		<NavBarContext.Provider value={contextValue}>
			{children}
		</NavBarContext.Provider>
	);
};

NavBarProvider.displayName = "NavBarProvider";

function NavBar() {
	const { current, items, navigate } = useNavBar();
	console.log('-->', items);
	return (
		<nav className="flex flex-1 items-end space-x-2 h-12 overflow-x-auto overflow-y-hidden [&_.ant-tabs-nav]:mb-0">
			<Tabs
				hideAdd
				type="editable-card"
				activeKey={current}
				items={items.map(({ key, ...o }) => ({
					key,
					label: <NavBarItem id={key} {...o} />,
					closable: false,
				}))}
				onTabClick={(key) => {
					navigate(key);
				}}
			/>
		</nav>
	);
}

NavBar.diplayName = "NavBar";

function NavBarItem({ id }: { id: string } & MenuItem) {
	const { menus, defaultItem, refresh, close, closeOther, closeLeft, closeRight } = useNavBar();

	const items: MenuProps['items'] = useMemo(() => {
		return [
			{
				key: 'refresh-current',
				label: (
					<div className="flex items-center space-x-2">
						<RefreshCw className="size-3" />
						<span>
							刷新当前标签页
						</span>
					</div>
				),
			},
			{
				type: 'divider',
			},
			...(id !== defaultItem.key ? [{
				key: 'close-left',
				label: (
					<div className="flex items-center space-x-2">
						<ArrowLeftToLine className="size-3" />
						<span>
							关闭左侧标签页
						</span>
					</div>
				),
			}] : []),
			{
				key: 'close-right',
				label: (
					<div className="flex items-center space-x-2">
						<ArrowRightToLine className="size-3" />
						<span>
							关闭右侧标签页
						</span>
					</div>
				),
			},
			{
				type: 'divider',
			},
			{
				key: 'close-other',
				label: (
					<div className="flex items-center space-x-2">
						<Minus className="size-3" />
						<span>
							关闭其他标签页
						</span>
					</div>
				),
			},
			...(id !== defaultItem.key ? [{
				key: 'close-current',
				label: (
					<div className="flex items-center space-x-2">
						<X className="size-3" />
						<span>
							关闭当前标签页
						</span>
					</div>
				),
			}] : []),
		]
	}, [id, defaultItem]);

	const menu = useMemo(() => {
		return searchItemByKey(menus, id!);
	}, [id]);

	return (
		<Dropdown
			menu={{
				items, onClick: ({ domEvent, key }) => {
					domEvent.stopPropagation();
					if ('refresh-current' === key) {
						refresh(id);
					}
					if ('close-left' === key) {
						closeLeft(id);
					}
					if ('close-right' === key) {
						closeRight(id);
					}
					if ('close-other' === key) {
						closeOther(id);
					}
					if ('close-current' === key) {
						close(id);
					}
				}
			}}
			placement="bottom"
			trigger={['contextMenu']}
		>
			<div
				className={cn(
					"flex justify-center items-center py-1 h-6",
					defaultItem.key === menu?.key && "mr-1"
				)}
			>
				<div className="flex justify-center items-center size-6 p-0">
					{menu?.icon}
				</div>
				<div className="mr-1">{menu?.label}</div>
				{defaultItem.key !== menu?.key && (
					<div
						className="flex justify-center items-center size-5 p-0 rounded hover:bg-primary hover:text-primary-foreground"
						onClick={(e) => {
							e.stopPropagation();
							close(menu?.key);
						}}
					>
						<X className="size-4" />
					</div>
				)}
			</div>
		</Dropdown>
	);
}

export { NavBar, NavBarProvider, useNavBar };
