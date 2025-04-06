import React, { useEffect, useState } from "react";
import { Table, Form, Button, Modal, Space, Input, message } from "antd";
import {
  getCuisineList,
  deleteCuisine,
  updateCuisine,
} from "../../service/url";

type Category = {
  categoryId: number;
  categoryName: string;
};

const CuisineManagementPage: React.FC = () => {
  // 菜品数据
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [cuisineVisible, setCuisineVisible] = useState(false);
  const [tags, setTags] = useState<Category[]>([]);
  const [form] = Form.useForm();

  const handleDelete = async (categoryId: number) => {
    await deleteCuisine(categoryId);
    await getCuisineListData();
    message.success("删除菜系成功");
  };

  const handleSubmit = async () => {
    const validate = await form.validateFields();
    if (validate) {
      const params = form.getFieldsValue();
      params.categoryId = categoryId ? categoryId : undefined;
      params.categoryType = categoryId ? categoryId : tags.length + 1;
      await updateCuisine(params);
      getCuisineListData();
      message.success(categoryId ? "编辑菜系成功" : "新增菜系成功");
      setCuisineVisible(false);
    }
  };

  const addDish = async () => {
    form.resetFields();
    setCategoryId(null);
    setCuisineVisible(true);
  };

  const editCuisine = async (record: Category) => {
    form.setFieldsValue(record);
    setCategoryId(record.categoryId);
    setCuisineVisible(true);
  };

  const columns = [
    {
      title: "菜系ID",
      dataIndex: "categoryId",
      key: "categoryId",
    },
    {
      title: "菜系名称",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "操作",
      key: "action",
      render: (text: string, record: Category) => (
        <Space>
          <Button type="link" onClick={() => editCuisine(record)}>
            编辑
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record.categoryId)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const getCuisineListData = async () => {
    const res = await getCuisineList();
    setTags(res.data ?? []);
  };

  // 获取菜品数据
  useEffect(() => {
    getCuisineListData();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 12,
        }}
      >
        <Button type="primary" onClick={addDish}>
          新增菜系
        </Button>
      </div>
      <Table
        dataSource={tags}
        columns={columns}
        rowKey="categoryId"
        pagination={false}
      />
      <Modal
        maskClosable={false}
        title={!categoryId ? "新增菜系" : "编辑菜系"}
        open={cuisineVisible}
        onOk={handleSubmit}
        okText="提交"
        cancelText="取消"
        onCancel={() => setCuisineVisible(false)}
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            name="categoryName"
            label="菜系名称"
            rules={[{ required: true, message: "请输入菜系名称" }]}
          >
            <Input placeholder="请输入菜系名称" allowClear />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CuisineManagementPage;
