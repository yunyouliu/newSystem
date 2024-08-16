import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Col, Row, List } from "antd";
import _ from "lodash";

export default function News() {
  const [news, setnews] = useState([]);
  const [categoryList, setcategoryList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [newsResponse, categoryListResponse] = await Promise.all([
        axios("/news?publishState=2"),
        axios("/categories"),
      ]);

      setcategoryList(categoryListResponse.data);
      setnews(newsResponse.data);
    };
    fetchData();
  }, []);

  // Group news articles by category ID
  const groupedNews = _.groupBy(news, "categoryId");

  return (
    <div
      className="p-8 mx-auto my-0 h-full"
      style={{
        backgroundImage: `url(${"https://patchwiki.biligame.com/images/msgs/c/cc/a8a45yl7gijoj2q3jp6qhm457riicj3.jpg"})`,
        backgroundSize: "cover",
      }}
    >
      <div>
        <span className="ml-4 text-2xl float-left font-bold text-white">
          全球大新闻
        </span>
        <span className="ml-6 text-gray-400 float-left leading-9">
          查看新闻
        </span>
        <a
          className="text-gray-400 z-30 font-bold float-right hover:underline"
          href="/login"
        >
          登录
        </a>
      </div>
      <div className="mt-14">
        <Row gutter={[16, 16]}>
          {Object.keys(groupedNews).map((categoryId) => {
            const category = categoryList.find(
              (item) => item.id === categoryId
            );

            return (
              <Col span={8} key={categoryId}>
                <Card
                  title={category ? category.title : "未知分类"}
                  hoverable
                  bordered
                  className="h-[285px] bg-white bg-opacity-20"
                >
                  <List
                    size="small"
                    pagination={{
                      pageSize: 3,
                    }}
                    dataSource={groupedNews[categoryId]}
                    renderItem={(item) => (
                      <List.Item key={item.id}>
                        <a
                          href={`/detail/${item.id}`}
                          className="text-sm-1 font-bold"
                        >
                          {item.title}
                        </a>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}
