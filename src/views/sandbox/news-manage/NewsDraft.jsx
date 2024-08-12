import React, { useState, useEffect } from "react";
import { Table, Button, Popconfirm, message, notification } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  DeleteOutlined,
  EditOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";

const NewsDraft = () => {
  const [dataSource, setDataSource] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const { username } = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();

  // 获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [category, News] = await Promise.all([
          axios("/categories"),
          axios(`/news?author=${username}&auditState=0`),
        ]);
        setDataSource(News.data);
        setCategoryList(category.data);
      } catch (error) {
        message.error("数据获取失败");
      }
    };
    fetchData();
  }, [username]);

  // 处理删除操作
  const handleDelete = async (item) => {
    // 本地过滤掉数据
    setDataSource(dataSource.filter((data) => data.id !== item.id));

    // 发起删除请求
    await axios.delete(`/news/${item.id}`);
  };

  const handleCheck = (id) => {
    axios
      .patch(`/news/${id}`, {
        auditState: 1,
      })
      .then(() => {
        notification.info({
          message: "通知",
          description: "您可以到审核列表中查看",
          placement: "bottomRight",
        });

        setTimeout(() => {
          navigate("/index/audit-manage/list");
        }, 1000);
      });
  };

  // 表格列定义
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => <b>{id}</b>,
    },
    {
      title: "新闻标题",
      dataIndex: "title",
      render: (title, item) => (
        <a
          className="text-sky-700"
          href={`/index/news-manage/preview/${item.id}`}
        >
          {title}
        </a>
      ),
    },
    {
      title: "作者",
      dataIndex: "author",
    },
    {
      title: "新闻分类",
      dataIndex: "categoryId",
      render: (categoryId) => {
        const category = categoryList.find((item) => item.id === categoryId);
        return category ? category.title : "未知分类";
      },
    },
    {
      title: "操作",
      render: (item) => (
        <div>
          <Popconfirm
            title="删除"
            description="真的要删除吗？"
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
          <Button
            shape="circle"
            title="编辑"
            icon={<EditOutlined />}
            onClick={() => {
              navigate(`/index/news-manage/update/${item.id}`);
            }}
          />
          <Button
            shape="circle"
            title="提交"
            icon={<VerticalAlignTopOutlined />}
            type="primary"
            onClick={() => {
              handleCheck(item.id);
            }}
          />
        </div>
      ),
    },
  ];

  return (
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
  );
};

export default NewsDraft;
