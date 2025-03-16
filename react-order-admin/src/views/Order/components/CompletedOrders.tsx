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

// 定义订单数据类型
type Order = {
  id: number;
  orderNumber: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  paymentType: string;
  status: string;
  address: string;
  phoneNumber: string;
  receiver: string;
};

const CompletedOrders: React.FC = () => {
  // 模拟订单数据
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      orderNumber: "ORD001",
      productName: "宫保鸡丁",
      productImage: "path/to/image1.jpg",
      quantity: 2,
      unitPrice: 28,
      totalPrice: 56,
      paymentType: "微信支付",
      status: "已完成",
      address: "北京市朝阳区",
      phoneNumber: "13800138000",
      receiver: "张三",
    },
    {
      id: 2,
      orderNumber: "ORD002",
      productName: "糖醋排骨",
      productImage: "path/to/image2.jpg",
      quantity: 1,
      unitPrice: 32,
      totalPrice: 32,
      paymentType: "支付宝支付",
      status: "已完成",
      address: "上海市浦东新区",
      phoneNumber: "13900139000",
      receiver: "李四",
    },
  ]);

  // 新增/编辑表单
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // 筛选表单
  const [filterForm] = Form.useForm();
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);

  const handleFilterReset = () => {
    filterForm.resetFields();
    setFilteredOrders(orders);
  };

  // 显示新增/编辑模态框
  const showModal = (order?: Order) => {
    if (order) {
      setEditingOrder(order);
      form.setFieldsValue({
        orderNumber: order.orderNumber,
        productName: order.productName,
        productImage: order.productImage,
        quantity: order.quantity,
        unitPrice: order.unitPrice,
        totalPrice: order.totalPrice,
        paymentType: order.paymentType,
        status: order.status,
        address: order.address,
        phoneNumber: order.phoneNumber,
        receiver: order.receiver,
      });
    } else {
      setEditingOrder(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingOrder) {
        // 更新订单信息
        setOrders(
          orders.map((order) =>
            order.id === editingOrder.id ? { ...order, ...values } : order
          )
        );
      } else {
        // 新增订单信息
        const newOrder: Order = {
          id: orders.length > 0 ? orders[orders.length - 1].id + 1 : 1,
          ...values,
        };
        setOrders([...orders, newOrder]);
      }
      setIsModalVisible(false);
    } catch (error) {
      console.log("Form validation error:", error);
    }
  };

  // 处理删除订单
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "确认删除",
      content: "你确定要删除这个订单吗？",
      okText: "确定",
      cancelText: "取消",
      onOk: () => {
        setOrders(orders.filter((order) => order.id !== id));
      },
      onCancel: () => {
        // 用户取消删除操作，可留空或添加其他逻辑
      },
    });
  };

  // 处理筛选表单提交
  const handleFilterSubmit = async () => {
    const values = await filterForm.validateFields();
    const { orderNumber, productName, paymentType, status } = values;
    let filtered = orders;
    if (orderNumber) {
      filtered = filtered.filter((order) =>
        order.orderNumber.includes(orderNumber)
      );
    }
    if (productName) {
      filtered = filtered.filter((order) =>
        order.productName.includes(productName)
      );
    }
    if (paymentType) {
      filtered = filtered.filter((order) => order.paymentType === paymentType);
    }
    if (status) {
      filtered = filtered.filter((order) => order.status === status);
    }
    setFilteredOrders(filtered);
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
            console.log(
              "订单",
              record.orderNumber,
              "勾选状态:",
              e.target.checked
            );
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
      title: "订单编号",
      dataIndex: "orderNumber",
      key: "orderNumber",
    },
    {
      title: "商品名称",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "商品图片",
      dataIndex: "productImage",
      key: "productImage",
      render: (image) => <img src={image} alt="商品图片" width={50} />,
    },
    {
      title: "购买数量",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "单价",
      dataIndex: "unitPrice",
      key: "unitPrice",
    },
    {
      title: "总价",
      dataIndex: "totalPrice",
      key: "totalPrice",
    },
    {
      title: "支付类型",
      dataIndex: "paymentType",
      key: "paymentType",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "地址",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "手机号码",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "收货人",
      dataIndex: "receiver",
      key: "receiver",
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

  // 支付类型选项
  const paymentTypeOptions = Array.from(
    new Set(orders.map((order) => order.paymentType))
  ).map((paymentType) => ({
    value: paymentType,
    label: paymentType,
  }));

  // 状态选项
  const statusOptions = Array.from(
    new Set(orders.map((order) => order.status))
  ).map((status) => ({
    value: status,
    label: status,
  }));

  return (
    <div style={{ position: "relative" }}>
      {/* 筛选表单 */}
      <Form form={filterForm} layout="inline" onFinish={handleFilterSubmit} autoComplete="off">
        <Form.Item name="orderNumber" label="订单编号">
          <Input placeholder="请输入订单编号" allowClear autoComplete="off" />
        </Form.Item>
        <Form.Item name="productName" label="商品名称">
          <Input placeholder="请输入商品名称" allowClear autoComplete="off" />
        </Form.Item>
        <Form.Item name="paymentType" label="支付类型">
          <Select
            options={paymentTypeOptions}
            placeholder="请选择支付类型"
            allowClear
          />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select options={statusOptions} placeholder="请选择状态" allowClear />
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
      <Table
        dataSource={filteredOrders}
        columns={columns}
        rowKey="id"
        style={{ marginTop: "16px" }}
      />
      <Modal
        title={editingOrder ? "修改订单" : "新增订单"}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="订单编号"
            name="orderNumber"
            rules={[{ required: true, message: "请输入订单编号!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="商品名称"
            name="productName"
            rules={[{ required: true, message: "请输入商品名称!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="商品图片链接"
            name="productImage"
            rules={[{ required: true, message: "请输入商品图片链接!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="购买数量"
            name="quantity"
            rules={[{ required: true, message: "请输入购买数量!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="单价"
            name="unitPrice"
            rules={[{ required: true, message: "请输入单价!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="总价"
            name="totalPrice"
            rules={[{ required: true, message: "请输入总价!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="支付类型"
            name="paymentType"
            rules={[{ required: true, message: "请选择支付类型!" }]}
          >
            <Select options={paymentTypeOptions} />
          </Form.Item>
          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: "请选择状态!" }]}
          >
            <Select options={statusOptions} />
          </Form.Item>
          <Form.Item
            label="地址"
            name="address"
            rules={[{ required: true, message: "请输入地址!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="手机号码"
            name="phoneNumber"
            rules={[{ required: true, message: "请输入手机号码!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="收货人"
            name="receiver"
            rules={[{ required: true, message: "请输入收货人!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CompletedOrders;
