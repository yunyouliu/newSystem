import React, { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import WithAuth from "@/utils/withAuth";

// 懒加载组件
const NewsSandBox = lazy(() => import("@views/sandbox/NewsSandBox"));
const Login = lazy(() => import("@views/login/Login"));
const UserList = lazy(() => import("@views/sandbox/user-manage/UserList"));
const Home = lazy(() => import("@views/sandbox/home/Home"));
const RoleList = lazy(() => import("@views/sandbox/right-manage/RoleList"));
const RightList = lazy(() => import("@views/sandbox/right-manage/RightList"));
const Audit = lazy(() => import("@views/sandbox/audit-manage/Audit"));
const AuditList = lazy(() => import("@views/sandbox/audit-manage/AuditList"));
const NewsAdd = lazy(() => import("@views/sandbox/news-manage/NewsAdd"));
const NewsDraft = lazy(() => import("@views/sandbox/news-manage/NewsDraft"));
const NewsCategory = lazy(() =>
  import("@views/sandbox/news-manage/NewsCategory")
);
const Unpublish = lazy(() => import("@views/sandbox/publish-manage/Unpublish"));
const Published = lazy(() => import("@views/sandbox/publish-manage/Published"));
const Sunset = lazy(() => import("@views/sandbox/publish-manage/Sunset"));
const ErrorPage = lazy(() => import("@views/ErrooPage/ErrorPage"));

const routes = [
  {
    path: "/index",
    name: "首页",
    element: (
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="text-lg font-semibold text-gray-600">
              Loading...
            </div>
          </div>
        }
      >
        <WithAuth component={NewsSandBox} />
      </Suspense>
    ),
    children: [
      {
        path: "home",
        name: "首页",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <WithAuth component={Home} />
          </Suspense>
        ),
      },
      {
        path: "right-manage/role/list",
        name: "角色管理",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <WithAuth component={RoleList} />
          </Suspense>
        ),
      },
      {
        path: "right-manage/right/list",
        name: "权限管理",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <WithAuth component={RightList} />
          </Suspense>
        ),
      },
      {
        path: "user-manage/list",
        name: "用户列表",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <WithAuth component={UserList} />
          </Suspense>
        ),
      },
      {
        path: "audit-manage/audit",
        name: "审核管理",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <WithAuth component={Audit} />
          </Suspense>
        ),
      },
      {
        path: "audit-manage/list",
        name: "审核列表",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <WithAuth component={AuditList} />
          </Suspense>
        ),
      },
      {
        path: "news-manage/add",
        name: "添加新闻",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <WithAuth component={NewsAdd} />
          </Suspense>
        ),
      },
      {
        path: "news-manage/draft",
        name: "草稿箱",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <WithAuth component={NewsDraft} />
          </Suspense>
        ),
      },
      {
        path: "news-manage/category",
        name: "新闻分类",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <WithAuth component={NewsCategory} />
          </Suspense>
        ),
      },
      {
        path: "publish-manage/unpublished",
        name: "待发布",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <WithAuth component={Unpublish} />
          </Suspense>
        ),
      },
      {
        path: "publish-manage/published",
        name: "已发布",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <WithAuth component={Published} />
          </Suspense>
        ),
      },
      {
        path: "publish-manage/sunset",
        name: "已下线",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <WithAuth component={Sunset} />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/login",
    name: "登录",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: <Navigate to={"/login"} />,
    errorElement: (
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorPage />
      </Suspense>
    ),
  },
];

const router = createBrowserRouter(routes);

export default router;
