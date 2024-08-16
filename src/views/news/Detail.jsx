import React, { useEffect, useState } from "react";
import { Descriptions, Badge, Button, Space, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import Icon, { ArrowLeftOutlined, HeartTwoTone } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState({});
  const [categoryList, setCategoryList] = useState([]);
  const [liked, setLiked] = useState(false);
  const colorList = ["warning", "processing", "success", "error"];

  const HeartSvg = () => (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
      <path d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z" />
    </svg>
  );

  const HeartIcon = (props) => <Icon component={HeartSvg} {...props} />;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryResponse, newsResponse] = await Promise.all([
          axios("/categories"),
          axios(`/news?id=${id}`),
        ]);

        const fetchedNews = newsResponse.data[0];
        const updatedView = fetchedNews.view + 1;

        setCategoryList(categoryResponse.data);
        setNews({
          ...fetchedNews,
          view: updatedView,
        });

        // 同步后端，更新新闻的view值
        await axios.patch(`/news/${id}`, { view: updatedView });
      } catch (error) {
        message.error("数据获取失败");
      }
    };
    fetchData();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleLike = () => {
    setNews({
      ...news,
      star: news.star + 1,
    });
    setLiked(true);
    // 同步后端
    axios.patch(`/news/${id}`, { star: news.star + 1 });
    message.success({
      content: "",
      icon: <HeartIcon style={{ color: "hotpink" }} />,
    });
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
      key: "publishTime",
      label: news.publishState < 2 ? "发布状态" : "发布时间",
      children: (
        <Badge
          status={colorList[news.publishState]}
          text={moment(news.publishTime).format("YYYY-MM-DD HH:mm:ss")}
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
        {liked ? (
          <HeartIcon onClick={handleLike} style={{ color: "hotpink" }} />
        ) : (
          <HeartTwoTone twoToneColor="#eb2f96" onClick={handleLike} />
        )}
      </div>
      <Space direction="vertical" size="large" className="w-full">
        <Descriptions title="" items={items} column={3} className="mt-6" />
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

export default Detail;
