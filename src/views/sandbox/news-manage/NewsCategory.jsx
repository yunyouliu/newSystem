import React, { useState, useEffect, useRef, useContext } from "react";
import { Table, Button, Popconfirm, message, Form, Input } from "antd";
import axios from "axios";
import { DeleteOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

// Editable context to manage form instance
const EditableContext = React.createContext(null);

// Editable row component
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

// Editable cell component
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        className="m-0 "
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div onClick={toggleEdit} className="hover:font-bold ">
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

// Main component
export default function NewsCategory() {
  const [dataSource, setDataSource] = useState([]);

  // Fetch categories data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios("/categories");
        setDataSource(data);
      } catch (error) {
        message.error("数据获取失败");
      }
    };
    fetchData();
  }, []);

  // Handle deletion
  const handleDelete = async (item) => {
    try {
      setDataSource(dataSource.filter((data) => data.id !== item.id));
      await axios.delete(`/categories/${item.id}`);
      message.success("删除成功");
    } catch (error) {
      message.error("删除失败");
    }
  };

  // Handle save for editable cell
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
    // Update data in the database
    axios.patch(`/categories/${item.id}`, row);
  };

  // Table columns definition
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <b>{id}</b>,
    },
    {
      title: "分类名称",
      dataIndex: "title",
      key: "title",
      editable: true,
    },
    {
      title: "操作",
      render: (item) => (
        <Popconfirm
          title="确定删除吗？"
          onConfirm={() => handleDelete(item)}
          onCancel={() => message.error("取消删除")}
          okText="是"
          cancelText="否"
        >
          <Button
            shape="circle"
            title="删除"
            icon={<DeleteOutlined />}
            danger
          />
        </Popconfirm>
      ),
    },
  ];

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  // Configure columns for editing
  const editableColumns = columns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <Table
      dataSource={dataSource}
      columns={editableColumns}
      rowKey={(item) => item.id}
      components={components}
      pagination={{
        defaultCurrent: 1,
        defaultPageSize: 5,
        pageSizeOptions: [5, 10, 15, 20],
        showQuickJumper: true,
        showSizeChanger: true,
      }}
    />
  );
}

// Prop types validation
EditableCell.propTypes = {
  title: PropTypes.string,
  editable: PropTypes.bool,
  children: PropTypes.node,
  dataIndex: PropTypes.string,
  record: PropTypes.object,
  handleSave: PropTypes.func,
};

EditableRow.propTypes = {
  index: PropTypes.number,
};
