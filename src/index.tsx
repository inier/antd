import { StyleProvider } from '@ant-design/cssinjs';
import { App, ConfigProvider, type ThemeConfig, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import "./index.css";
import { ProConfigProvider } from '@ant-design/pro-components';
import router from './router';

const themeConfig: ThemeConfig = {
  cssVar: {
    prefix: 'ell'
  },
  algorithm: theme.defaultAlgorithm
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
