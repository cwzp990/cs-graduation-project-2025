import React, { useEffect, useState } from "react";
import {
  Table,
  Form,
  Button,
  Modal,
  Space,
  Select,
  Input,
  message,
  Image,
} from "antd";
import dayjs from "dayjs";
import {
  getDishes,
  updateDish,
  changeDishStatus,
  getCuisineList,
} from "../../service/url";

type Dish = {
  productId: number;
  productName: string;
  productIcon: string;
  productPrice: number;
  productStock: number;
  productDescription: string;
  categoryType: number;
  productStatus: number;
  createTime: string;
  updateTime: string;
};

type Category = {
  categoryId: number;
  categoryName: string;
};

const DishManagementPage: React.FC = () => {
  // 菜品数据
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    pageSize: 10,
    pageNo: 1,
  });
  const [dishVisible, setDishVisible] = useState(false);
  const [dishId, setDishId] = useState<number | null>(null);
  const [tags, setTags] = useState<Category[]>([]);
  const [filterForm] = Form.useForm();
  const [form] = Form.useForm();

  const handleFilterReset = () => {
    filterForm.resetFields();
    getDishesData();
  };

  const handleSubmit = async () => {
    const validate = await form.validateFields();
    if (validate) {
      const params = form.getFieldsValue();
      params.productId = dishId ? dishId : undefined;
      await updateDish(params);
      await getDishesData();
      message.success(dishId ? "编辑菜品成功" : "新增菜品成功");
      setDishVisible(false);
    }
  };

  const editDish = async (record: Dish) => {
    setDishId(record.productId);
    form.setFieldsValue(record);
    setDishVisible(true);
  };

  const addDish = async () => {
    setDishId(null);
    form.resetFields();
    setDishVisible(true);
  };

  const changeStatus = async (record: Dish) => {
    Modal.confirm({
      title: '确认操作',
      content: `确定要${record.productStatus === 0 ? '下架' : '上架'}这个菜品吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await changeDishStatus(record.productStatus, record.productId);
        getDishesData();
        message.success(
          record.productStatus === 0 ? "下架菜品成功" : "上架菜品成功"
        );
      }
    });
  };

  const columns = [
    {
      title: "菜品名称",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "菜系",
      dataIndex: "categoryType",
      key: "categoryType",
      render: (categoryId: number) => {
        const category = tags.find((tag) => tag.categoryId === categoryId);
        return category?.categoryName || "-";
      },
    },
    {
      title: "图片",
      dataIndex: "productIcon",
      key: "productIcon",
      render: (url: string) => <Image src={url} width={100} height={100} />,
    },
    {
      title: "价格",
      dataIndex: "productPrice",
      key: "productPrice",
      render: (value: number) => `¥${value.toFixed(2)}`,
    },
    {
      title: "库存",
      dataIndex: "productStock",
      key: "productStock",
    },
    {
      title: "描述",
      dataIndex: "productDescription",
      key: "productDescription",
      ellipsis: true,
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      key: "updateTime",
      render: (time: string) => dayjs(time).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "状态",
      dataIndex: "productStatus",
      key: "productStatus",
      render: (status: number) => (status === 0 ? "上架" : "下架"),
    },
    {
      title: "操作",
      key: "action",
      render: (text: string, record: Dish) => (
        <Space>
          <Button type="link" danger onClick={() => changeStatus(record)}>
            {record.productStatus === 0 ? "下架" : "上架"}
          </Button>
          <Button type="link" onClick={() => editDish(record)}>
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  const getDishesData = async () => {
    const params = filterForm.getFieldsValue();
    const res = await getDishes(params);
    setDishes(res.data.list ?? []);
    setPagination(res.data.page);
  };

  const getCuisineListData = async () => {
    const res = await getCuisineList();
    setTags(res.data ?? []);
  };

  // 获取菜品数据
  useEffect(() => {
    getDishesData();
    getCuisineListData();
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {/* 筛选表单 */}
      <Form form={filterForm} layout="inline" autoComplete="off">
        <Form.Item name="name" label="菜品名称">
          <Input placeholder="请输入菜品名称" allowClear />
        </Form.Item>
        <Form.Item name="cuisine" label="菜系">
          <Select
            showSearch
            allowClear
            placeholder="请选择菜系"
            fieldNames={{ label: "categoryName", value: "categoryId" }}
            options={tags}
          />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select
            allowClear
            placeholder="请选择状态"
            options={[
              { label: "上架", value: 0 },
              { label: "下架", value: 1 },
            ]}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={getDishesData}
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
        style={{ position: "absolute", top: 0, right: 0 }}
        onClick={addDish}
      >
        新增菜品
      </Button>
      <Table
        dataSource={dishes}
        columns={columns}
        style={{ marginTop: 12 }}
        rowKey="productId"
        pagination={{
          size: "small",
          total: pagination.totalCount || 0,
          pageSizeOptions: [10, 20, 50],
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          current: pagination.pageNo,
          pageSize: pagination.pageSize,
        }}
      />

      <Modal
        maskClosable={false}
        title={!dishId ? "新增菜品" : "编辑菜品"}
        open={dishVisible}
        onOk={handleSubmit}
        okText="提交"
        cancelText="取消"
        onCancel={() => setDishVisible(false)}
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            name="productName"
            label="菜品名称"
            rules={[{ required: true, message: "请输入菜品名称" }]}
          >
            <Input placeholder="请输入菜品名称" allowClear />
          </Form.Item>
          <Form.Item
            name="categoryType"
            label="菜系"
            rules={[{ required: true, message: "请选择菜系" }]}
          >
            <Select
              showSearch
              allowClear
              fieldNames={{ label: "categoryName", value: "categoryId" }}
              options={tags}
              placeholder="请选择菜系"
            />
          </Form.Item>
          <Form.Item
            name="productIcon"
            label="图片"
            rules={[{ required: true, message: "请输入图片地址" }]}
          >
            <Input placeholder="请输入图片地址" allowClear />
          </Form.Item>
          <Form.Item
            name="productPrice"
            label="价格"
            rules={[{ required: true, message: "请输入价格" }]}
          >
            <Input placeholder="请输入价格" allowClear />
          </Form.Item>
          <Form.Item
            name="productStock"
            label="库存"
            rules={[{ required: true, message: "请输入库存" }]}
          >
            <Input placeholder="请输入库存" allowClear />
          </Form.Item>
          <Form.Item
            name="productDescription"
            label="描述"
            rules={[{ required: true, message: "请输入描述" }]}
          >
            <Input placeholder="请输入描述" allowClear />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DishManagementPage;
