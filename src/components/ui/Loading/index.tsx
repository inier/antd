import { Spin } from "antd";

interface LoadingProps {
    tip?: string;
    childeren?: React.ReactNode
}

export default function Loading({ tip = '加载中...', childeren }: LoadingProps) {
    return (
        <div className="flex justify-center items-center">
            <Spin tip={tip} size="large">
                {childeren}
            </Spin>
        </div>
    );
}