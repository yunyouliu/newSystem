import React, { useState, useEffect } from "react";
import { Table, Button, Popconfirm, message, Modal, Tree } from "antd";
import axios from "axios";
import { DeleteOutlined, UnorderedListOutlined } from "@ant-design/icons";

export default function RoleList() {
  // 状态管理
  const [dataSource, setDataSource] = useState([]); // 存储角色列表数据
  const [rightList, setRightList] = useState([]); // 存储权限列表数据
  const [checkedKeys, setCheckedKeys] = useState([]); // 当前选中的权限 keys
  const [isModalOpen, setIsModalOpen] = useState(false); // 控制模态框的显示
  const [currentId, setCurrentId] = useState(0); // 当前正在编辑的角色 ID

  // 取消操作的处理函数
  const cancel = (e) => {
    // console.log(e);
    message.error("取消操作");
  };

  // 显示模态框的函数，并初始化当前选中的权限
  const showModal = (item) => {
    setIsModalOpen(true); // 打开模态框
    setCheckedKeys(item.rights); // 设置选中的权限
    setCurrentId(item.id); // 设置当前正在编辑的角色 ID
  };

  // 确认权限分配后的处理函数
  const handleOk = () => {
    // 更新本地角色数据
    const updatedData = dataSource.map((item) =>
      item.id === currentId ? { ...item, rights: checkedKeys } : item
    );
    setDataSource(updatedData);

    // 更新后端数据
    axios
      .patch(`/roles/${currentId}`, {
        rights: checkedKeys,
      })
      .then(() => {
        message.success("更新成功");
      })
      .catch(() => {
        message.error("更新失败");
      });

    // 关闭模态框
    setIsModalOpen(false);
  };

  // 取消模态框的处理函数
  const handleCancel = () => {
    setIsModalOpen(false); // 关闭模态框
  };

  // 删除角色的处理函数
  const handleDelete = (item) => {
    setDataSource(dataSource.filter((data) => data.id !== item.id)); // 本地删除角色数据
    axios
      .delete(`/roles/${item.id}`) // 后端删除角色数据
      .then(() => {
        message.success("删除成功");
      })
      .catch(() => {
        message.error("删除失败");
      });
  };

  // 处理权限树中勾选变化的函数
  const onCheck = (checkedKeys) => {
    setCheckedKeys(checkedKeys.checked); // 更新选中的权限 keys
  };

  // 定义表格的列
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => <b>{id}</b>, // 加粗显示 ID
    },
    {
      title: "角色名称",
      dataIndex: "roleName", // 显示角色名称
    },
    {
      title: "操作",
      render: (item) => (
        <div>
          <Popconfirm
            title="确定删除该角色吗？"
            onConfirm={() => handleDelete(item)} // 确认删除角色
            onCancel={cancel} // 取消删除
            okText="是"
            cancelText="否"
          >
            <Button
              shape="circle"
              title="删除"
              icon={<DeleteOutlined />} // 删除图标
              danger
            />
          </Popconfirm>
          <Button
            type="primary"
            shape="circle"
            title="编辑"
            icon={<UnorderedListOutlined />} // 编辑图标
            onClick={() => showModal(item)} // 点击显示权限分配模态框
          />
        </div>
      ),
    },
  ];

  // 获取角色列表数据
  useEffect(() => {
    axios
      .get("/roles")
      .then((res) => {
        setDataSource(res.data); // 设置角色列表数据
      })
      .catch(() => {
        message.error("获取角色列表失败"); // 获取失败的提示
      });
  }, []);

  // 获取权限列表数据
  useEffect(() => {
    axios
      .get("/rights?_embed=children")
      .then((res) => {
        setRightList(res.data); // 设置权限列表数据
      })
      .catch(() => {
        message.error("获取权限列表失败"); // 获取失败的提示
      });
  }, []);

  return (
    <div>
      <Table
        dataSource={dataSource} // 表格数据源
        rowKey={(item) => item.id} // 设置唯一 key
        columns={columns} // 表格列定义
      />
      <Modal
        title="权限分配"
        open={isModalOpen} // 控制模态框是否显示
        onOk={handleOk} // 点击确认后的处理函数
        onCancel={handleCancel} // 点击取消后的处理函数
      >
        <Tree
          checkable // 启用勾选功能
          checkStrictly // 启用严格勾选模式，不关联父子节点
          onCheck={onCheck} // 处理勾选变化
          treeData={rightList} // 权限树的数据源
          checkedKeys={{ checked: checkedKeys }} // 当前选中的 keys
        />
      </Modal>
    </div>
  );
}
