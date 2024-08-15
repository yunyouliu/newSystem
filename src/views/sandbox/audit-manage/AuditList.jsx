import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Tag, message, Button, notification } from "antd";
import { useNavigate } from "react-router-dom";

export default function AuditList() {
  const { username } = JSON.parse(localStorage.getItem("token"));
  const [dataSource, setDataSource] = useState([]);
  const [CategoryList, setCategoryList] = useState([]);
  const navigate = useNavigate();
  const color = ["blue", "orange", "green", "red"];
  const auditList = ["待审核", "审核中", "已通过", "未通过"];
  const [api, contextHolder] = notification.useNotification();
  // 获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [category, News] = await Promise.all([
          axios("/categories"),
          axios(`/news?author=${username}&auditState_ne=0&publishState_lte=1`),
        ]);
        setDataSource(News.data);
        setCategoryList(category.data);
      } catch (error) {
        message.error("数据获取失败");
      }
    };
    fetchData();
  }, [username]);

  // 撤销
  const handleRervert = (item) => {
    axios
      .patch(`/news/${item.id}`, {
        auditState: 0,
      })
      .then((res) => {
        setDataSource(dataSource.filter((data) => data.id != item.id));
        //notify 提示 在右下角
        api.info({
          message: "提示",
          description: "撤销成功",
          placement: "bottomRight",
        });
      });
  };

  //   发布
  const handlePublish = async (item) => {
    try {
      await axios.patch(`/news/${item.id}`, {
        publishState: 2,
        publishTime: Date.now(),
      });
  
      setDataSource(dataSource.filter((data) => data.id != item.id));
  
      // 显示通知
      api.success({
        message: "提示",
        description: "您可以到发布管理中查看您的新闻",
        placement: "bottomRight",
      });
  
      // 设置一个短暂的延时后跳转
      setTimeout(() => {
        navigate("/index/publish-manage/published");
      }, 1500); // 适当调整延时
    } catch (error) {
      console.error("发布失败", error);
    }
  };
  

  // 更新
  const handleUpdate = (item) => {
    navigate(`/index/news-manage/update/${item.id}`);
  };

  // 表格列定义
  const columns = [
    {
      title: "新闻标题",
      dataIndex: "title",
      render: (title, item) => (
        <a href={`/index/news-manage/preview/${item.id}`}>{title}</a>
      ),
    },
    {
      title: "作者",
      dataIndex: "author",
    },
    {
      title: "新闻分类",
      dataIndex: "categoryId",
      render: (categoryId) =>
        CategoryList.find((item) => item.id === categoryId).title,
    },
    {
      title: "审核状态",
      dataIndex: "auditState",
      render: (auditState) => (
        <Tag color={color[auditState]}>{auditList[auditState]}</Tag>
      ),
    },
    {
      title: "操作",
      render: (item) => (
        <div>
          {item.auditState == 1 && (
            <Button
              danger
              onClick={() => {
                handleRervert(item);
              }}
            >
              撤销
            </Button>
          )}
          {item.auditState == 2 && (
            <Button
              onClick={() => {
                handlePublish(item);
              }}
            >
              发布
            </Button>
          )}
          {item.auditState == 3 && (
            <Button
              type="primary"
              onClick={() => {
                handleUpdate(item);
              }}
            >
              更新
            </Button>
          )}
        </div>
      ),
    },
  ];
  return (
    <>
      {contextHolder}
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
    </>
  );
}
