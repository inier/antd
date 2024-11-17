import { useFullscreen } from "ahooks";
import { Button, Dropdown, Layout, MenuProps, Tooltip } from "antd";
import { Ellipsis, Expand, Minus, RefreshCw, Shrink, X } from "lucide-react";
import { NavBar, useNavBar } from "../NavBar";

const { Header } = Layout;

const items: MenuProps['items'] = [
    {
        key: 'close-current',
        label: (
            <div className="flex items-center space-x-2">
                <X className="size-4" />
                <span>
                    关闭当前标签页
                </span>
            </div>
        ),
    },
    {
        key: 'close-all',
        label: (
            <div className="flex items-center space-x-2">
                <Minus className="size-4" />
                <span>
                    关闭全部标签页
                </span>
            </div>
        ),
    },
];

export default function NavHeader() {
    const [isFullscreen, { toggleFullscreen }] = useFullscreen(document.body);
    const { refreshCurrent, closeCurrent, closeAll } = useNavBar();

    return (
        <Header className="sticky top-0 z-10 flex items-center justify-between h-12 pr-3 pl-0 bg-background text-foreground">
            <NavBar />
            <div className="flex justify-end items-center space-x-2 ml-4">
                <Dropdown
                    menu={{
                        items, onClick: ({ key }) => {
                            if ('close-current' === key) {
                                closeCurrent();
                            }
                            if ('close-all' === key) {
                                closeAll();
                            }
                        }
                    }}
                    placement="bottom"
                >
                    <Button
                        className="p-2 size-8 text-accent-foreground bg-accent hover:bg-primary hover:text-primary-foreground"
                        type="text"
                    >
                        <Ellipsis />
                    </Button>
                </Dropdown>
                <Tooltip title="刷新当前标签页">
                    <Button
                        className="p-2 size-8 text-accent-foreground bg-accent hover:bg-primary hover:text-primary-foreground"
                        type="text"
                        onClick={refreshCurrent}
                    >
                        <RefreshCw />
                    </Button>
                </Tooltip>
                <Tooltip title={isFullscreen ? "退出全屏" : "进入全屏"}>
                    <Button
                        className="p-2 size-8 text-accent-foreground bg-accent hover:bg-primary hover:text-primary-foreground"
                        type="text"
                        onClick={() => toggleFullscreen()}
                    >
                        {isFullscreen ? <Shrink /> : <Expand />}
                    </Button>
                </Tooltip>
            </div>
        </Header>
    );
}