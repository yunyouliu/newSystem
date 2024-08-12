import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
export default function Audit() {
  const [dataSource, setdataSource] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const { roleId, region, username } = JSON.parse(
    localStorage.getItem("token")
  );

  useEffect(() => {
    // 获取数据
    const fechData = async () => {
      try {
        const [category, News] = await Promise.all([
          axios("/categories"),
          axios(`/news?auditState=1`),
        ]);

        let data = News.data.filter((item) =>
          roleId === 1
            ? true
            : roleId === 2
            ? item.region === region
            : item.author === username &&
              (region ? item.region === region : true)
        );
        setdataSource(data);
        setCategoryList(category.data);
      } catch (error) {
        // message.error("数据获取失败");
      }
    };
    fechData();
  }, [roleId, region, username]);

  const handleCheck = (item, auditState,publishState) => {
    setdataSource(dataSource.filter((data) => data.id !== item.id));
    axios.patch(`/news/${item.id}`, {
      auditState,
      publishState,
    });
  };

  // 表格列定义
  const columns = [
    {
      title: "标题",
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
      title: "分类",
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
          <Button
            shape="circle"
            title="通过"
            icon={<CheckOutlined />}
            type="primary"
            onClick={() => {
              handleCheck(item, 2,1);
            }}
          />
          <Button
            shape="circle"
            title="驳回"
            icon={<CloseOutlined />}
            danger
            type="primary"
            className="ml-2"
            onClick={() => {
              handleCheck(item, 3,0);
            }}
          />
        </div>
      ),
    },
  ];
  return (
    <div>
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
    </div>
  );
}
