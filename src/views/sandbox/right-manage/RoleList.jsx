import React, { useState, useEffect } from "react";
import { Table, Button, Popconfirm, message, Modal, Tree } from "antd";
import axios from "axios";
import { DeleteOutlined, UnorderedListOutlined } from "@ant-design/icons";

export default function RoleList() {
  const [dataSource, setDataSource] = useState([]); // 角色列表数据
  const [rightList, setRightList] = useState([]); // 权限列表数据
  const [checkedKeys, setCheckedKeys] = useState([]); // 当前选中的权限
  const [isModalOpen, setIsModalOpen] = useState(false); // 控制模态框显示
  const [currentId, setCurrentId] = useState(0); // 当前正在编辑的角色 ID

  // 取消操作处理
  const cancel = (e) => {
    console.log(e);
    message.error("取消操作");
  };

  // 显示模态框
  const showModal = (item) => {
    setIsModalOpen(true);
    setCheckedKeys(item.rights);
    setCurrentId(item.id);
  };

  // 确认权限分配处理
  const handleOk = () => {
    const updatedData = dataSource.map((item) =>
      item.id === currentId ? { ...item, rights: checkedKeys } : item
    );
    setDataSource(updatedData);

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

    setIsModalOpen(false);
  };

  // 取消模态框处理
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 删除角色处理
  const handleDelete = (item) => {
    setDataSource(dataSource.filter((data) => data.id !== item.id));
    axios
      .delete(`/roles/${item.id}`)
      .then(() => {
        message.success("删除成功");
      })
      .catch(() => {
        message.error("删除失败");
      });
  };

  // 处理权限树的勾选变化
  const onCheck = (checkedKeys) => {
    setCheckedKeys(checkedKeys);
  };

  // 列定义
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => <b>{id}</b>,
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
    },
    {
      title: "操作",
      render: (item) => (
        <div>
          <Popconfirm
            title="确定删除该角色吗？"
            onConfirm={() => handleDelete(item)}
            onCancel={cancel}
            okText="是"
            cancelText="否"
          >
            <Button
              shape="circle"
              title="删除"
              icon={<DeleteOutlined />}
              danger
            />
          </Popconfirm>
          <Button
            type="primary"
            shape="circle"
            title="编辑"
            icon={<UnorderedListOutlined />}
            onClick={() => showModal(item)}
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
        setDataSource(res.data);
      })
      .catch(() => {
        message.error("获取角色列表失败");
      });
  }, []);

  // 获取权限列表数据
  useEffect(() => {
    axios
      .get("/rights?_embed=children")
      .then((res) => {
        setRightList(res.data);
      })
      .catch(() => {
        message.error("获取权限列表失败");
      });
  }, []);

  return (
    <div>
      <Table
        dataSource={dataSource}
        rowKey={(item) => item.id}
        columns={columns}
      />
      <Modal
        title="权限分配"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          checkable
          onCheck={onCheck}
          treeData={rightList}
          checkedKeys={checkedKeys}
        />
      </Modal>
    </div>
  );
}
