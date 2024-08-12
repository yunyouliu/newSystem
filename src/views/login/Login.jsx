import React, { useEffect, useState, useRef } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ParticleBackground from "@/utils/ParticleBackground";

// 登录组件
const Login = () => {
  const navigate = useNavigate();
  const usernameInputRef = useRef(null); // 创建输入框的引用
  const [loading, setLoading] = useState(false); // 加载状态

  /**
   * 表单提交处理函数
   * @param {object} values 表单提交的值
   */
  const onFinish = async (values) => {
    setLoading(true); // 开始加载

    try {
      // 请求用户信息
      const userResponse = await axios(
        `/users?username=${values.username}&password=${values.password}`
      );

      const userData = userResponse.data[0];

      if (!userData) {
        message.error("用户名或密码错误");
        setLoading(false); // 结束加载
        return;
      }

      if (!userData.roleState) {
        message.error("该用户被禁用");
        setLoading(false); // 结束加载
        return;
      }

      // 请求角色信息
      const roleResponse = await axios(`/roles?id=${userData.roleId}`);

      const role = roleResponse.data[0];

      // 创建 token 对象
      const token = {
        ...userData,
        role: role,
        password: undefined,
      };

      localStorage.setItem("token", JSON.stringify(token));
      // message.success("登录成功");
      navigate("/index/home");
    } catch (error) {
      message.error("登录请求失败，请稍后再试", error);
    } finally {
      setLoading(false); // 确保在所有请求完成后结束加载状态
    }
  };

  // 使用useEffect钩子在组件挂载后让用户名输入框获得焦点
  useEffect(() => {
    if (usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
  }, []);

  // 返回登录页面的HTML结构
  return (
    <div
      className="h-full overflow-hidden z-50"
      style={{
        backgroundImage: `url(${"https://uploadstatic.mihoyo.com/contentweb/20210719/2021071918001232800.jpg"})`,
        backgroundSize: "cover",
      }}
    >
      <ParticleBackground />
      <div className="fixed bg-black/70 w-[500px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
        <div className="text-center h-[80px] leading-[80px] text-[30px] text-white">
          全球新闻发布管理系统
        </div>
        <Form
          name="normal_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          className="h-[190px] w-full"
        >
          <Form.Item
            name="username"
            hasFeedback
            rules={[{ required: true, message: "请输入用户名!" }]}
          >
            <Input
              ref={usernameInputRef} // 绑定输入框引用
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="用户名"
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item
            name="password"
            hasFeedback
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item className="text-center mx-auto">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

Login.displayName = "Login";

export default Login;
