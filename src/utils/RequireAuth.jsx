import React from "react";
import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({ children}) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const isAuthenticated = token && token.roleState === true; // 根据 token 判断是否认证
  const location = useLocation();
  const currentPath = location.pathname;
  const allowedPaths=[]
  console.log(token)

  // 打印当前请求的路径
  console.log("当前请求的路径:", currentPath);

  if (!isAuthenticated && !allowedPaths.includes(currentPath)) {
    // 如果用户未认证且当前路径不在允许的路径列表中，重定向到登录页面，并保存当前路径以便重定向回来
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 如果用户已认证或当前路径在允许的路径列表中，渲染子组件
  return children;
};

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
  // allowedPaths: PropTypes.arrayOf(PropTypes.string),
};

export default RequireAuth;
