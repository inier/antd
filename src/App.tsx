import { Button, ConfigProvider, theme, ThemeConfig } from 'antd';
import './App.css';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';

const themeConfig: ThemeConfig = {
  cssVar: {
    prefix: 'ell'
  },
  algorithm: theme.compactAlgorithm
}

const App = () => {
  return (
    <ConfigProvider locale={zhCN} theme={themeConfig}>
      <Button type="primary">Button</Button>
    </ConfigProvider>
  );
};

export default App;
