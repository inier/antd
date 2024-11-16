import { StyleProvider } from '@ant-design/cssinjs';
import { App, ConfigProvider, theme, ThemeConfig } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import "./index.css";
import router from './router';
import { ProConfigProvider } from '@ant-design/pro-components';

const themeConfig: ThemeConfig = {
  cssVar: {
    prefix: 'ell'
  },
  algorithm: theme.compactAlgorithm
}

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <ConfigProvider locale={zhCN} theme={themeConfig}>
      <ProConfigProvider>
        <StyleProvider layer>
          <App>
            <RouterProvider router={router} />
          </App>
        </StyleProvider>
      </ProConfigProvider>
    </ConfigProvider>
  );
}
