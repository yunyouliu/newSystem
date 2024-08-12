import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import NewsForm from "@components/news-manage/NewsForm";

const NewsUpdate = () => {
  const { id } = useParams();
  const [newsData, setNewsData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios(`/news/${id}`).then((res) => {
      setNewsData(res.data);
    });
  }, [id]);

  return newsData ? (
    <div>
      <div className="flex items-center mb-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="mr-2"
        />
      </div>
      <NewsForm title="新闻更新" newsData={newsData} />
    </div>
  ) : (
    <div>加载中...</div>
  );
};

export default NewsUpdate;
