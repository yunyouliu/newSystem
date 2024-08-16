import { Card, Col, Row, List, Avatar, Drawer, Modal, Skeleton,Image } from "antd";
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from "echarts/core";

// 引入图表类型，图表类型是基础模块，必须要引入。
import { BarChart, PieChart } from "echarts/charts";

// 引入提示框和标题组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";

// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { SVGRenderer } from "echarts/renderers";
import _ from "lodash";
// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  // CanvasRenderer,
  SVGRenderer,
  PieChart,
]);
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { use } from "echarts";

const { Meta } = Card;
const Home = () => {
  const [viewList, setViewList] = useState([]);
  const [startList, setstartList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [news, setNews] = useState([]);
  // const [xAxis, setAxis] = useState([]);
  // const [data, setData] = useState([]);
  const [UserxAxis, seUsertAxis] = useState([]);
  const [Userdata, setUserData] = useState([]);
  const barRef = useRef();
  const pieRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const { username, region, roleId } = JSON.parse(
    localStorage.getItem("token")
  );
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const initChart = (xAxis, data) => {
    const container = barRef.current;

    // 检查是否已经存在实例，如果有则销毁
    if (echarts.getInstanceByDom(container)) {
      echarts.dispose(container);
    }

    // 重新初始化图表
    const myChart = echarts.init(container);

    var option = {
      title: {
        text: "新闻分类图示",
      },
      tooltip: {},
      legend: {
        data: ["数量"],
      },
      xAxis: {
        data: xAxis,
        axisLabel: {
          interval: 0,
          rotate: 40,
        },
      },
      yAxis: {
        minInterval: 1,
      },
      series: [
        {
          name: "数量",
          type: "bar",
          data: data,
          itemStyle: {
            color: "#4CAF50",
          },
        },
      ],
    };
    myChart.setOption(option);
    window.onresize = () => {
      myChart.resize();
    };

    // 清理副作用
    return () => {
      window.onresize = null;
      if (myChart) {
        myChart.dispose();
      }
    };
  };

  const initPieChart = () => {
    const container = pieRef.current;

    // 检查是否已经存在实例，如果有则销毁

    if (container) {
      // 检查是否已经存在实例，如果有则销毁
      let myChart = echarts.getInstanceByDom(container);
      if (myChart) {
        myChart.dispose(); // 销毁旧实例
      }

      // 初始化新的实例
      myChart = echarts.init(container, null, { renderer: "svg" });
      const option = {
        title: { text: "个人新闻分类", left: "center" },
        tooltip: { trigger: "item" },
        legend: { orient: "vertical", left: "left" },
        series: [
          {
            name: "新闻分类",
            type: "pie",
            radius: "50%",
            data: UserxAxis.map((title, index) => ({
              value: Userdata[index],
              name: title,
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      myChart.setOption(option);
    }
  };

  useEffect(() => {
    const fetechData = async () => {
      try {
        const [categoryList, newsResponse, viewList, startList] =
          await Promise.all([
            axios("/categories"),
            axios(`/news?publishState=2`),
            axios("/news?publishState=2&_limit=8&_sort=view"),
            axios("/news?publishState=2&_limit=8&_sort=start"),
          ]);

        setCategoryList(categoryList.data);
        setNews(newsResponse.data);
        setViewList(viewList.data);
        setstartList(startList.data);
        setLoading(false);

        const groupedData = _.groupBy(newsResponse.data, "categoryId");
        let UserNews = newsResponse.data.filter(
          (item) => item.author === username
        );

        const userdata = [];
        const userxAxis = [];
        const groupedUserData = _.groupBy(UserNews, "categoryId");
        _.map(groupedUserData, (value, key) => {
          const category = categoryList.data.find((item) => item.id === key);
          // console.log(category);
          if (category) {
            userdata.push(value.length);
            userxAxis.push(category.title);
            // console.log(userdata, userxAxis);
          }
        });
        setUserData(userdata);
        seUsertAxis(userxAxis);
        // console.log(UserNews,groupedData);

        // 将分组后的数据转换为 xAxis 和 data 数组
        const xAxis = [];
        const data = [];

        _.map(groupedData, (value, key) => {
          const category = categoryList.data.find((item) => item.id === key);
          // console.log(groupedData)
          if (category) {
            // setAxis(xAxis);
            // setData(data);
            xAxis.push(category.title); // 使用 categoryId 对应的分类名称
            data.push(value.length); // 每个分类的新闻数量
          }
        });

        // 初始化图表
        initChart(xAxis, data);
      } catch (error) {
        console.error("获取数据失败", error);
      }
    };

    fetechData();
  }, [username]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        initPieChart();
      }, 300);
    }

    return () => {
      if (pieRef.current) {
        const myChart = echarts.getInstanceByDom(pieRef.current);
        if (myChart) {
          myChart.dispose(); // 确保在关闭时销毁实例
        }
      }
    };
  }, [open]);

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card
            title={
              <>
                用户最常浏览
                <BarChartOutlined className="ml-4" />
              </>
            }
            bordered
          >
            {loading ? (
              <Skeleton
                paragraph={{
                  rows: 8,
                }}
              />
            ) : (
              <List
                size="small"
                dataSource={viewList}
                renderItem={(item) => (
                  <List.Item>
                    <a
                      className="text-sky-700"
                      href={`/index/news-manage/preview/${item.id}`}
                    >
                      {item.title}
                    </a>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title={
              <>
                用户点赞最多 <BarChartOutlined className="ml-4" />
              </>
            }
            bordered={true}
          >
            {loading ? (
              <Skeleton
                paragraph={{
                  rows: 8,
                }}
              />
            ) : (
              <List
                size="small"
                dataSource={startList}
                renderItem={(item) => (
                  <List.Item>
                    <a
                      className="text-sky-700"
                      href={`/index/news-manage/preview/${item.id}`}
                    >
                      {item.title}
                    </a>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card
            className="h-full"
            cover={
              <Image
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                width={439}
                height={272}
              />
            }
            actions={[
              <SettingOutlined
                key="setting"
                onClick={() => {
                  showDrawer();
                }}
              />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={
                <Avatar
                  className="w-[50px] h-[50px] hover:scale-110 hover:shadow-lg transition-transform duration-200 "
                  src="https://uploadstatic.mihoyo.com/contentweb/20200828/2020082814015644368.png"
                  onClick={showModal}
                />
              }
              title={username}
              description={
                <div>
                  <b>{region ? region : "全球"}</b>
                  <span className="pl-8">
                    {roleId === 1
                      ? "超级管理员"
                      : roleId == 2
                      ? "区域管理员"
                      : "区域编辑"}
                  </span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <div ref={barRef} style={{ height: 400, width: "100%", marginTop: 20 }} />
      <Drawer
        title="个人新闻分类"
        onClose={onClose}
        closable
        open={open}
        width={550}
        afterOpenChange={(visible) => {
          if (visible) {
            initPieChart();
          }
        }}
      >
        <div ref={pieRef} style={{ height: 400, width: "100%" }} />
      </Drawer>
      <Modal
        title="原神启动"
        open={isModalOpen}
        onCancel={handleCancel}
        closable
        destroyOnClose
        width={800}
        height={700}
        footer={null}
      >
        <video
          controls="controls"
          poster="https://webstatic.mihoyo.com/upload/static-resource/2022/10/12/f7f4c02e41bedc654ca1fe27eede7291_8305739300852461374.jpg"
          src="https://webstatic.mihoyo.com/upload/static-resource/2022/10/12/91b92a3f654d409189eae5ee8e74e41c_4117568113820660411.mp4"
          autoPlay
          className=" w-full h-full object-cover z-0"
          preload="auto"
        />
      </Modal>
      );
    </div>
  );
};

export default Home;
