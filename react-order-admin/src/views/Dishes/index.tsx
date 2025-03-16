import React, { useState } from "react";
import {
  Table,
  Form,
  Input,
  Button,
  Modal,
  Space,
  Checkbox,
  Select,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

type Dish = {
  id: number;
  name: string;
  cuisine: string;
  image: string;
  description: string;
  price: number;
  stock: number;
};

const DishManagementPage: React.FC = () => {
  // 模拟菜品数据
  const [dishes, setDishes] = useState<Dish[]>([
    {
      id: 1,
      name: "宫保鸡丁",
      cuisine: "川菜",
      image: "path/to/image1.jpg",
      description: "经典川菜，鲜香可口",
      price: 28,
      stock: 100,
    },
    {
      id: 2,
      name: "糖醋排骨",
      cuisine: "浙菜",
      image: "path/to/image2.jpg",
      description: "色泽红亮，酸甜适口",
      price: 32,
      stock: 80,
    },
  ]);

  // 新增/编辑表单
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  // 筛选表单
  const [filterForm] = Form.useForm();
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>(dishes);

  const handleFilterReset = () => {
    filterForm.resetFields();
    setFilteredDishes(dishes);
  };

  // 显示新增/编辑模态框
  const showModal = (dish?: Dish) => {
    if (dish) {
      setEditingDish(dish);
      form.setFieldsValue({
        name: dish.name,
        cuisine: dish.cuisine,
        image: dish.image,
        description: dish.description,
        price: dish.price,
        stock: dish.stock,
      });
    } else {
      setEditingDish(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingDish) {
        // 更新菜品信息
        setDishes(
          dishes.map((dish) =>
            dish.id === editingDish.id ? { ...dish, ...values } : dish
          )
        );
      } else {
        // 新增菜品信息
        const newDish: Dish = {
          id: dishes.length > 0 ? dishes[dishes.length - 1].id + 1 : 1,
          ...values,
        };
        setDishes([...dishes, newDish]);
      }
      setIsModalVisible(false);
    } catch (error) {
      console.log("Form validation error:", error);
    }
  };

  // 处理删除菜品
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "确认删除",
      content: "你确定要删除这道菜品吗？",
      okText: "确定",
      cancelText: "取消",
      onOk: () => {
        setDishes(dishes.filter((dish) => dish.id !== id));
      },
      onCancel: () => {
        // 用户取消删除操作，可留空或添加其他逻辑
      },
    });
  };

  // 处理筛选表单提交
  const handleFilterSubmit = async () => {
    const values = await filterForm.validateFields();
    const { name, cuisine } = values;
    let filtered = dishes;
    if (name) {
      filtered = filtered.filter((dish) => dish.name.includes(name));
    }
    if (cuisine) {
      filtered = filtered.filter((dish) => dish.cuisine === cuisine);
    }
    setFilteredDishes(filtered);
  };

  // 表格列定义
  const columns = [
    {
      title: (
        <Checkbox
          onChange={(e) => {
            // 全选逻辑，这里简单打印日志，可按需实现
            console.log("全选状态:", e.target.checked);
          }}
        />
      ),
      dataIndex: "checkbox",
      key: "checkbox",
      render: (_, record) => (
        <Checkbox
          onChange={(e) => {
            // 单个勾选逻辑，这里简单打印日志，可按需实现
            console.log("菜品", record.name, "勾选状态:", e.target.checked);
          }}
        />
      ),
    },
    {
      title: "序号",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "菜品名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "菜系",
      dataIndex: "cuisine",
      key: "cuisine",
    },
    {
      title: "图片",
      dataIndex: "image",
      key: "image",
      render: (image) => <img src={image} alt="菜品图片" width={50} />,
    },
    {
      title: "菜品介绍",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "价格",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "库存数量",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showModal(record)}>
            修改
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            danger
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 菜系选项
  const cuisineOptions = Array.from(
    new Set(dishes.map((dish) => dish.cuisine))
  ).map((cuisine) => ({
    value: cuisine,
    label: cuisine,
  }));

  return (
    <div style={{ position: "relative" }}>
      {/* 筛选表单 */}
      <Form form={filterForm} layout="inline" onFinish={handleFilterSubmit}>
        <Form.Item name="name" label="菜品名称">
          <Input placeholder="请输入菜品名称" allowClear autoComplete="off" />
        </Form.Item>
        <Form.Item name="cuisine" label="菜系">
          <Select
            options={cuisineOptions}
            placeholder="请选择菜系"
            allowClear
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: "10px" }}
          >
            筛选
          </Button>
          <Button onClick={handleFilterReset}>重置</Button>
        </Form.Item>
      </Form>
      {/* 新增菜品按钮，使用绝对定位到右上方 */}
      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ position: "absolute", top: 0, right: 0 }}
      >
        新增菜品
      </Button>
      <Table
        dataSource={filteredDishes}
        columns={columns}
        rowKey="id"
        style={{ marginTop: "16px" }}
      />
      <Modal
        title={editingDish ? "修改菜品" : "新增菜品"}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            label="菜品名称"
            name="name"
            rules={[{ required: true, message: "请输入菜品名称!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="菜系"
            name="cuisine"
            rules={[{ required: true, message: "请输入菜系!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="图片链接"
            name="image"
            rules={[{ required: true, message: "请输入图片链接!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="菜品介绍"
            name="description"
            rules={[{ required: true, message: "请输入菜品介绍!" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="价格"
            name="price"
            rules={[{ required: true, message: "请输入价格!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="库存数量"
            name="stock"
            rules={[{ required: true, message: "请输入库存数量!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DishManagementPage;
