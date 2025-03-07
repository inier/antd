import { NavBarProvider } from "@/components/custom/NavBar";
import NavHeader from "@/components/custom/NavHeader";
import SideBar from "@/components/custom/SideBar";
import Loading from "@/components/ui/Loading";
import globalModel from "@/models/global.model";
import { menus } from "@/router";
import { Layout } from "antd";
import KeepAlive, { useKeepAliveRef } from "keepalive-for-react";
import { Suspense, useMemo } from "react";
import { Await, Navigate, useLocation, useOutlet } from "react-router-dom";

const { Content } = Layout;

export default function MainLayout() {
	const location = useLocation();
	const aliveRef = useKeepAliveRef();
	const outlet = useOutlet();

	const currentCacheKey = useMemo(() => {
		return location.pathname + location.search;
	}, [location.pathname, location.search]);

	return (
		<NavBarProvider aliveRef={aliveRef} current={currentCacheKey} menus={menus}>
			<Layout className="w-screen h-screen flex overflow-x-hidden">
				<SideBar active={currentCacheKey} />
				<Layout>
					<NavHeader />
					<Content className="bg-secondary">
						<KeepAlive
							aliveRef={aliveRef}
							activeCacheKey={currentCacheKey}
							transition
							max={18}
						>
							<Suspense fallback={<Loading />}>
								<Await resolve={globalModel.load()}>
									{(res) => {
										if (!res?.user) {
											return (
												<Navigate
													to="/login"
													state={{ from: location }}
													replace
												/>
											);
										}
										return outlet;
									}}
								</Await>
							</Suspense>
						</KeepAlive>
					</Content>
				</Layout>
			</Layout>
		</NavBarProvider>
	);
}
