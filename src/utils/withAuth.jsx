import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { message } from "antd";

const WithAuth = ({ component: Component, ...rest }) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const isAuthenticated = token && token.roleState === true;
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // 检查 token 是否存在并解构出 rights
  let allowedPaths = token?.role?.rights || [];
  // 给所有路径加上 /index 前缀
  allowedPaths = allowedPaths.map((path) => `/index${path}`);

  // console.log("Allowed paths:", allowedPaths);
  // console.log("当前请求的路径:", currentPath);

  // 检查当前路径是否在允许的路径列表中
  const isPathAllowed = allowedPaths.includes(currentPath);
  // console.log("Is path allowed:", isPathAllowed);

  useEffect(() => {
    if (!isAuthenticated) {
      // 未认证，重定向到登录页
      navigate("/login", { state: { from: location }, replace: true });
    } else if (!isPathAllowed) {
      // 认证了但路径不允许，进行处理
      message.warning("403 forbidden");
      // 使用 navigate 的条件判断
      if (window.history.length > 2) {
        setTimeout(() => {
          navigate(-1); // 返回上一页
        }, 700);
      } else {
        navigate("/index"); // 返回一个预定义的错误页面
      }
    }
  }, [isAuthenticated, isPathAllowed, location, navigate]);

  // 在导航发生之前，返回 null，避免渲染组件
  if (!isAuthenticated || !isPathAllowed) {
    return null;
  }

  return <Component {...rest} />;
};

// PropTypes validation
WithAuth.propTypes = {
  component: PropTypes.elementType.isRequired,
};

export default WithAuth;
