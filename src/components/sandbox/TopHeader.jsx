import React, { useState } from "react";
import { Layout, Button, theme, Dropdown, message, Space, Avatar } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
export default function TopHeader() {
  const { Header } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const token = localStorage.getItem("token");
  const { role, username } = JSON.parse(token);
  // console.log(role, username);
  const onClick = ({ key }) => {
    if (key === "2") {
      localStorage.removeItem("token");
      navigate("/login");
      message.info("退出成功", 1);
    }
  };
  const items = [
    {
      label: role.roleName,
      key: "1",
    },
    {
      label: "退出登录",
      key: "2",
    },
  ];
  return (
    <div>
      <Header
        style={{
          padding: 0,
          background: colorBgContainer,
        }}
      >
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="text-[16px] w-[64px] h-[64px] float-left left-8"
        />

        <div className="flex items-center justify-end tracking-[0.04em] font-sans">
          <span className="leading-[1.5] mt-10">
            欢迎<span className="text-green-500">{username}</span>回来
          </span>
          <Dropdown
            menu={{
              items,
              onClick,
            }}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <Space size={24}>
                  <Avatar
                    shape="square"
                    src="https://webstatic.mihoyo.com/upload/contentweb/2022/09/27/a5f2a564298709911b3ceef0289d183c_1572553848866085675.png"
                    icon={<UserOutlined />}
                    className="h-[60px] w-[60px]"
                  />
                </Space>
                {/* <DownOutlined /> */}
              </Space>
            </a>
          </Dropdown>
        </div>
      </Header>
    </div>
  );
}
