import { PageContainer } from "@ant-design/pro-components";


export default function Dashboard() {
	return (
		<PageContainer title="总览">
			<div className="space-y-4 pb-4">
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				</div>
				<div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-6">
					<div className="col-span-1 lg:col-span-4">

					</div>
					<div className="col-span-1 lg:col-span-2">

					</div>
				</div>
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
					<div className="col-span-1 lg:col-span-3">

					</div>
					<div className="col-span-1 lg:col-span-4">

					</div>
				</div>
			</div>
		</PageContainer>
	);
}
