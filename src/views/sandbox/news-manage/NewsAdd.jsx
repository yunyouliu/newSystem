import React, { useState, useEffect } from "react";
import { Button, Typography, Steps, Input, Form, Select } from "antd";
import axios from "axios";
import RichTextEditor from "@components/tinymce/RichTextEditor";

const { Title } = Typography;

const NewsAdd = () => {
  const [current, setCurrent] = useState(1);
  const [categoryList, setcategoryList] = useState([]);
  const [content, setContent] = useState("");
  const [form] = Form.useForm();

  const steps = [
    {
      title: "基本信息",
      description: "新闻标题，新闻分类",
    },
    {
      title: "新闻主题",
      description: "新闻主体内容",
    },
    {
      title: "新闻提交",
      description: "保存草稿或提交审核",
    },
  ];

  const next = () => {
    current === 0
      ? form.validateFields().then((values) => {
          console.log("values", values);
          setCurrent(current + 1);
        })
      : "";
  };
  const prev = () => setCurrent(current - 1);
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const renderButtons = () => {
    return (
      <>
        {current < steps.length - 1 && (
          <Button
            type="primary"
            onClick={next}
            className="w-28" // 固定宽度
          >
            下一步
          </Button>
        )}
        {current > 0 && (
          <Button
            onClick={prev}
            className="w-28" // 固定宽度
          >
            上一步
          </Button>
        )}
        {current === steps.length - 1 && (
          <div className="flex space-x-4">
            <Button
              type="primary"
              className="w-28" // 固定宽度
            >
              保存草稿箱
            </Button>
            <Button
              danger
              className="w-28" // 固定宽度
            >
              提交审核
            </Button>
          </div>
        )}
      </>
    );
  };

  useEffect(() => {
    axios.get("/categories").then((res) => {
      // console.log(res);
      setcategoryList(res.data);
    });
  }, []);

  return (
    <div className="">
      <Title level={3} className="float-left">
        新闻撰写
      </Title>
      <Steps current={current} items={steps} className="mt-[90px]" />
      <div className={`${current === 0 ? "" : "hidden"} mt-[90px]`}>
        <Form
          name="basic"
          form={form}
          labelCol={{
            span: 2.5, // Label 的宽度占容器宽度的比例
          }}
          wrapperCol={{
            span: 24, // Form 控件的宽度占容器宽度的比例
          }}
          className="text-left"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="新闻标题"
            name="title"
            rules={[
              {
                required: true,
                message: "Please input your title!",
              },
            ]}
          >
            <Input type="text" allowClear />
          </Form.Item>

          <Form.Item
            label="新闻分类"
            name="categoryId"
            rules={[
              {
                required: true,
                message: "Please select your category!",
              },
            ]}
          >
            <Select
              options={categoryList.map((item) => {
                return { value: item.id, label: item.title };
              })}
              allowClear
            />
          </Form.Item>
        </Form>
      </div>

      <div className={`${current == 1 ? "" : "hidden"}`}>
        <RichTextEditor initialValue={content} onChange={() => {}} />
      </div>
      <div className={`${current == 2 ? "" : "hidden"}`}></div>
      <div className="flex justify-between mt-20">
        <div className="flex space-x-4">{renderButtons()}</div>
      </div>
    </div>
  );
};

export default NewsAdd;
