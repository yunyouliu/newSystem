import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Table, Button } from "antd";
import axios from "axios";
const NewsPlublish = ({ data, title, callback }) => {
  const [categoryList, setcategoryList] = useState([]);
  useEffect(() => {
    axios("/categories").then((res) => {
      setcategoryList(res.data);
    });
  }, []);
  // 表格列定义
  const columns = [
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
          <Button
            type="primary"
            onClick={() => {
              callback(item.id);
            }}
          >
            {title}
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div>
      {}
      <Table
        rowKey={(item) => item.id}
        columns={columns}
        dataSource={data}
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
};

NewsPlublish.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  title: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
};

export default NewsPlublish;
