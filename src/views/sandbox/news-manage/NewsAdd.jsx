import React from "react";
import NewsForm from "@components/news-manage/NewsForm";
import { useLocation } from "react-router-dom";
const NewsAdd = () => {
  const location = useLocation();
  const newsData = location.state?.newsData; // 从路由参数获取新闻数据

  return <NewsForm title="新闻撰写" newsData={newsData} />;
};

export default NewsAdd;
