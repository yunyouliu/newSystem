import React from "react";
import PropTypes from "prop-types";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

function Spain({ children }) {
  // 从 Redux store 中获取 loading 状态
  const isLoading = useSelector((state) => state.isloading.isloading);
  // console.log(isLoading);
  return (
    <Spin
      indicator={<LoadingOutlined spin />}
      size="large"
      spinning={isLoading}
    >
      {children}
    </Spin>
  );
}

Spain.propTypes = {
  children: PropTypes.node, // 使用 PropTypes 进行 prop 类型验证
};

export default Spain;
