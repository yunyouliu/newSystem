import { useEffect, useState } from "react";
import axios from "axios";
import { notification } from "antd";

function usePublish(props) {
  const { username } = JSON.parse(localStorage.getItem("token"));
  const [news, setnews] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const set = (id) => {
    setnews(news.filter((item) => item.id !== id));
  };
  useEffect(() => {
    const fetchData = () => {
      axios
        .get(`/news?author=${username}&publishState=${props}&_sort=createTime`)
        .then((news) => {
          setnews(news.data);
        });
    };
    fetchData();
  }, [username, props]);

  const handlPublish = (id) => {
    // console.log(id);
    axios
      .patch(`/news/${id}`, { publishState: 2, publishTime: Date.now() })
      .then((res) => {
        set(id);
        api.info({
          message: "提示",
          description: "您已发布新闻",
          placement: "bottomRight",
        });
      });
  };
  const handleOffline = (id) => {
    // console.log(id);
    axios.patch(`/news/${id}`, { publishState: 3 }).then((res) => {
      set(id);
      api.info({
        message: "提示",
        description: "您已下线新闻",
        placement: "bottomRight",
      });
    });
  };
  const handDelete = (id) => {
    // console.log(id);
    axios.delete(`/news/${id}`).then((res) => {
      set(id);
      api.info({
        message: "提示",
        description: "您已删除新闻",
        placement: "bottomRight",
      });
    });
  };

  return {
    news,
    handlPublish,
    handleOffline,
    handDelete,
    contextHolder,
  };
}

export default usePublish;
