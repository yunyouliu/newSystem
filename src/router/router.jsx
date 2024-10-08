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
const News = lazy(() => import("@views/news/News"));
const Detail = lazy(() => import("@views/news/Detail"));
const NewsPreview = lazy(() =>
  import("@views/sandbox/news-manage/NewsPreview")
);
const NewsUpdate = lazy(() => import("@views/sandbox/news-manage/NewsUpdate"));

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
            <Home />
          </Suspense>
        ),
      },
      {
        path: "right-manage/role/list",
        name: "角色管理",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <RoleList />
          </Suspense>
        ),
      },
      {
        path: "right-manage/right/list",
        name: "权限管理",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <RightList />
          </Suspense>
        ),
      },
      {
        path: "user-manage/list",
        name: "用户列表",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <UserList />
          </Suspense>
        ),
      },
      {
        path: "audit-manage/audit",
        name: "审核管理",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Audit />
          </Suspense>
        ),
      },
      {
        path: "audit-manage/list",
        name: "审核列表",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AuditList />
          </Suspense>
        ),
      },
      {
        path: "news-manage/add",
        name: "添加新闻",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <NewsAdd />
          </Suspense>
        ),
      },
      {
        path: "news-manage/draft",
        name: "草稿箱",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <NewsDraft />
          </Suspense>
        ),
      },
      {
        path: "news-manage/category",
        name: "新闻分类",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <NewsCategory />
          </Suspense>
        ),
      },
      {
        path: "news-manage/preview/:id",
        name: "新闻预览",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <NewsPreview />
          </Suspense>
        ),
      },
      {
        path: "news-manage/update/:id",
        name: "新闻更新",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <NewsUpdate />
          </Suspense>
        ),
      },
      {
        path: "publish-manage/unpublished",
        name: "待发布",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Unpublish />
          </Suspense>
        ),
      },
      {
        path: "publish-manage/published",
        name: "已发布",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Published />
          </Suspense>
        ),
      },
      {
        path: "publish-manage/sunset",
        name: "已下线",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Sunset />
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
    path: "/news",
    name: "新闻",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <News />
      </Suspense>
    ),
  },
  {
    path: "/detail/:id",
    name: "新闻详情页",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Detail />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: <Navigate to={"/news"} />,
    errorElement: (
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorPage />
      </Suspense>
    ),
  },
];

const router = createBrowserRouter(routes);

export default router;
