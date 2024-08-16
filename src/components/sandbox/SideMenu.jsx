import React, { useEffect, useMemo, useState } from "react";
import { Menu, Layout, message, Image } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  HomeOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  KeyOutlined,
  CustomerServiceOutlined,
  AuditOutlined,
  ContainerOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const iconList = {
  "/home": <HomeOutlined />,
  "/right-manage/role/list": <SafetyCertificateOutlined />,
  "/right-manage/right/list": <KeyOutlined />,
  "/user-manage/list": <UserOutlined />,
  "/right-manage": <SafetyCertificateOutlined />,
  "/user-manage": <UserOutlined />,
  "/news-manage": <CustomerServiceOutlined />,
  "/audit-manage": <AuditOutlined />,
  "/publish-manage": <ContainerOutlined />,
};

// 权限检查函数
const checkPermission = (item, rights) =>
  item.pagepermisson === "1" && rights.includes(item.key);

/**
 * 根据权限过滤并处理菜单列表，生成适合前端路由的菜单数据。
 * @param {Array} menuList - 原始菜单列表，包含所有菜单项及其权限信息。
 * @param {Array} rights - 当前用户的权限列表。
 * @returns {Array} - 返回过滤后的菜单列表，每个菜单项包含路由信息。
 */
const MenuList = (menuList, rights) => {
  return menuList
    .filter((item) => checkPermission(item, rights)) // 过滤出有权限的菜单项
    .map((item) => {
      const hasChildren = item.children && item.children.length > 0;

      return {
        key: `/index${item.key}`, // 菜单项的唯一标识，拼接了前缀
        icon: iconList[item.key], // 菜单项的图标
        label: item.title, // 菜单项的显示名称
        ...(hasChildren
          ? { children: MenuList(item.children, rights) } // 如果有子菜单，递归处理子菜单
          : { path: item.id }), // 如果没有子菜单，设置菜单项的路由路径
      };
    });
};

export default function SideMenu() {
  // const [collapsed, setCollapsed] = useState(false); // 是否折叠菜单
  const [menu, setMenu] = useState([]); // 菜单数据
  const [selectedKey, setSelectedKey] = useState(""); // 当前选中的菜单项
  const [rights, setRights] = useState([]); // 当前用户的权限
  const [openKeys, setOpenKeys] = useState([]); // 当前展开的菜单项
  const navigate = useNavigate();
  const location = useLocation();
  const collapsed = useSelector((state) => state.collapse.collapse);
  // 获取用户权限
  const fetchRoleRights = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      if (token) {
        setRights(token.role.rights);
      } else {
        message.error("用户未登录");
        navigate("/login");
      }
    } catch (error) {
      message.error("获取用户权限失败");
    }
  };

  // 根据 URL 更新选中的菜单项
  useEffect(() => {
    const keyFromURL = location.pathname;
    setSelectedKey(keyFromURL);
    // 确保展开的菜单项包含选中的菜单项的祖先
    const findOpenKeys = (menuList, path) => {
      let openKeys = [];
      for (const item of menuList) {
        if (item.key === path) {
          return [item.key];
        }
        if (item.children) {
          const childrenOpenKeys = findOpenKeys(item.children, path);
          if (childrenOpenKeys.length > 0) {
            return [item.key, ...childrenOpenKeys];
          }
        }
      }
      return openKeys;
    };
    setOpenKeys(findOpenKeys(MenuList(menu, rights), keyFromURL));
  }, [location, menu, rights]);

  // 处理菜单项点击事件
  const handleClick = ({ key }) => {
    setSelectedKey(key);
    navigate(key);
  };

  // 获取菜单数据
  const fetchMenuData = async () => {
    try {
      const response = await axios("/rights?_embed=children");
      // console.log("菜单数据:", response.data);
      setMenu(response.data);
    } catch (error) {
      message.error("菜单数据获取失败");
    }
  };

  useEffect(() => {
    fetchRoleRights();
    fetchMenuData();
  }, []);

  // 使用 useMemo 进行菜单数据的缓存
  const memoizedMenuList = useMemo(
    () => MenuList(menu, rights),
    [menu, rights]
  );
  // console.log("memoizedMenuList:", memoizedMenuList);

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="h-full flex flex-col">
        {collapsed ? (
          <Image
            src="https://fastcdn.mihoyo.com/content-v2/hk4e/123896/22609467819303b436883092635ae97a_4011523226064594332.png"
            width={76}
            height={60}
            alt=""
          />
        ) : (
          <div className="leading-[42px] text-white bg-neutral-500 bg-opacity-40 text-[18px] m-2.5 text-center">
            全球新闻发布管理系统
          </div>
        )}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]} // 当前选中的菜单项
          openKeys={openKeys} // 当前展开的菜单项
          items={memoizedMenuList} // 菜单项数据
          onClick={handleClick} // 菜单项点击事件处理
          onOpenChange={(keys) => setOpenKeys(keys)} // 菜单展开状态改变处理
          style={{ flex: 1, overflow: "auto", marginTop: "6px" }}
        />
      </div>
    </Sider>
  );
}
