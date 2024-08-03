import React, { useState, useEffect } from "react";
import { Table, Button, Popconfirm, message, Switch } from "antd";
import axios from "axios";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import UserForm from "@components/user-manage/userForm.jsx";

export default function UserList() {
  const [dataSource, setDataSource] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [open, setOpen] = useState(false);
  const { roleId, region } = JSON.parse(localStorage.getItem("token"));

  const fetchData = async () => {
    try {
      const [users, roles, regions] = await Promise.all([
        axios.get("/users"),
        axios.get("/roles"),
        axios.get("/regions"),
      ]);

      // 确保ID是number
      let rolesData = roles.data
        .map((role) => ({
          ...role,
          id: Number(role.id),
        }))
        .filter((role) => role.id > Number(roleId));
      let regionsData = regions.data.map((item) => ({
        ...item,
        id: Number(item.id),
      }));
      if (Number(roleId) > 2) {
        regionsData = regionsData.filter((item) => item.value === region);
      }

      // Filter users based on region, unless roleId is 1 (admin)
      let usersData = users.data;
      if (roleId !== 1) {
        usersData = usersData.filter((user) => user.region === region);
      }

      setDataSource(usersData);
      setRoleList(rolesData);
      setRegionList(regionsData);
    } catch (error) {
      message.error("获取数据失败");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (item) => {
    try {
      await axios.delete(`/users/${item.id}`);
      setDataSource(dataSource.filter((data) => data.id !== item.id));
      message.success("删除成功");
    } catch (error) {
      message.error("删除失败");
    }
  };

  const handleSwitchChange = async (item) => {
    try {
      await axios.patch(`/users/${item.id}`, {
        roleState: !item.roleState,
      });
      setDataSource(
        dataSource.map((data) =>
          data.id === item.id ? { ...data, roleState: !data.roleState } : data
        )
      );
      message.success("状态已修改");
    } catch (error) {
      message.error("修改失败");
    }
  };

  const handleCreateOrUpdate = async (values) => {
    if (currentUser) {
      try {
        await axios.patch(
          `/users/${currentUser.id}`,
          values
        );
        setDataSource(
          dataSource.map((data) =>
            data.id === currentUser.id ? { ...data, ...values } : data
          )
        );
        message.success("修改成功");
      } catch (error) {
        message.error("修改失败");
      }
    } else {
      try {
        const response = await axios.post(`/users`, {
          ...values,
          default: false,
          roleState: true,
        });
        setDataSource([...dataSource, response.data]);
        message.success("添加成功");
      } catch (error) {
        message.error("添加失败");
      }
    }
    setOpen(false);
    setCurrentUser(null);
  };

  const columns = [
    {
      title: "区域名称",
      dataIndex: "region",
      filters: [
        ...regionList.map((region) => ({
          text: region.title,
          value: region.value,
        })),
        {
          text: "全球",
          value: "",
        },
      ],
      onFilter: (value, record) => record.region === value,
      render: (region) => <b>{region || "全球"}</b>,
    },
    {
      title: "角色名称",
      dataIndex: "roleId",
      render: (roleId) => {
        const role = roleList.find((role) => role.id === roleId);
        return role ? role.roleName : "未知角色";
      },
    },
    { title: "用户名", dataIndex: "username" },
    {
      title: "用户状态",
      dataIndex: "roleState",
      render: (roleState, item) => (
        <Switch
          checked={roleState}
          disabled={item.default}
          onChange={() => handleSwitchChange(item)}
        />
      ),
    },
    {
      title: "操作",
      render: (item) => (
        <div>
          <Popconfirm
            title="删除"
            description="你确定要删除吗?"
            onConfirm={() => handleDelete(item)}
            onCancel={() => message.error("取消操作")}
            okText="确定"
            cancelText="取消"
            disabled={item.default}
          >
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              danger
              disabled={item.default}
            />
          </Popconfirm>
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => {
              setCurrentUser(item);
              setOpen(true);
            }}
            disabled={item.default}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setCurrentUser(null);
          setOpen(true);
        }}
        className="float-left"
      >
        添加用户
      </Button>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item.id}
        pagination={{
          defaultCurrent: 1,
          defaultPageSize: 5,
          pageSizeOptions: [5, 10, 15, 20],
          showQuickJumper: true,
          showSizeChanger: true,
        }}
      />
      <UserForm
        open={open}
        onCreate={handleCreateOrUpdate}
        onCancel={() => {
          setOpen(false);
          setCurrentUser(null);
        }}
        initialValues={currentUser}
        roleList={roleList}
        regionList={regionList}
      />
    </div>
  );
}
