import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import PageLayout from './components/layout';
import useConfigStore from './store/config';

const App: React.FC = () => {
  const theme = useConfigStore(state => state.themeConfig)
  const navigate = useNavigate()

  // TODO: refactor this logic
  if (window.location.pathname === '/') {
    setTimeout(() => {
      navigate('/login')
    })
  }

  return (
    <ConfigProvider locale={zhCN} theme={{
      algorithm: theme.algorithm,
      token: {
        colorPrimary: theme.primaryColor
      }
    }}>
      <PageLayout />
    </ConfigProvider>
  )
};

export default App;
