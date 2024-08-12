import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Typography,
  Steps,
  Input,
  Form,
  Select,
  message,
  notification,
} from "antd";
import axios from "axios";
import RichTextEditor from "@components/tinymce/RichTextEditor";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const NewsForm = ({ newsData, title }) => {
  const [current, setCurrent] = useState(0);
  const [categoryList, setCategoryList] = useState([]);
  const [info, setInfo] = useState(newsData || {});
  const [content, setContent] = useState(newsData?.content || "");
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { region, roleId, username } = JSON.parse(
    localStorage.getItem("token")
  );
  const [api, contextHolder] = notification.useNotification();

  const steps = [
    { title: "基本信息", description: "新闻标题，新闻分类" },
    { title: "新闻主题", description: "新闻主体内容" },
    { title: "新闻提交", description: "保存草稿或提交审核" },
  ];

  useEffect(() => {
    axios("/categories").then((res) => setCategoryList(res.data));
  }, []);

  useEffect(() => {
    if (newsData) {
      form.setFieldsValue({
        title: newsData.title,
        categoryId: newsData.categoryId,
      });
      setContent(newsData.content);
    }
  }, [newsData, form]);

  const handleEditorChange = (content) => setContent(content);

  const handleSave = (auditState) => {
    const news = {
      ...info,
      content,
      author: username,
      createTime: newsData ? newsData.createTime : Date.now(),
      auditState,
      star: newsData ? newsData.star : 0,
      publishState: newsData ? newsData.publishState : 0,
      region: region || "全球",
      view: newsData ? newsData.view : 0,
      roleId,
    };

    if (newsData) {
      axios.put(`/news/${newsData.id}`, news).then((res) => {
        api.info({
          message: "通知",
          description: `您可以到${
            auditState === 0 ? "草稿箱" : "审核列表"
          }中查看`,
          placement: "bottomRight",
        });
        setTimeout(() => {
          navigate(
            auditState === 0
              ? "/index/news-manage/draft"
              : "/index/audit-manage/list"
          );
        }, 2000);
      });
    } else {
      axios.post("/news", news).then((res) => {
        api.info({
          message: "通知",
          description: `您可以到${
            auditState === 0 ? "草稿箱" : "审核列表"
          }中查看`,
          placement: "bottomRight",
        });
        setTimeout(() => {
          navigate(
            auditState === 0
              ? "/index/news-manage/draft"
              : "/index/audit-manage/list"
          );
        }, 1500);
      });
    }
  };

  const renderButtons = () => (
    <div className="flex space-x-4">
      {current < steps.length - 1 && (
        <Button type="primary" onClick={next} className="w-28">
          下一步
        </Button>
      )}
      {current > 0 && (
        <Button onClick={prev} className="w-28">
          上一步
        </Button>
      )}
      {current === steps.length - 1 && (
        <>
          <Button type="primary" className="w-28" onClick={() => handleSave(0)}>
            保存草稿箱
          </Button>
          <Button danger className="w-28" onClick={() => handleSave(1)}>
            提交审核
          </Button>
        </>
      )}
    </div>
  );
  
  const next = () => {
    if (current === 0) {
      form.validateFields().then((values) => {
        setInfo(values);
        setCurrent(current + 1);
      });
    } else if (current === 1 && !content) {
      message.error("请输入内容");
    } else {
      setCurrent(current + 1);
    }
  };

  const prev = () => setCurrent(current - 1);

  return (
    <div>
      <Title level={3} className="float-left">
        {title}
      </Title>
      {contextHolder}
      <Steps current={current} items={steps} className="mt-[90px]" />
      <div className={`${current === 0 ? "" : "hidden"} mt-[90px]`}>
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 2.5 }}
          wrapperCol={{ span: 24 }}
          className="text-left"
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            label="新闻标题"
            name="title"
            rules={[{ required: true, message: "请输入新闻标题！" }]}
          >
            <Input type="text" allowClear />
          </Form.Item>
          <Form.Item
            label="新闻分类"
            name="categoryId"
            rules={[{ required: true, message: "请选择新闻分类！" }]}
          >
            <Select
              options={categoryList.map((item) => ({
                value: item.id,
                label: item.title,
              }))}
              allowClear
            />
          </Form.Item>
        </Form>
      </div>
      <div className={`${current === 1 ? "" : "hidden"} mt-4`}>
        <RichTextEditor value={content} onChange={handleEditorChange} />
      </div>
      <div className={`${current === 2 ? "" : "hidden"}`} />
      <div className="flex justify-between mt-5">{renderButtons()}</div>
    </div>
  );
};

NewsForm.propTypes = {
  newsData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    categoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    content: PropTypes.string,
    createTime: PropTypes.number,
    star: PropTypes.number,
    publishState: PropTypes.number,
    view: PropTypes.number,
  }),
  title: PropTypes.string.isRequired,
};

export default NewsForm;
