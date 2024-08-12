import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Popconfirm, message, Switch } from "antd";
import axios from "axios";
import { DeleteOutlined } from "@ant-design/icons";

export default function RightList() {
  const [dataSource, setDataSource] = useState([]);

  // 获取权限数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios(
          "/rights?_embed=children"
        );
        // 移除没有子权限的字段
        const updatedData = data.map((item) => ({
          ...item,
          children: item.children.length === 0 ? undefined : item.children,
        }));
        setDataSource(updatedData);
      } catch (error) {
        message.error("数据获取失败");
      }
    };
    fetchData();
  }, []);

  // 处理删除操作
  const handleDelete = async (item) => {
    try {
      if (item.grade === 1) {
        // 删除顶级权限
        await axios.delete(`/rights/${item.id}`);
        setDataSource((prev) => prev.filter((data) => data.id !== item.id));
        message.success("删除成功");
      } else {
        // 删除子权限
        await axios.patch(`/rights/${item.rightId}`, {
          children: (
            dataSource.find((data) => data.id === item.rightId)?.children || []
          ).filter((child) => child.id !== item.id),
        });
        setDataSource((prev) =>
          prev.map((data) => {
            if (data.id === item.rightId) {
              return {
                ...data,
                children: (data.children || []).filter(
                  (child) => child.id !== item.id
                ),
              };
            }
            return data;
          })
        );
        message.success("删除成功");
      }
    } catch (error) {
      message.error("删除失败");
    }
  };

  // 处理开关状态改变
  const handleSwitchChange = async (item) => {
    const newPermission = item.pagepermisson === "1" ? "0" : "1";

    try {
      if (item.grade === 1) {
        // 更新顶级权限状态
        await axios.patch(`/rights/${item.id}`, {
          pagepermisson: newPermission,
        });
      } else {
        // 更新子权限状态
        await axios.patch(`/children/${item.id}`, {
          pagepermisson: newPermission,
        });
      }

      // 更新本地数据
      setDataSource((prev) =>
        prev.map((data) => {
          if (data.id === item.id) {
            return { ...data, pagepermisson: newPermission };
          }
          if (data.children) {
            return {
              ...data,
              children: data.children.map((child) =>
                child.id === item.id
                  ? { ...child, pagepermisson: newPermission }
                  : child
              ),
            };
          }
          return data;
        })
      );

      message.success("状态更新成功");
    } catch (error) {
      message.error("状态更新失败");
    }
  };

  // 表格列定义
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <b>{id}</b>,
    },
    {
      title: "权限名称",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "权限路径",
      dataIndex: "key",
      key: "key",
      render: (key) => <Tag color="blue">{key}</Tag>,
    },
    {
      title: "操作",
      render: (item) => (
        <div>
          <Popconfirm
            title="确定删除吗？"
            description="确定要删除这个权限吗？"
            onConfirm={() => handleDelete(item)}
            onCancel={() => message.error("取消删除")}
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
          <Switch
            style={{ marginLeft: 30 }}
            checked={item.pagepermisson === "1"}
            disabled={item.pagepermisson === undefined}
            onChange={() => handleSwitchChange(item)}
          />
        </div>
      ),
    },
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={{
        defaultCurrent: 1,
        defaultPageSize: 5,
        pageSizeOptions: [5, 10, 15, 20],
        showQuickJumper: true,
        showSizeChanger: true,
      }}
    />
  );
}
