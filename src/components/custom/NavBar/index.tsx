import constants from "@/constants";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/router";

import { useReactive } from "ahooks";
import { Tabs } from "antd";
import { KeepAliveRef } from "keepalive-for-react";
import {
	ArrowLeftToLine,
	ArrowRightToLine,
	Minus,
	RefreshCw,
	X,
} from "lucide-react";
import React, { MutableRefObject, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type NavBarContext = {
	aliveRef: MutableRefObject<KeepAliveRef | undefined>;
	defaultLink: MenuItem;
	current: string;
	menus: MenuItem[];
	links: MenuItem[];
	getLinkIcon: (link: MenuItem) => React.ReactNode;
	navigate: (ket: string) => void;
	refresh: (link: MenuItem) => void;
	refreshCurrent: () => void;
	close: (link: MenuItem) => void;
	closeCurrent: () => void;
	closeLeft: (link: MenuItem) => void;
	closeRight: (link: MenuItem) => void;
	closeOther: (link: MenuItem) => void;
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

const loadLinksFromLocalStorage = (defaultLink: MenuItem) => {
	const storedLinks = localStorage.getItem(
		`${constants.localStorageKeyPrefix}-navbar-links`,
	);
	let links = [];
	if (storedLinks) {
		try {
			links = JSON.parse(storedLinks);
		} catch (error) {
			links = [defaultLink];
		}
	}
	if (!links.length) {
		links = [defaultLink];
	}

	return links;
};

const saveLinksToLocalStorage = (links: MenuItem[]) => {
	localStorage.setItem(
		`${constants.localStorageKeyPrefix}-navbar-links`,
		JSON.stringify(links),
	);
};

const NavBarProvider = ({
	aliveRef,
	current,
	menus,
	getLinkIcon,
	children,
}: React.ComponentProps<"div"> & {
	aliveRef: MutableRefObject<KeepAliveRef | undefined>;
	current: string;
	menus: MenuItem[];
	getLinkIcon: (link: MenuItem) => React.ReactNode;
}) => {
	const state = useReactive<{
		links: MenuItem[];
	}>({
		links: [],
	});
	const nav = useNavigate();
	const defaultLink = menus[0];
	console.log(defaultLink);

	// useEffect(() => {
	// 	state.links = loadLinksFromLocalStorage(defaultLink);
	// }, [defaultLink]);

	useEffect(() => {
		saveLinksToLocalStorage(state.links);
	}, [state.links]);

	const contextValue = React.useMemo<NavBarContext>(() => {
		const navigate = (link: MenuItem) => {
			nav(link.key);
			if (!state.links.some((l) => l.key === link.key)) {
				state.links = [...state.links, link];
			}
		};

		const refresh = (link: MenuItem) => {
			aliveRef.current?.refresh(link.key);
		};

		const refreshCurrent = () => {
			aliveRef.current?.refresh();
		};

		const close = (link: MenuItem) => {
			const index = state.links.findIndex((l) => l.key === link.key);
			const newLinks = [...state.links];
			newLinks.splice(index, 1);
			const nextLink = newLinks[index] ?? newLinks[newLinks.length - 1];
			state.links = newLinks;
			navigate(nextLink);
		};

		const closeCurrent = () => {
			if (current === defaultLink.key) return;
			close({ key: current } as MenuItem);
		};

		const closeLeft = (link: MenuItem) => {
			const currentIndex = state.links.findIndex((l) => l.key === current);
			const index = state.links.findIndex((l) => l.key === link.key);
			state.links = state.links.filter((_, i) => i >= index || i === 0);
			if (currentIndex < index) {
				navigate(link);
			}
		};

		const closeRight = (link: MenuItem) => {
			const currentIndex = state.links.findIndex((l) => l.key === current);
			const index = state.links.findIndex((l) => l.key === link.key);
			state.links = state.links.filter((_, i) => i <= index || i === 0);
			if (currentIndex > index) {
				navigate(link);
			}
		};

		const closeOther = (link: MenuItem) => {
			const newLinks = state.links.filter((l) => l.key === link.key);
			state.links =
				link.key === defaultLink.key
					? [...newLinks]
					: [defaultLink, ...newLinks];
			navigate(link);
		};

		const closeAll = () => {
			state.links = [defaultLink];
			navigate(defaultLink);
		};

		return {
			aliveRef,
			defaultLink,
			current,
			links: state.links,
			getLinkIcon,
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
	}, [aliveRef, nav, current, state.links, getLinkIcon]);

	return (
		<NavBarContext.Provider value={contextValue}>
			{children}
		</NavBarContext.Provider>
	);
};

NavBarProvider.displayName = "NavBarProvider";

function NavBar() {
	const { menus, defaultLink, current, links, getLinkIcon, navigate, close } =
		useNavBar();

	console.log(links);

	const onEdit = (key: string, action: "add" | "remove") => {
		if ("remove" === action) {
			close({ key } as MenuItem);
		}
		if ("add" === action) {
			navigate(key);
		}
	};

	return (
		<nav className="flex flex-1 items-center space-x-2 h-12 overflow-auto">
			{/* {links.map((link) => (
				<NavBarItem
					key={link.key}
					icon={getLinkIcon(link)}
					label={link.label}
					isActive={current === link.key}
					closeable={link.key !== defaultLink.key}
					onClick={() => {
						navigate(link);
					}}
					onClose={() => {
						close(link);
					}}
				/>
			))} */}
			<Tabs
				hideAdd
				type="editable-card"
				items={links.map((l) => ({ key: l.key, label: l.label }))}
				onEdit={onEdit}
			/>
		</nav>
	);
}

NavBar.diplayName = "NavBar";

function NavBarItem({
	className,
	isActive = false,
	closeable = true,
	onClick = () => {},
	onClose = () => {},
	...link
}: React.HTMLAttributes<HTMLAnchorElement> &
	MenuItem & {
		isActive?: boolean;
		closeable?: boolean;
		onClose?: () => void;
	}) {
	const { defaultLink, refresh, close, closeLeft, closeRight, closeOther } =
		useNavBar();

	return (
		<div>{link.label}</div>
		// <ContextMenu>
		// 	<ContextMenuTrigger>
		// 		<a
		// 			className={cn(
		// 				"flex items-center cursor-pointer space-x-2 px-2 py-1 rounded-md bg-background text-foreground hover:bg-accent hover:text-accent-foreground min-w-[60px]",
		// 				isActive &&
		// 					"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
		// 				className,
		// 			)}
		// 			onClick={onClick}
		// 		>
		// 			{link.icon}
		// 			<span className="text-sm">{link.name}</span>
		// 			{closeable && (
		// 				<Button
		// 					className={cn(
		// 						"size-4 hover:bg-primary hover:text-primary-foreground",
		// 						isActive && "hover:bg-background hover:text-foreground",
		// 					)}
		// 					size="icon"
		// 					variant="ghost"
		// 					onClick={(e) => {
		// 						e.stopPropagation();
		// 						onClose();
		// 					}}
		// 				>
		// 					<X />
		// 				</Button>
		// 			)}
		// 		</a>
		// 	</ContextMenuTrigger>
		// 	<ContextMenuContent>
		// 		<ContextMenuItem
		// 			onClick={() => {
		// 				refresh(link);
		// 			}}
		// 		>
		// 			<RefreshCw className="size-4" />
		// 			<span className="ml-1">刷新当前标签页</span>
		// 		</ContextMenuItem>
		// 		{link.key !== defaultLink.key && (
		// 			<>
		// 				<ContextMenuSeparator className="w-full h-[1px] bg-border" />
		// 				<ContextMenuItem onClick={() => closeLeft(link)}>
		// 					<ArrowLeftToLine className="size-4" />
		// 					<span className="ml-1">关闭左侧标签页</span>
		// 				</ContextMenuItem>
		// 				<ContextMenuItem onClick={() => closeRight(link)}>
		// 					<ArrowRightToLine className="size-4" />
		// 					<span className="ml-1">关闭右侧标签页</span>
		// 				</ContextMenuItem>
		// 			</>
		// 		)}
		// 		<ContextMenuSeparator className="w-full h-[1px] bg-border" />
		// 		<ContextMenuItem onClick={() => closeOther(link)}>
		// 			<Minus className="size-4" />
		// 			<span className="ml-1">关闭其他标签页</span>
		// 		</ContextMenuItem>
		// 		{link.key !== defaultLink.key && (
		// 			<ContextMenuItem onClick={() => close(link)}>
		// 				<X className="size-4" />
		// 				<span className="ml-1">关闭当前标签页</span>
		// 			</ContextMenuItem>
		// 		)}
		// 	</ContextMenuContent>
		// </ContextMenu>
	);
}

NavBarItem.displayName = "NavBarItem";

export { NavBar, NavBarItem, NavBarProvider, useNavBar };
