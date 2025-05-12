import React, { useEffect, useState } from "react";
import { Table, Form, Input, Button, Space, Select, Image, message } from "antd";
import { getOrderList, finishOrder } from "../../../service/url";

type OrderDetail = {
  detailId: string;
  orderId: string;
  productId: string;
  productName: string;
  productPrice: number;
}

type Order = {
  orderId: string;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  buyerOpenid: string;
  orderAmount: number;
  orderStatus: number;
  payStatus: number;
  payType: string;
  orderStatusStr: string;
  payStatusStr: string;
  createTime: string;
  updateTime: string;
  orderDetailList: OrderDetail[];
}

const PaidOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    pageNo: 1,
    pageSize: 10,
  });
  // 筛选表单
  const [filterForm] = Form.useForm();

  const getListData = async () => {
    const params = {
      page: pagination.pageNo,
      size: pagination.pageSize,
    };
    const filterParams = filterForm.getFieldsValue();
    filterParams.orderStatus = 1;
    const res = await getOrderList({ ...params, ...filterParams });
    if (res.code === 0) {
      setOrders(res.data.list ?? []);
      setPagination(res.data.page);
    }
  };

  const finishOrderHandle = async (record: Order) => {
    const res = await finishOrder(record.orderId);
    if (res.code === 0) {
      message.success("订单完结成功");
      getListData();
    }
  };

  const handleFilterSubmit = () => {
    getListData();
  };

  const handleFilterReset = () => {
    filterForm.resetFields();
    getListData();
  };

  // 表格列定义
  const columns = [
    {
      title: "序号",
      dataIndex: "id",
      key: "id",
      render: (value, row, index) => {
        return index + 1;
      },
    },
    {
      title: "订单编号",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "商品名称",
      dataIndex: "productName",
      key: "productName",
      render: (value, row) => {
        const [item] = row.orderDetailList ?? [];
        return item.productName;
      },
    },
    {
      title: "商品图片",
      dataIndex: "productIcon",
      key: "productIcon",
      render: (value, row) => {
        const [item] = row.orderDetailList ?? [];
        return <Image src={item.productIcon} width={50} height={50} />;
      },
    },
    {
      title: "购买数量",
      dataIndex: "productQuantity",
      key: "productQuantity",
      render: (value, row) => {
        const [item] = row.orderDetailList ?? [];
        return item.productQuantity;
      },
    },
    {
      title: "单价",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (value, row) => {
        const [item] = row.orderDetailList ?? [];
        return `¥${item.productPrice.toFixed(2)}`;
      },
    },
    {
      title: "总价",
      dataIndex: "orderAmount",
      key: "orderAmount",
      render: (value) => {
        return `¥${value.toFixed(2)}`;
      },
    },
    {
      title: "支付类型",
      dataIndex: "paymentType",
      key: "paymentType",
    },
    {
      title: "状态",
      dataIndex: "orderStatusStr",
      key: "orderStatusStr",
    },
    {
      title: "地址",
      dataIndex: "buyerAddress",
      key: "buyerAddress",
    },
    {
      title: "手机号码",
      dataIndex: "buyerPhone",
      key: "buyerPhone",
    },
    {
      title: "收货人",
      dataIndex: "buyerName",
      key: "buyerName",
    },
    {
      title: "下单时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space>
        <Button type="link" onClick={() => finishOrderHandle(record)}>
          完结订单
        </Button>
      </Space>
      ),
    },
  ];

  useEffect(() => {
    getListData();
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {/* 筛选表单 */}
      <Form form={filterForm} layout="inline" autoComplete="off">
        <Form.Item name="orderId" label="订单编号">
          <Input placeholder="请输入订单编号" allowClear />
        </Form.Item>
        <Form.Item name="productName" label="商品名称">
          <Input placeholder="请输入商品名称" allowClear />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            style={{ marginRight: "10px" }}
            onClick={getListData}
          >
            筛选
          </Button>
          <Button onClick={handleFilterReset}>重置</Button>
        </Form.Item>
      </Form>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="orderId"
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
        style={{ marginTop: 12 }}
      />
    </div>
  );
};

export default PaidOrders;
