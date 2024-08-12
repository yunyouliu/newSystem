import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select } from "antd";
import PropTypes from "prop-types";

const UserForm = ({
  open,
  onCreate,
  onCancel,
  initialValues,
  roleList,
  regionList,
}) => {
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    form.resetFields(); // 重置表单字段
    if (initialValues && initialValues.roleId === 1) {
      setDisabled(true);
    }
    form.setFieldsValue(initialValues);
  }, [initialValues, form, open]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onCreate(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      open={open}
      title={initialValues ? "编辑用户" : "添加用户"}
      okText="确认"
      cancelText="取消"
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnClose
    >
      <Form form={form} layout="vertical" name="user_form">
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: "请输入用户名" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input type="password" />
        </Form.Item>
        <Form.Item
          name="region"
          label="区域"
          rules={[{ required: !disabled, message: "请选择区域" }]}
        >
          <Select
            disabled={disabled}
            options={regionList.map((region) => ({
              value: region.title,
              label: region.value,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="roleId"
          label="角色"
          rules={[{ required: true, message: "请选择角色" }]}
        >
          <Select
            onChange={(value) => {
              if (value === 1) {
                form.setFieldValue("region", "");
                setDisabled(true);
              } else {
                setDisabled(false);
              }
            }}
            options={roleList.map((role) => ({
              label: role.roleName,
              value: role.id,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

UserForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onCreate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  roleList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      roleName: PropTypes.string.isRequired,
    })
  ).isRequired,
  regionList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
    })
  ).isRequired,
};

export default UserForm;
