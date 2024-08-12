import React, { useEffect, useState } from "react";
import { Descriptions, Badge, Button, Space, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const NewsPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState({});
  const [categoryList, setCategoryList] = useState([]);
  const auditList = ["待审核", "审核中", "已通过", "未通过"];
  const colorList = ["processing", "warning", "success", "error"];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryResponse, newsResponse] = await Promise.all([
          axios("/categories"),
          axios(`/news?id=${id}`),
        ]);
        setCategoryList(categoryResponse.data);
        setNews(newsResponse.data[0]);
      } catch (error) {
        message.error("数据获取失败");
      }
    };
    fetchData();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  // 查找新闻分类
  const category = categoryList.find(
    (category) => category.id === news?.categoryId
  );

  const items = [
    {
      key: "creator",
      label: "创建者",
      children: news.creator || "admin",
    },
    {
      key: "createTime",
      label: "创建时间",
      children: moment(news.createTime).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      key: "publishTime",
      label: "发布状态",
      children: (
        <Badge
          status={colorList[news.publishState]}
          text={
            news.publishState === 1
              ? moment(news.publishTime).format("YYYY-MM-DD HH:mm:ss")
              : "未发布"
          }
        />
      ),
    },
    {
      key: "star",
      label: "点赞数量",
      children: news.star || 0,
    },
    {
      key: "region",
      label: "区域",
      children: news.region || "全球",
    },
    {
      key: "view",
      label: "访问数量",
      children: news.view || 0,
    },
    {
      key: "auditState",
      label: "审核状态",
      children: (
        <Badge
          status={colorList[news.auditState]}
          text={auditList[news.auditState] || "未审核"}
        />
      ),
    },
    {
      key: "commentCount",
      label: "评论数量",
      children: news.commentCount || 0,
    },
  ];

  return (
    <div className="p-5">
      <div className="float-left">
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className="text-lg"
        >
          返回
        </Button>
        <span className="ml-4 text-4xl">{news.title}</span>
        <span className="ml-6 text-gray-400">
          {category ? category.title : "未知分类"}
        </span>
      </div>
      <Space direction="vertical" size="large" className="w-full">
        <Descriptions title="" items={items} column={4} className="mt-6" />
        <div className="border border-gray-300 box-border text-left p-16">
          <div
            dangerouslySetInnerHTML={{ __html: news.content || "新闻内容" }}
          />
        </div>
        <div className="w-5/12"></div>
      </Space>
    </div>
  );
};

export default NewsPreview;
