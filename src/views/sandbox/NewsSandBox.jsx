import React, { useEffect, useState } from "react";
import SideMenux from "@components/sandbox/SideMenu";
import { Layout, theme } from "antd";
import TopHeader from "@components/sandbox/TopHeader";
import { Outlet, useLocation } from "react-router-dom";
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import ErrorBoundary from "@/utils/ErrorBoundary";
import { Provider } from "react-redux";
import { store, persistor } from "@/redux/store";
import Spain from "@/utils/Spain";
import { PersistGate } from "redux-persist/integration/react"; // 引入 PersistGate
const { Content } = Layout;
const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const location = useLocation();

  useEffect(() => {
    nprogress.start(); // 启动进度条
    // 在路由变化时停止进度条
    const handleComplete = () => nprogress.done();
    handleComplete(); // 在路由变化后立即停止进度条

    // 清理函数，确保进度条在组件卸载时被停止
    return () => nprogress.done();
  }, [location]);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Layout className="h-full flex justify-start">
            <SideMenux />
            <Layout>
              <TopHeader />
              <Content className="p-6 mx-4 my-6 min-h-70 bg-gray-50  overflow-auto flex-1">
                <Spain>
                  <Outlet />
                </Spain>
              </Content>
            </Layout>
          </Layout>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
};
export default App;
